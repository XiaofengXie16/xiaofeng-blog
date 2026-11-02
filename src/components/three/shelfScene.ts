import * as THREE from "three";
import { cycle } from "~/utils/array";
import {
  bounceDrop,
  columnCenters,
  easeOutBack,
  springStep,
  stagger,
  type Spring,
} from "~/utils/motion";
import {
  clay,
  disposeScene,
  fitToCanvas,
  makeRenderer,
  mesh,
  prefersReducedMotion,
  radialTexture,
  runWhileVisible,
  softLights,
  starTexture,
} from "./kit";

export type ShelfHandle = {
  /** The book that stays pulled out (select mode), or null. */
  setPicked: (index: number | null) => void;
  /** Lifts a book while its label has keyboard focus, or null. */
  setHighlight: (index: number | null) => void;
  dispose: () => void;
};

type Book = {
  pivot: THREE.Group;
  hinge: THREE.Group;
  hit: THREE.Mesh[];
  spineMats: THREE.MeshStandardMaterial[];
  lean: number;
  lift: Spring;
  open: Spring;
  spin: number;
};

// Real-ish proportions: [height, width, depth], before scaling to fit.
const SIZES: readonly [[number, number, number], ...[number, number, number][]] = [
  [3.05, 2.05, 0.55],
  [2.8, 1.85, 0.42],
  [3.2, 2.1, 0.46],
  [2.9, 1.95, 0.36],
  [2.75, 1.8, 0.38],
  [3.1, 2.05, 0.6],
];
const LEANS = [0.03, -0.04, 0, 0.05, -0.03, 0.02] as const;

/**
 * Real books on a soft white ledge. They drop onto the shelf one by one, sway
 * a little at rest, slide out with their cover swinging open on hover, and do
 * a full spin when clicked before `onActivate` fires.
 */
