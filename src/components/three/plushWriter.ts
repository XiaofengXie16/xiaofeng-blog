import * as THREE from "three";
import { blinkAmount, easeOutBack, springStep, type Spring } from "~/utils/motion";
import {
  disposeScene,
  fitToCanvas,
  makeRenderer,
  mesh,
  plush,
  prefersReducedMotion,
  radialTexture,
  runWhileVisible,
  softLights,
  starTexture,
} from "./kit";

type Spark = {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  spin: number;
};

/**
 * A cute plush version of the writer. He pops in, breathes, blinks and follows
 * the cursor; hovering makes him scribble sparkles into the sky and clicking
 * makes him hop and spin with a burst of stars. Returns a cleanup function.
 */
export function mountPlushWriter(canvas: HTMLCanvasElement) {
  const reduce = prefersReducedMotion();
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0.2, 2.3, 10.5);
  camera.lookAt(0.2, 1.75, 0);
  softLights(scene);

  const skin = plush("#FAD3BC", "#FFE9DC");
  const sweater = plush("#7CC2A8", "#D8FFF0");
  const sweaterDark = plush("#62AA90", "#CFF5E6");
  const pants = plush("#6E78C2", "#D6DCFF");
  const shoeMat = plush("#8A5A44", "#F2C9B3");
  const hairMat = plush("#3A2E2A", "#8E7A70");
  const ink = new THREE.MeshStandardMaterial({ color: "#1E2240", roughness: 0.25 });
  const white = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });
  const frame = new THREE.MeshStandardMaterial({ color: "#2A2E5C", roughness: 0.35 });
  const blushMat = new THREE.MeshBasicMaterial({
    map: radialTexture("rgba(255,140,140,.75)"),
    transparent: true,
    depthWrite: false,
  });

  // root: hop + spin. squash: squash-and-stretch from the feet. body: everything else.
  const root = new THREE.Group();
  const squash = new THREE.Group();
  const body = new THREE.Group();
  scene.add(root);
  root.add(squash);
  squash.add(body);

  for (const x of [-0.24, 0.24]) {
    const leg = mesh(new THREE.CapsuleGeometry(0.2, 0.28, 8, 20), pants);
    leg.position.set(x, 0.5, 0);
    body.add(leg);
    const shoe = mesh(new THREE.SphereGeometry(0.26, 28, 18), shoeMat);
    shoe.scale.set(1, 0.62, 1.3);
    shoe.position.set(x, 0.17, 0.06);
    body.add(shoe);
  }

  const torso = mesh(new THREE.SphereGeometry(0.62, 40, 28), sweater);
  torso.scale.set(1, 1.02, 0.88);
  torso.position.y = 1.18;
  body.add(torso);
  const hem = mesh(new THREE.TorusGeometry(0.5, 0.07, 12, 40), sweaterDark);
  hem.rotation.x = Math.PI / 2;
  hem.scale.set(1, 0.88, 1);
  hem.position.y = 0.78;
  body.add(hem);

  // The head is about half his height, which is most of the cuteness.
  const head = new THREE.Group();
  head.position.y = 2.42;
  body.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.92, 64, 48), skin);
  skull.scale.set(1.04, 0.96, 0.94);
  head.add(skull);
  const cap = mesh(
    new THREE.SphereGeometry(0.96, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.46),
    hairMat,
  );
  cap.scale.set(1.04, 0.98, 0.96);
  cap.rotation.x = -0.42;
  cap.position.set(0, 0.04, -0.05);
  head.add(cap);
  for (const [x, y, z, r] of [
    [-0.38, 0.62, 0.25, 0.34],
    [0.05, 0.74, 0.27, 0.38],
    [0.44, 0.6, 0.21, 0.32],
  ] as const) {
    const tuft = mesh(new THREE.SphereGeometry(r, 28, 18), hairMat);
    tuft.scale.set(1.1, 0.7, 0.8);
    tuft.position.set(x, y, z);
    head.add(tuft);
  }
  // A springy curl on top that wobbles whenever he moves.
  const curlPivot = new THREE.Group();
  curlPivot.position.set(0.08, 0.92, -0.05);
  head.add(curlPivot);
  const curl = mesh(new THREE.TorusGeometry(0.1, 0.045, 10, 20, Math.PI * 1.4), hairMat);
  curl.position.set(0, 0.1, 0);
  curl.rotation.set(0, 0.3, 0.6);
  curlPivot.add(curl);
  for (const x of [-0.95, 0.95]) {
    const ear = mesh(new THREE.SphereGeometry(0.16, 20, 14), skin);
    ear.scale.set(0.55, 1, 0.8);
    ear.position.set(x, -0.06, 0);
    head.add(ear);
  }

  // Big shiny eyes behind round glasses. Pupils drift towards the cursor.
  const eyes: THREE.Group[] = [];
  for (const x of [-0.32, 0.32]) {
    const eye = new THREE.Group();
    eye.position.set(x, -0.04, 0.83);
    head.add(eye);
    const ball = mesh(new THREE.SphereGeometry(0.15, 32, 24), ink, false);
    ball.scale.set(0.9, 1.12, 0.5);
    eye.add(ball);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), white);
    spark.position.set(0.05, 0.08, 0.07);
    eye.add(spark);
    const spark2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), white);
    spark2.position.set(-0.04, -0.05, 0.07);
    eye.add(spark2);
    eyes.push(eye);
    const ring = mesh(new THREE.TorusGeometry(0.25, 0.032, 12, 40), frame);
    ring.position.set(x, -0.03, 0.86);
    head.add(ring);
    const blush = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), blushMat);
    blush.position.set(x * 1.6, -0.3, 0.79);
    blush.rotation.y = x > 0 ? 0.45 : -0.45;
    head.add(blush);
  }
  const bridge = mesh(new THREE.TorusGeometry(0.08, 0.028, 8, 16, Math.PI), frame);
  bridge.position.set(0, 0, 0.9);
  head.add(bridge);
  const smile = mesh(new THREE.TorusGeometry(0.09, 0.026, 10, 24, Math.PI), ink, false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.36, 0.86);
  head.add(smile);

  const armL = new THREE.Group();
  armL.position.set(-0.55, 1.4, 0.05);
  body.add(armL);
  const upperL = mesh(new THREE.CapsuleGeometry(0.15, 0.3, 8, 16), sweater);
  upperL.position.set(-0.11, -0.25, 0);
  upperL.rotation.z = -0.45;
  armL.add(upperL);
  const handL = mesh(new THREE.SphereGeometry(0.15, 20, 14), skin);
  handL.position.set(-0.25, -0.52, 0.05);
  armL.add(handL);

  // Writing arm, raised out to the side so it never covers his face.
  const shoulder = new THREE.Group();
  shoulder.position.set(0.55, 1.4, 0.05);
  body.add(shoulder);
  const arm = mesh(new THREE.CapsuleGeometry(0.15, 0.38, 8, 16), sweater);
  arm.position.set(0.27, 0.21, 0);
  arm.rotation.z = -0.9;
  shoulder.add(arm);
  const handR = mesh(new THREE.SphereGeometry(0.15, 20, 14), skin);
  handR.position.set(0.56, 0.44, 0.04);
  shoulder.add(handR);
  const pen = mesh(new THREE.CapsuleGeometry(0.04, 0.36, 6, 10), plush("#FFF6D8"));
  pen.position.set(0.63, 0.66, 0.06);
  pen.rotation.z = -0.3;
  shoulder.add(pen);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshBasicMaterial({ color: "#F4F7FF" }),
  );
  tip.position.set(0.71, 0.88, 0.06);
  shoulder.add(tip);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture("rgba(215,226,255,1)"),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    }),
  );
  halo.scale.set(0.8, 0.8, 1);
  halo.position.copy(tip.position);
  shoulder.add(halo);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.1),
    new THREE.MeshBasicMaterial({
      map: radialTexture("rgba(58,40,110,.34)"),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  scene.add(shadow);

  // Sparkle pool: scribble trail while hovering, a burst on click.
  const starMap = starTexture();
  const colors = ["#FFFFFF", "#FFE7A8", "#FFC7D6", "#CFE0FF", "#C9F2E2"];
  const sparks: Spark[] = Array.from({ length: 48 }, () => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: starMap, transparent: true, depthWrite: false, opacity: 0 }),
    );
    sprite.visible = false;
    scene.add(sprite);
    return { sprite, velocity: new THREE.Vector3(), life: 0, maxLife: 1, spin: 0 };
  });
  let nextSpark = 0;
  const emit = (at: THREE.Vector3, velocity: THREE.Vector3, life: number, size: number) => {
    const s = sparks[nextSpark++ % sparks.length];
    if (!s) return;
    s.sprite.position.copy(at);
    s.sprite.scale.setScalar(size);
    s.sprite.material.color.set(colors[Math.floor(Math.random() * colors.length)] ?? "#fff");
    s.sprite.visible = true;
    s.velocity.copy(velocity);
    s.life = s.maxLife = life;
    s.spin = (Math.random() - 0.5) * 6;
  };

  // --- interaction state ---
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  let hovering = false;
  const look = { x: 0, y: 0 };
  const yaw: Spring = { value: 0.3, velocity: 0 };
  const pitch: Spring = { value: 0, velocity: 0 };
  const curlSpring: Spring = { value: 0, velocity: 0 };
  const pop: Spring = { value: reduce ? 1 : 0, velocity: 0 };
  const squashS: Spring = { value: 1, velocity: 0 };
  let hopY = 0;
  let hopV = 0;
  let spin = 0;
  let airborne = false;

  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    look.x = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2));
    look.y = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2));
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  };
  const onLeave = () => ndc.set(9, 9);
  const tipWorld = new THREE.Vector3();
  const onClick = () => {
    if (!hovering || airborne || reduce) return;
    airborne = true;
    hopV = 6.2;
    squashS.velocity = -6;
    spin = 0;
    root.updateMatrixWorld(true);
    skull.getWorldPosition(tipWorld);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      emit(
        tipWorld,
        new THREE.Vector3(Math.cos(a) * 2.4, Math.sin(a) * 2.4 + 0.8, 0.6),
        0.9,
        0.22 + Math.random() * 0.12,
      );
    }
  };
  window.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  let scribbleClock = 0;
  const stop = runWhileVisible(canvas, (dt, t) => {
    fitToCanvas(renderer, camera);

    ray.setFromCamera(ndc, camera);
    hovering = ray.intersectObject(root, true).length > 0;
    canvas.style.cursor = hovering ? "pointer" : "default";

    // Pop in with a squishy overshoot, once.
    springStep(pop, 1, dt, 120, 9);
    const entrance = reduce ? 1 : easeOutBack(Math.min(1, t * 1.6)) * 0.4 + pop.value * 0.6;

    // Hop + spin under gravity, then a squash on landing.
    if (airborne) {
      hopV -= 18 * dt;
      hopY += hopV * dt;
      spin = Math.min(Math.PI * 2, spin + dt * 11);
      if (hopY <= 0) {
        hopY = 0;
        hopV = 0;
        airborne = false;
        spin = 0;
        squashS.velocity = -5;
      }
    }
    springStep(squashS, 1, dt, 260, 12);
    root.position.y = hopY;
    const sq = reduce ? 1 : squashS.value;
    const breathe = reduce ? 0 : Math.sin(t * 1.8) * 0.015;
    squash.scale.set(entrance * (2 - sq), entrance * (sq + breathe), entrance * (2 - sq));

    // Turn towards the cursor; spin wraps around during a hop.
    springStep(yaw, 0.3 + (reduce ? 0 : look.x * 0.35), dt, 60, 12);
    springStep(pitch, reduce ? 0 : look.y * 0.18, dt, 60, 12);
    root.rotation.y = yaw.value + spin;
    head.rotation.x = pitch.value;
    head.rotation.z = reduce ? 0 : Math.sin(t * 1.3) * 0.05;
    for (const eye of eyes) {
      eye.position.x = (eye.position.x > 0 ? 0.32 : -0.32) + look.x * 0.04;
      eye.position.y = -0.04 - look.y * 0.03;
      eye.scale.y = 1 - (reduce ? 0 : blinkAmount(t + 0.4)) * 0.9;
    }

    // The curl lags behind his movement.
    springStep(curlSpring, (yaw.velocity + hopV * 0.3) * -0.25, dt, 90, 5);
    curlPivot.rotation.z = curlSpring.value + (reduce ? 0 : Math.sin(t * 2.2) * 0.06);

    // Idle: the free hand swings a little. Hover: scribble with sparkles.
    armL.rotation.z = reduce ? 0 : Math.sin(t * 1.8) * 0.08;
    const writing = hovering && !reduce;
    shoulder.rotation.z = THREE.MathUtils.lerp(
      shoulder.rotation.z,
      writing ? Math.sin(t * 13) * 0.22 : 0,
      0.3,
    );
    halo.material.opacity = writing ? 0.75 + Math.sin(t * 18) * 0.2 : 0.45 + Math.sin(t * 2) * 0.1;
    if (writing) {
      scribbleClock += dt;
      while (scribbleClock > 0.05) {
        scribbleClock -= 0.05;
        tip.getWorldPosition(tipWorld);
        emit(
          tipWorld,
          new THREE.Vector3(0.4 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.2),
          1.1,
          0.12 + Math.random() * 0.1,
        );
      }
    }
    for (const s of sparks) {
      if (!s.sprite.visible) continue;
      s.life -= dt;
      if (s.life <= 0) {
        s.sprite.visible = false;
        continue;
      }
      s.velocity.multiplyScalar(1 - 1.8 * dt);
      s.velocity.y -= 0.4 * dt;
      s.sprite.position.addScaledVector(s.velocity, dt);
      s.sprite.material.rotation += s.spin * dt;
      const k = s.life / s.maxLife;
      s.sprite.material.opacity = Math.min(1, k * 2);
    }

    shadow.scale.setScalar(entrance * (1 - Math.min(0.5, hopY * 0.25)));
    renderer.render(scene, camera);
  });

  return () => {
    stop();
    window.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
    canvas.removeEventListener("click", onClick);
    disposeScene(scene, renderer);
  };
}
