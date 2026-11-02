import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { easeOutBack, springStep, type Spring } from "~/utils/motion";
import {
  disposeScene,
  fitToCanvas,
  makeRenderer,
  mesh,
  plush,
  prefersReducedMotion,
  runWhileVisible,
  softLights,
} from "./kit";
import { addArm, buildPlushPerson, personMotion, pointerTracker, sparkles } from "./plushBody";

const PAGE_TURN_EVERY = 4.2; // seconds between idle page turns
const PAGE_TURN_TIME = 0.9;

/**
 * The blog-post figure: a plush reader sitting cross-legged on a floor cushion
 * with an open book in his hands. He reads (head bowed, turning a page every
 * few seconds); hovering makes him look up at you while sparkles drift out of
 * the book; clicking riffles through pages with a happy bounce on the cushion.
 * Returns a cleanup function.
 */
export function mountPlushReader(canvas: HTMLCanvasElement) {
  const reduce = prefersReducedMotion();
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 2.6, 10);
  camera.lookAt(0, 1.45, 0);
  softLights(scene, "#D4D0FA", "#F6D2BC");

  const person = buildPlushPerson(
    scene,
    {
      skin: ["#F4CDB4", "#FFE8DA"],
      sweater: ["#E49B7C", "#FFE2D4"],
      sweaterDark: ["#CF8467", "#FFD8C8"],
      pants: ["#6E78C2", "#D6DCFF"],
      shoe: ["#5A5F80", "#C9CCE6"],
      hair: ["#4A4550", "#9C95A6"],
    },
    { pose: "crossLegged" },
  );
  // Sit him down into the cushion.
  person.body.position.y = -0.14;

  // The floor cushion: a squashed, velvety pouf with a button in the middle.
  const cushion = new THREE.Group();
  scene.add(cushion);
  const pouf = mesh(new THREE.SphereGeometry(1.15, 48, 32), plush("#B9B4F0", "#F1EEFF"));
  pouf.scale.set(1, 0.3, 0.92);
  pouf.position.y = 0.26;
  cushion.add(pouf);
  const button = mesh(new THREE.SphereGeometry(0.07, 16, 12), plush("#9C95E6"));
  button.position.set(0, 0.6, 0.62);
  cushion.add(button);

  // Arms reach forward to hold the book.
  const armL = addArm(person, -1, -(Math.PI - 0.35), 0.34);
  const armR = addArm(person, 1, Math.PI - 0.35, 0.34);
  armL.shoulder.rotation.x = armR.shoulder.rotation.x = -1.1;

  // The open book, tilted up towards his face.
  const book = new THREE.Group();
  book.position.set(0, 1.18, 0.72);
  book.rotation.x = -1.05;
  person.body.add(book);
  const coverMat = plush("#5A62B8", "#C9CEFF");
  const lines = pageTexture();
  const pageMat = new THREE.MeshStandardMaterial({ color: "#FBF6EA", roughness: 0.9, map: lines });
  const cover = mesh(new RoundedBoxGeometry(1.22, 0.82, 0.06, 4, 0.03), coverMat);
  cover.position.z = -0.04;
  book.add(cover);
  for (const side of [-1, 1] as const) {
    const block = mesh(new RoundedBoxGeometry(0.57, 0.74, 0.07, 3, 0.02), pageMat);
    block.position.set(side * 0.295, 0, 0.02);
    block.rotation.y = -side * 0.12;
    book.add(block);
  }
  // A single page that flips from the right half to the left around the spine.
  const turner = new THREE.Group();
  turner.position.set(0, 0, 0.065);
  book.add(turner);
  const page = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.72),
    new THREE.MeshStandardMaterial({
      color: "#FFFBF2",
      roughness: 0.9,
      map: lines,
      side: THREE.DoubleSide,
    }),
  );
  page.position.x = 0.285;
  page.castShadow = true;
  turner.add(page);

  const fx = sparkles(scene);
  const motion = personMotion(person, reduce, 0.32);
  const pointer = pointerTracker(canvas, camera, person.root);
  const at = new THREE.Vector3();

  // Page turning: idle turns on a timer; a click queues a quick riffle.
  let turnStart = -1;
  let queued = 0;
  let nextIdleTurn = 2;
  const cushionSquish: Spring = { value: 1, velocity: 0 };
  let hovering = false;

  const onClick = () => {
    if (!hovering || reduce) return;
    queued = 3;
    if (motion.hop(3.4, 0)) cushionSquish.velocity = -3;
    book.getWorldPosition(at);
    fx.burst(at, 14, 2.2);
  };
  canvas.addEventListener("click", onClick);

  let drift = 0;
  const stop = runWhileVisible(canvas, (dt, t) => {
    fitToCanvas(renderer, camera);
    hovering = pointer.hovering();
    // Reading: head bowed, eyes down on the page, glancing a little towards
    // the cursor. On hover he looks up at you.
    motion.look.x = pointer.look.x * (hovering ? 1 : 0.3);
    motion.look.y = hovering || reduce ? pointer.look.y : 1;
    motion.update(dt, t, hovering || reduce ? 0 : 0.42);

    // Turn pages: queued riffles go fast, otherwise one every few seconds.
    const turnTime = queued > 0 ? 0.35 : PAGE_TURN_TIME;
    if (turnStart < 0 && !reduce) {
      if (queued > 0 || (t > nextIdleTurn && !hovering)) turnStart = t;
    }
    if (turnStart >= 0) {
      const p = Math.min(1, (t - turnStart) / turnTime);
      turner.rotation.y = -easeOutBack(p, 0.6) * Math.PI;
      // The page lifts and curls slightly mid-turn.
      turner.position.z = 0.065 + Math.sin(p * Math.PI) * 0.12;
      if (p >= 1) {
        turnStart = -1;
        turner.rotation.y = 0;
        turner.position.z = 0.065;
        if (queued > 0) queued--;
        nextIdleTurn = t + PAGE_TURN_EVERY;
      }
    }

    // The arms bob gently with the book; the book breathes with him.
    const bob = reduce ? 0 : Math.sin(t * 1.8) * 0.03;
    armL.shoulder.rotation.x = armR.shoulder.rotation.x = -1.1 + bob;
    book.position.y = 1.18 + bob * 0.5;
    book.rotation.z = reduce ? 0 : Math.sin(t * 0.9) * 0.03;

    // Cushion squishes when he lands.
    springStep(cushionSquish, 1, dt, 220, 9);
    pouf.scale.set(1 + (1 - cushionSquish.value) * 0.3, 0.3 * cushionSquish.value, 0.92);

    // Hover: little sparkles and glowing letters drift up out of the book.
    if (hovering && !reduce) {
      drift += dt;
      while (drift > 0.09) {
        drift -= 0.09;
        book.getWorldPosition(at);
        at.y += 0.15;
        fx.emit(
          at,
          new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.9 + Math.random() * 0.6, 0.3),
          1.4,
          0.1 + Math.random() * 0.1,
        );
      }
    }
    fx.update(dt);
    renderer.render(scene, camera);
  });

  return () => {
    stop();
    pointer.dispose();
    canvas.removeEventListener("click", onClick);
    disposeScene(scene, renderer);
  };
}

/** Faint lines of "text" for the pages. */
function pageTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 168;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FBF6EA";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "rgba(90, 98, 150, 0.28)";
    for (let y = 22; y < c.height - 16; y += 13) {
      const width = 70 + ((y * 37) % 30);
      ctx.fillRect(18, y, width, 4);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
