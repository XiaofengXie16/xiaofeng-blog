import * as THREE from "three";
import { blinkAmount, easeOutBack, springStep, type Spring } from "~/utils/motion";
import { mesh, plush, radialTexture, starTexture } from "./kit";

/**
 * The shared plush chibi: a big round head, a bean body and stubby legs, plus
 * the motion every figure has (pop-in, breathing, blinking, looking at the
 * cursor, a springy hair curl, a hop with squash-and-stretch) and a sparkle
 * pool. Each figure adds its own arms and props.
 */

export type Palette = {
  skin: [string, string];
  sweater: [string, string];
  sweaterDark: [string, string];
  pants: [string, string];
  shoe: [string, string];
  hair: [string, string];
};

export type Person = ReturnType<typeof buildPlushPerson>;

export function buildPlushPerson(scene: THREE.Scene, palette: Palette, { glasses = false } = {}) {
  const m = (pair: [string, string]) => plush(pair[0], pair[1]);
  const skin = m(palette.skin);
  const sweater = m(palette.sweater);
  const sweaterDark = m(palette.sweaterDark);
  const pants = m(palette.pants);
  const shoeMat = m(palette.shoe);
  const hairMat = m(palette.hair);
  const ink = new THREE.MeshStandardMaterial({ color: "#1E2240", roughness: 0.25 });
  const white = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });

  // root: hop + turn. squash: squash-and-stretch from the feet. body: the figure.
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

  // Big shiny eyes. Pupils drift towards the cursor.
  const eyes: THREE.Group[] = [];
  const blushMat = new THREE.MeshBasicMaterial({
    map: radialTexture("rgba(255,140,140,.75)"),
    transparent: true,
    depthWrite: false,
  });
  const frame = new THREE.MeshStandardMaterial({ color: "#2A2E5C", roughness: 0.35 });
  for (const x of [-0.32, 0.32]) {
    const eye = new THREE.Group();
    eye.position.set(x, -0.04, 0.83);
    eye.userData.baseX = x;
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
    if (glasses) {
      const ring = mesh(new THREE.TorusGeometry(0.25, 0.032, 12, 40), frame);
      ring.position.set(x, -0.03, 0.86);
      head.add(ring);
    }
    const blush = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), blushMat);
    blush.position.set(x * 1.6, -0.3, 0.79);
    blush.rotation.y = x > 0 ? 0.45 : -0.45;
    head.add(blush);
  }
  if (glasses) {
    const bridge = mesh(new THREE.TorusGeometry(0.08, 0.028, 8, 16, Math.PI), frame);
    bridge.position.set(0, 0, 0.9);
    head.add(bridge);
  }
  const smile = mesh(new THREE.TorusGeometry(0.09, 0.026, 10, 24, Math.PI), ink, false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.36, 0.86);
  head.add(smile);

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

  return { root, squash, body, head, skull, eyes, curlPivot, shadow, mats: { skin, sweater } };
}

/** A stubby arm (sleeve + mitten hand) hanging from a shoulder pivot, pointing along `angle`. */
export function addArm(person: Person, side: -1 | 1, angle: number, length = 0.38) {
  const shoulder = new THREE.Group();
  shoulder.position.set(0.55 * side, 1.4, 0.05);
  person.body.add(shoulder);
  const dir = new THREE.Vector2(Math.sin(angle), Math.cos(angle));
  const reach = length + 0.3;
  const arm = mesh(new THREE.CapsuleGeometry(0.15, length, 8, 16), person.mats.sweater);
  arm.position.set((dir.x * reach) / 2, (dir.y * reach) / 2, 0);
  arm.rotation.z = -angle;
  shoulder.add(arm);
  const hand = mesh(new THREE.SphereGeometry(0.15, 20, 14), person.mats.skin);
  hand.position.set(dir.x * reach, dir.y * reach, 0.04);
  shoulder.add(hand);
  return { shoulder, hand };
}

type Spark = {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  spin: number;
};

