import * as THREE from "three";
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
} from "./kit";
import { addArm, buildPlushPerson, personMotion, pointerTracker, sparkles } from "./plushBody";

/**
 * The hero writer: a cute plush figure with round glasses and a glowing pen.
 * He pops in, breathes, blinks and follows the cursor; hovering makes him
 * scribble sparkles into the sky and clicking makes him hop and spin with a
 * burst of stars. Returns a cleanup function.
 */
export function mountPlushWriter(canvas: HTMLCanvasElement) {
  const reduce = prefersReducedMotion();
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0.2, 2.3, 10.5);
  camera.lookAt(0.2, 1.75, 0);
  softLights(scene);

  const person = buildPlushPerson(
    scene,
    {
      skin: ["#FAD3BC", "#FFE9DC"],
      sweater: ["#7CC2A8", "#D8FFF0"],
      sweaterDark: ["#62AA90", "#CFF5E6"],
      pants: ["#6E78C2", "#D6DCFF"],
      shoe: ["#8A5A44", "#F2C9B3"],
      hair: ["#3A2E2A", "#8E7A70"],
    },
    { glasses: true },
  );

  // Free hand rests at his side; the writing arm is raised out to the side so it never covers his face.
  const armL = addArm(person, -1, -(Math.PI - 0.45), 0.3);
  const armR = addArm(person, 1, 0.9);
  const pen = mesh(new THREE.CapsuleGeometry(0.04, 0.36, 6, 10), plush("#FFF6D8"));
  pen.position.set(0.63, 0.66, 0.06);
  pen.rotation.z = -0.3;
  armR.shoulder.add(pen);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshBasicMaterial({ color: "#F4F7FF" }),
  );
  tip.position.set(0.71, 0.88, 0.06);
  armR.shoulder.add(tip);
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
  armR.shoulder.add(halo);

  const fx = sparkles(scene);
  const motion = personMotion(person, reduce, 0.3);
  const pointer = pointerTracker(canvas, camera, person.root);
  let hovering = false;
  const at = new THREE.Vector3();

  const onClick = () => {
    if (!hovering || !motion.hop()) return;
    person.skull.getWorldPosition(at);
    fx.burst(at);
  };
  canvas.addEventListener("click", onClick);

  let scribble = 0;
  const stop = runWhileVisible(canvas, (dt, t) => {
    fitToCanvas(renderer, camera);
    hovering = pointer.hovering();
    motion.look.x = pointer.look.x;
    motion.look.y = pointer.look.y;
    motion.update(dt, t);

    armL.shoulder.rotation.z = reduce ? 0 : Math.sin(t * 1.8) * 0.08;
    const writing = hovering && !reduce;
    armR.shoulder.rotation.z = THREE.MathUtils.lerp(
      armR.shoulder.rotation.z,
      writing ? Math.sin(t * 13) * 0.22 : 0,
      0.3,
    );
    halo.material.opacity = writing ? 0.75 + Math.sin(t * 18) * 0.2 : 0.45 + Math.sin(t * 2) * 0.1;
    if (writing) {
      scribble += dt;
      while (scribble > 0.05) {
        scribble -= 0.05;
        tip.getWorldPosition(at);
        fx.emit(
          at,
          new THREE.Vector3(0.4 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.2),
          1.1,
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
