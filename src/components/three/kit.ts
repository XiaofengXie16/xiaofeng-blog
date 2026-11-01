import * as THREE from "three";

/** Shared plumbing for the soft, toy-like 3D scenes. Loaded only in the browser. */

export const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function makeRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  return renderer;
}

/** Matches the drawing buffer to the canvas's CSS size; returns true when it changed. */
export function fitToCanvas(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  const canvas = renderer.domElement;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const size = renderer.getSize(new THREE.Vector2());
  if (w === 0 || h === 0 || (size.x === w && size.y === h)) return false;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  return true;
}

/** Lilac sky above, peach ground below, a warm key light and a cool rim. */
export function softLights(scene: THREE.Scene, sky = "#D4D0FA", ground = "#F6CDB6") {
  scene.add(new THREE.HemisphereLight(sky, ground, 1.25));
  const key = new THREE.DirectionalLight("#FFF1E4", 2.1);
  key.position.set(3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 20 });
  scene.add(key);
  const rim = new THREE.DirectionalLight("#AFC0FF", 1.1);
  rim.position.set(-4, 3, -3);
  scene.add(rim);
}

/** Velvety material: a rough base plus sheen that glows at grazing angles. */
export function plush(color: string, sheen = "#ffffff") {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.85,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(sheen),
  });
}

export function clay(color: string, roughness = 0.62) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
}

export function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  cast = true,
) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

/** A soft round dot texture, used for glows, blush and contact shadows. */
export function radialTexture(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A soft four-point star, for sparkles. */
export function starTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    const glow = ctx.createRadialGradient(64, 64, 0, 64, 64, 40);
    glow.addColorStop(0, "rgba(255,255,255,.9)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(64, 6);
    ctx.quadraticCurveTo(70, 58, 122, 64);
    ctx.quadraticCurveTo(70, 70, 64, 122);
    ctx.quadraticCurveTo(58, 70, 6, 64);
    ctx.quadraticCurveTo(58, 58, 64, 6);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Frees every geometry, material and texture under `root`, then the renderer. */
export function disposeScene(root: THREE.Object3D, renderer: THREE.WebGLRenderer) {
  root.traverse((obj) => {
    const m = obj as THREE.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const mat of mats) {
      for (const value of Object.values(mat)) if (value instanceof THREE.Texture) value.dispose();
      mat.dispose();
    }
  });
  renderer.dispose();
}

/**
 * Runs `frame` every animation frame while the canvas is on screen and the tab
 * is visible. Returns a stop function.
 */
export function runWhileVisible(canvas: HTMLCanvasElement, frame: (dt: number, t: number) => void) {
  let raf = 0;
  let visible = true;
  let last = performance.now();
  let elapsed = 0;
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += dt;
    frame(dt, elapsed);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) start();
    else stop();
  });
  io.observe(canvas);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  start();
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
