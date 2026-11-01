import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { springStep, type Spring } from "~/utils/motion";
import {
  disposeScene,
  fitToCanvas,
  makeRenderer,
  mesh,
  prefersReducedMotion,
  radialTexture,
  runWhileVisible,
  softLights,
} from "./kit";
import { addArm, buildPlushPerson, personMotion, pointerTracker, sparkles } from "./plushBody";

/**
 * The Toolkit figure: a plush builder balancing a glowing "</>" block on his
 * head, arms up in a cheer. At rest the block bobs and his arms sway; hovering
 * spins the block and sheds sparkles while he bounces and waves; clicking
 * makes him toss it high, watch it twirl, and catch it back on his head with
 * a squish and a burst of stars. Returns a cleanup function.
 */
export function mountPlushBuilder(canvas: HTMLCanvasElement) {
  const reduce = prefersReducedMotion();
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 2.9, 12.2);
  camera.lookAt(0, 2.45, 0);
  softLights(scene, "#D9D4FA", "#F4D2BC");

  const person = buildPlushPerson(scene, {
    skin: ["#F6CDB4", "#FFE6D8"],
    sweater: ["#9DBB86", "#EEFFE0"],
    sweaterDark: ["#86A66F", "#E2F6D4"],
    pants: ["#6E78C2", "#D6DCFF"],
    shoe: ["#5A5F80", "#C9CCE6"],
    hair: ["#6A4A3A", "#B79A88"],
  });

  // Both arms up in a cheer.
  const armL = addArm(person, -1, -1.0, 0.42);
  const armR = addArm(person, 1, 1.0, 0.42);

  // The block: a soft glassy rounded cube with "</>" on its faces.
  const label = codeTexture();
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#E4E2FF",
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    sheen: 0.6,
    sheenColor: new THREE.Color("#FFFFFF"),
    emissive: new THREE.Color("#B9B6FF"),
    emissiveIntensity: 0.18,
  });
  const block = new THREE.Group();
  person.body.add(block);
  const cube = mesh(new RoundedBoxGeometry(1.15, 0.85, 0.85, 6, 0.22), glass);
  block.add(cube);
  for (const side of [1, -1]) {
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.86, 0.6),
      new THREE.MeshBasicMaterial({ map: label, transparent: true, depthWrite: false }),
    );
    face.position.z = 0.43 * side;
    if (side < 0) face.rotation.y = Math.PI;
    block.add(face);
  }
  const aura = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture("rgba(255,255,255,.95)"),
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    }),
  );
  aura.scale.set(2.2, 2, 1);
  block.add(aura);

  const fx = sparkles(scene);
  const motion = personMotion(person, reduce, -0.25);
  const pointer = pointerTracker(canvas, camera, person.root);
  const at = new THREE.Vector3();

  // Block state: where it rests in his hands, plus a toss in flight.
  const HOLD_Y = 3.76;
  const lift: Spring = { value: 0, velocity: 0 };
  const spinS: Spring = { value: 0, velocity: 0 };
  const toss = { active: false, y: 0, v: 0, turn: 0 };
  let hovering = false;
  let bounce = 0;

  const onClick = () => {
    if (!hovering || toss.active || reduce) return;
    toss.active = true;
    toss.y = 0;
    toss.v = 6;
    toss.turn = 0;
    motion.hop(4, 0);
  };
  canvas.addEventListener("click", onClick);

  const stop = runWhileVisible(canvas, (dt, t) => {
    fitToCanvas(renderer, camera);
    hovering = pointer.hovering();
    motion.look.x = pointer.look.x;
    motion.look.y = pointer.look.y;

    // Watch the block on its way up.
    const watching = toss.active ? -0.35 : 0;
    motion.update(dt, t, watching);

    // At rest the arms sway; on hover they wave; during a toss they reach up.
    const wave = reduce ? 0 : hovering ? Math.sin(t * 9) * 0.3 : Math.sin(t * 1.6) * 0.12;
    springStep(lift, toss.active ? 0.45 : wave, dt, 140, 12);
    const raise = lift.value;
    armL.shoulder.rotation.z = -raise;
    armR.shoulder.rotation.z = toss.active ? -raise : raise;

    if (toss.active) {
      toss.v -= 16 * dt;
      toss.y += toss.v * dt;
      toss.turn += dt * 9;
      if (toss.y <= 0 && toss.v < 0) {
        toss.active = false;
        toss.y = 0;
        motion.squish(6);
        block.getWorldPosition(at);
        fx.burst(at, 18, 2.6);
      }
    }

    // Hover spins the block; it settles back face-forward when the cursor leaves.
    springStep(
      spinS,
      hovering && !reduce ? spinS.value + 6 * dt : Math.round(spinS.value / Math.PI) * Math.PI,
      dt,
      40,
      9,
    );
    block.position.set(0, HOLD_Y + toss.y + (reduce ? 0 : Math.abs(Math.sin(t * 1.6)) * 0.04), 0);
    block.rotation.set(
      toss.active ? toss.turn * 0.4 : 0,
      spinS.value + toss.turn,
      reduce ? 0 : Math.sin(t * 1.6) * 0.04,
    );
    aura.material.opacity = 0.45 + (hovering ? 0.3 : 0) + Math.sin(t * 2.5) * 0.08;
    glass.emissiveIntensity = 0.18 + (hovering ? 0.15 : 0);

    // Happy little bounce on hover.
    if (hovering && !reduce && !motion.airborne) {
      bounce += dt;
      if (bounce > 0.7) {
        bounce = 0;
        motion.hop(3.2, 0);
      }
      if (Math.random() < dt * 12) {
        block.getWorldPosition(at);
        fx.emit(
          at,
          new THREE.Vector3((Math.random() - 0.5) * 2, 1 + Math.random(), 0.4),
          0.9,
          0.12 + Math.random() * 0.1,
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

/** "< >" drawn in soft indigo, like the code glyph on the original block. */
function codeTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 180;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "#5A5FA8";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(98, 50);
    ctx.lineTo(62, 90);
    ctx.lineTo(98, 130);
    ctx.moveTo(158, 50);
    ctx.lineTo(194, 90);
    ctx.lineTo(158, 130);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