export function mountShelf3D(
  canvas: HTMLCanvasElement,
  { covers, onActivate }: { covers: readonly string[]; onActivate: (index: number) => void },
): ShelfHandle {
  const reduce = prefersReducedMotion();
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 80);
  camera.position.set(0, 4.2, 13.2);
  camera.lookAt(0, 1, 0);
  softLights(scene, "#D6D2F4", "#F3D7C6");

  const pagesMat = new THREE.MeshStandardMaterial({ color: "#F6F0E2", roughness: 0.9 });
  const shelfMat = clay("#FBF7F3", 0.7);
  const ledge = mesh(new THREE.BoxGeometry(1, 0.36, 2.2), shelfMat);
  ledge.position.y = -0.18;
  scene.add(ledge);
  const lip = mesh(new THREE.CapsuleGeometry(0.2, 1, 8, 24), shelfMat);
  lip.rotation.z = Math.PI / 2;
  lip.position.set(0, -0.18, 1.1);
  scene.add(lip);

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.6),
    new THREE.MeshBasicMaterial({
      map: radialTexture("rgba(150,170,255,.55)"),
      transparent: true,
      depthWrite: false,
    }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.012;
  glow.visible = false;
  scene.add(glow);

  const loader = new THREE.TextureLoader();
  const books: Book[] = covers.map((src, i) => {
    const [h, w, d] = cycle(SIZES, i);
    const spineMat = clay("#D9D4CC", 0.6);
    const backMat = clay("#D9D4CC", 0.6);
    const coverMat = new THREE.MeshStandardMaterial({ roughness: 0.55, color: "#ffffff" });
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      coverMat.map = tex;
      coverMat.needsUpdate = true;
      const spine = spineColorOf(tex.image as CanvasImageSource);
      if (spine) for (const m of [spineMat, backMat]) m.color.set(spine);
    });

    const pivot = new THREE.Group();
    scene.add(pivot);
    const t = 0.035; // board thickness
    const pages = mesh(new THREE.BoxGeometry(w - t * 1.5, h - 0.08, d - t * 2), pagesMat);
    pages.position.set(t * 0.75, h / 2, 0);
    const back = mesh(new THREE.BoxGeometry(w, h, t), backMat);
    back.position.set(0, h / 2, -d / 2 + t / 2);
    const spine = mesh(new THREE.BoxGeometry(t * 1.5, h, d), spineMat);
    spine.position.set(-w / 2 + t * 0.75, h / 2, 0);
    // The front cover hangs on a hinge at the spine so it can swing open.
    const hinge = new THREE.Group();
    hinge.position.set(-w / 2, 0, d / 2 - t / 2);
    const cover = mesh(new THREE.BoxGeometry(w, h, t), [
      spineMat,
      spineMat,
      spineMat,
      spineMat,
      coverMat,
      pagesMat,
    ]);
    cover.position.set(w / 2, h / 2, 0);
    hinge.add(cover);
    pivot.add(pages, back, spine, hinge);
    return {
      pivot,
      hinge,
      hit: [pages, back, spine, cover],
      spineMats: [spineMat, backMat],
      lean: cycle(LEANS, i),
      lift: { value: 0, velocity: 0 },
      open: { value: 0, velocity: 0 },
      spin: 1,
    };
  });

  // Sparkle burst when a book is picked.
  const starMap = starTexture();
  const sparks = Array.from({ length: 24 }, () => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: starMap, transparent: true, depthWrite: false }),
    );
    sprite.visible = false;
    scene.add(sprite);
    return { sprite, v: new THREE.Vector3(), life: 0 };
  });
  const burst = (at: THREE.Vector3) => {
    sparks.forEach((s, i) => {
      const a = (i / sparks.length) * Math.PI * 2;
      s.sprite.position.copy(at);
      s.sprite.scale.setScalar(0.25 + Math.random() * 0.15);
      s.sprite.material.color.set(["#FFFFFF", "#FFE7A8", "#FFC7D6", "#CFE0FF"][i % 4] ?? "#fff");
      s.v.set(Math.cos(a) * 3, Math.sin(a) * 3 + 1.5, 1);
      s.life = 0.9;
      s.sprite.visible = true;
    });
  };

  /** Spreads the books across the canvas so they line up with the labels below. */
  const layout = () => {
    const dist = camera.position.distanceTo(new THREE.Vector3(0, 1, 0));
    const visibleW = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const xs = columnCenters(books.length, visibleW);
    const col = visibleW / Math.max(1, books.length);
    const scale = Math.min(0.8, (col * 0.66) / 2.1);
    books.forEach((b, i) => {
      b.pivot.userData.x = xs[i] ?? 0;
      b.pivot.scale.setScalar(scale);
    });
    ledge.scale.x = visibleW * 0.98;
    lip.scale.y = visibleW * 0.96;
    glow.scale.setScalar(scale / 0.74);
  };

  let picked: number | null = null;
  let highlight: number | null = null;
  let hovered: number | null = null;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  };
  const onLeave = () => ndc.set(9, 9);
  const at = new THREE.Vector3();
  const onClick = () => {
    if (hovered === null) return;
    const i = hovered;
    const book = books[i];
    if (!book) return;
    if (!reduce) {
      book.spin = 0;
      book.pivot.getWorldPosition(at);
      at.y += 1.6;
      burst(at);
    }
    onActivate(i);
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  const stop = runWhileVisible(canvas, (dt, t) => {
    if (fitToCanvas(renderer, camera)) layout();

    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(books.flatMap((b) => b.hit))[0];
    hovered = hit ? books.findIndex((b) => b.hit.includes(hit.object as THREE.Mesh)) : null;
    if (hovered === -1) hovered = null;
    canvas.style.cursor = hovered === null ? "default" : "pointer";
    const active = hovered ?? highlight;

    books.forEach((b, i) => {
      const lifted = active === i || picked === i;
      springStep(b.lift, lifted ? 1 : 0, dt, reduce ? 400 : 140, reduce ? 40 : 13);
      springStep(b.open, active === i && !reduce ? 1 : 0, dt, 90, 11);
      b.spin = Math.min(1, b.spin + dt * 1.4);

      // Neighbours of the active book lean away from it.
      const away =
        active === null || reduce
          ? 0
          : Math.sign(i - active) * (Math.abs(i - active) === 1 ? 0.07 : 0);
      const drop = reduce ? 0 : bounceDrop(stagger(t, i, 0.12, 0.9)) * 3.2;
      const sway = reduce ? 0 : Math.sin(t * 1.1 + i * 1.7) * 0.012;
      const l = b.lift.value;

      b.pivot.position.set(
        (b.pivot.userData.x as number | undefined) ?? 0,
        drop + l * 0.45,
        l * 0.75,
      );
      // Books turn slightly towards the middle so their spines and pages show.
      const x = (b.pivot.userData.x as number | undefined) ?? 0;
      const facing = -x * 0.055 * (1 - l);
      b.pivot.rotation.set(
        -l * 0.05,
        facing + easeOutBack(b.spin) * Math.PI * 2,
        (b.lean + sway) * (1 - l) + away,
      );
      b.hinge.rotation.y = -b.open.value * 0.65;
    });

    const glowAt = picked === null ? null : books[picked];
    glow.visible = Boolean(glowAt);
    if (glowAt) {
      glow.position.x = glowAt.pivot.position.x;
      (glow.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 2.4) * 0.25;
    }

    for (const s of sparks) {
      if (!s.sprite.visible) continue;
      s.life -= dt;
      if (s.life <= 0) {
        s.sprite.visible = false;
        continue;
      }
      s.v.multiplyScalar(1 - 2.2 * dt);
      s.sprite.position.addScaledVector(s.v, dt);
      s.sprite.material.opacity = Math.min(1, s.life * 2);
      s.sprite.material.rotation += dt * 3;
    }

    renderer.render(scene, camera);
  });

  return {
    setPicked: (i) => (picked = i),
    setHighlight: (i) => (highlight = i),
    dispose: () => {
      stop();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      disposeScene(scene, renderer);
    },
  };
}

/** Averages the left edge of a cover to colour its spine and back to match. */
function spineColorOf(image: CanvasImageSource) {
  try {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 32;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const src = image as HTMLImageElement;
    ctx.drawImage(image, 0, 0, Math.max(1, src.width * 0.08), src.height, 0, 0, 8, 32);
    const data = ctx.getImageData(0, 0, 8, 32).data;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i] ?? 0;
      g += data[i + 1] ?? 0;
      b += data[i + 2] ?? 0;
    }
    const n = data.length / 4;
    return new THREE.Color(r / n / 255, g / n / 255, b / n / 255)
      .convertSRGBToLinear()
      .multiplyScalar(0.85);
  } catch {
    return null;
  }
}