/** A pool of soft star sprites for trails and bursts. */
export function sparkles(scene: THREE.Scene, count = 48) {
  const map = starTexture();
  const colors = ["#FFFFFF", "#FFE7A8", "#FFC7D6", "#CFE0FF", "#C9F2E2"];
  const pool: Spark[] = Array.from({ length: count }, () => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: 0 }),
    );
    sprite.visible = false;
    scene.add(sprite);
    return { sprite, velocity: new THREE.Vector3(), life: 0, maxLife: 1, spin: 0 };
  });
  let next = 0;
  const emit = (at: THREE.Vector3, velocity: THREE.Vector3, life: number, size: number) => {
    const s = pool[next++ % pool.length];
    if (!s) return;
    s.sprite.position.copy(at);
    s.sprite.scale.setScalar(size);
    s.sprite.material.color.set(colors[Math.floor(Math.random() * colors.length)] ?? "#fff");
    s.sprite.visible = true;
    s.velocity.copy(velocity);
    s.life = s.maxLife = life;
    s.spin = (Math.random() - 0.5) * 6;
  };
  const burst = (at: THREE.Vector3, n = 16, speed = 2.4) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      emit(
        at,
        new THREE.Vector3(Math.cos(a) * speed, Math.sin(a) * speed + 0.8, 0.6),
        0.9,
        0.22 + Math.random() * 0.12,
      );
    }
  };
  const update = (dt: number) => {
    for (const s of pool) {
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
      s.sprite.material.opacity = Math.min(1, (s.life / s.maxLife) * 2);
    }
  };
  return { emit, burst, update };
}

/** The motion every plush figure shares. Call `update` once per frame. */
export function personMotion(person: Person, reduce: boolean, baseYaw: number) {
  const look = { x: 0, y: 0 };
  const yaw: Spring = { value: baseYaw, velocity: 0 };
  const pitch: Spring = { value: 0, velocity: 0 };
  const curl: Spring = { value: 0, velocity: 0 };
  const pop: Spring = { value: reduce ? 1 : 0, velocity: 0 };
  const squashS: Spring = { value: 1, velocity: 0 };
  const hop = { y: 0, v: 0, spin: 0, turns: 0, airborne: false };
  let entrance = reduce ? 1 : 0;

  return {
    look,
    get airborne() {
      return hop.airborne;
    },
    get entrance() {
      return entrance;
    },
    /** Jump with `velocity`; `turns` full spins in the air. Returns false if already airborne. */
    hop(velocity = 6.2, turns = 1) {
      if (hop.airborne || reduce) return false;
      hop.airborne = true;
      hop.v = velocity;
      hop.spin = 0;
      hop.turns = turns;
      squashS.velocity = -6;
      return true;
    },
    /** A quick squish, e.g. when catching something. */
    squish(amount = 5) {
      if (!reduce) squashS.velocity = -amount;
    },
    update(dt: number, t: number, extraPitch = 0) {
      springStep(pop, 1, dt, 120, 9);
      entrance = reduce ? 1 : easeOutBack(Math.min(1, t * 1.6)) * 0.4 + pop.value * 0.6;

      if (hop.airborne) {
        hop.v -= 18 * dt;
        hop.y += hop.v * dt;
        hop.spin = Math.min(Math.PI * 2 * hop.turns, hop.spin + dt * 11);
        if (hop.y <= 0) {
          hop.y = 0;
          hop.v = 0;
          hop.airborne = false;
          hop.spin = 0;
          squashS.velocity = -5;
        }
      }
      springStep(squashS, 1, dt, 260, 12);
      const sq = reduce ? 1 : squashS.value;
      const breathe = reduce ? 0 : Math.sin(t * 1.8) * 0.015;
      person.root.position.y = hop.y;
      person.squash.scale.set(entrance * (2 - sq), entrance * (sq + breathe), entrance * (2 - sq));

      springStep(yaw, baseYaw + (reduce ? 0 : look.x * 0.35), dt, 60, 12);
      springStep(pitch, (reduce ? 0 : look.y * 0.18) + extraPitch, dt, 60, 12);
      person.root.rotation.y = yaw.value + hop.spin;
      person.head.rotation.x = pitch.value;
      person.head.rotation.z = reduce ? 0 : Math.sin(t * 1.3) * 0.05;
      for (const eye of person.eyes) {
        eye.position.x = (eye.userData.baseX as number) + look.x * 0.04;
        eye.position.y = -0.04 - look.y * 0.03;
        eye.scale.y = 1 - (reduce ? 0 : blinkAmount(t + 0.4)) * 0.9;
      }

      springStep(curl, (yaw.velocity + hop.v * 0.3) * -0.25, dt, 90, 5);
      person.curlPivot.rotation.z = curl.value + (reduce ? 0 : Math.sin(t * 2.2) * 0.06);
      person.shadow.scale.setScalar(entrance * (1 - Math.min(0.5, hop.y * 0.25)));
    },
  };
}

/** Pointer tracking for a figure canvas: cursor look direction plus hover hit-testing. */
export function pointerTracker(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  target: THREE.Object3D,
) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const look = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    look.x = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2));
    look.y = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2));
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  };
  const onLeave = () => ndc.set(9, 9);
  window.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  return {
    look,
    /** Whether the cursor is over `target` this frame; also sets the cursor. */
    hovering() {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(target, true).length > 0;
      canvas.style.cursor = hit ? "pointer" : "default";
      return hit;
    },
    dispose() {
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    },
  };
}
