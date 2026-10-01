import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export type GalaxyState = { running: boolean; topView: boolean };
export type GalaxyController = { update(state: GalaxyState): void; dispose(): void };

/** Render the official, unmodified GLB. The SDK's Z-up camera is converted to glTF Y-up. */
export function createGalaxyRenderer(host: HTMLElement, initial: GalaxyState): GalaxyController {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
  renderer.setClearColor(0x000000);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const canvas = renderer.domElement;
  canvas.className = "galaxy-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, .01, 40);
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .6, .65, .45);
  const output = new OutputPass();
  composer.addPass(renderPass); composer.addPass(bloom); composer.addPass(output);
  let state = initial, disposed = false, ready = false, contextLost = false;
  let frame = 0, previous = 0, width = 1, height = 1;
  let model: THREE.Group | null = null, mixer: THREE.AnimationMixer | null = null;
  let view = 0, fromView = 0, goalView = 0, elapsed = 0, duration = 1;
  const abort = new AbortController();
  const originalPosition = new THREE.Vector3(6.7693618705, 114.1578686793, -165.7987209163).multiplyScalar(.015635099262);
  const originalTarget = new THREE.Vector3(-1.0238169299, -9.7067393534, -10.8389636011).multiplyScalar(.015635099262);
  const originalVector = originalPosition.clone().sub(originalTarget);
  const length = originalVector.length();
  const polar = Math.acos(originalVector.y / length);
  const azimuth = Math.atan2(originalVector.x, originalVector.z);
  const vector = new THREE.Vector3(), forward = new THREE.Vector3();
  const right = new THREE.Vector3(), up = new THREE.Vector3(), shift = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const compose = () => {
    const angle = THREE.MathUtils.lerp(polar, .04, view);
    vector.set(Math.sin(angle) * Math.sin(azimuth), Math.cos(angle), Math.sin(angle) * Math.cos(azimuth));
    forward.copy(vector).negate(); right.crossVectors(forward, worldUp).normalize(); up.crossVectors(right, forward);
    const mobile = width < 700, distance = length * (mobile ? 1.85 : 1.3);
    const viewHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(22.5));
    shift.copy(right).multiplyScalar(-(mobile ? .17 : .24) * viewHeight * width / height)
      .addScaledVector(up, -(mobile ? .18 : .02) * viewHeight);
    camera.position.copy(originalTarget).addScaledVector(vector, distance).add(shift);
    camera.lookAt(lookTarget.copy(originalTarget).add(shift));
  };
  const active = () => ready && state.running && !document.hidden && !contextLost && !disposed;
  const stop = () => {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    host.dataset.playback = "paused";
  };
  const draw = () => {
    compose(); composer.render();
    host.dataset.camera = view > .999 ? "top" : view < .001 ? "default" : "moving";
  };
  const tick = (time: number) => {
    frame = 0;
    if (!active()) { stop(); return; }
    const dt = previous ? Math.min((time - previous) / 1000, .05) : 0;
    previous = time;
    elapsed = Math.min(duration, elapsed + dt);
    const p = elapsed / duration;
    const eased = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    view = THREE.MathUtils.lerp(fromView, goalView, eased);
    mixer?.update(dt);
    draw(); host.dataset.playback = "playing";
    frame = requestAnimationFrame(tick);
  };
  const update = (next: GalaxyState) => {
    state = next;
    const target = active() && state.topView ? 1 : 0;
    if (target !== goalView) {
      fromView = view; goalView = target; elapsed = 0; duration = target ? 1 : 1.2;
    }
    if (!active()) {
      stop(); view = fromView = goalView = 0; elapsed = 0;
      if (ready && !contextLost && !document.hidden && !disposed) draw();
    } else if (!frame) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    const bounds = host.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    const pixelRatio = Math.min(devicePixelRatio || 1, 1.25, 1920 / width, 1080 / height);
    renderer.setPixelRatio(pixelRatio); renderer.setSize(width, height, false);
    composer.setPixelRatio(pixelRatio); composer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    if (ready && !contextLost && !document.hidden) draw();
  };
  const lost = (event: Event) => {
    event.preventDefault(); contextLost = true; stop(); host.dataset.status = "error";
  };
  const restored = () => {
    contextLost = false; host.dataset.status = ready ? "ready" : "loading"; resize(); update(state);
  };
  const visibility = () => update(state);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", visibility);
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const releaseModel = (root: THREE.Group) => {
    const textures = new Set<THREE.Texture>(), materials = new Set<THREE.Material>(), geometries = new Set<THREE.BufferGeometry>();
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    const bitmaps = new Set<ImageBitmap>();
    textures.forEach(texture => { if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) bitmaps.add(texture.image); texture.dispose(); });
    bitmaps.forEach(bitmap => bitmap.close()); materials.forEach(material => material.dispose()); geometries.forEach(geometry => geometry.dispose());
  };
  void fetch("/models/galaxy.glb", { signal: abort.signal })
    .then(response => { if (!response.ok) throw new Error("Galaxy asset unavailable"); return response.arrayBuffer(); })
    .then(data => { if (disposed) return null; return new GLTFLoader().parseAsync(data, ""); })
    .then(gltf => {
      if (!gltf) return;
      if (disposed) { releaseModel(gltf.scene); return; }
      model = gltf.scene;
      model.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const material = object.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = object.name.startsWith("Galaxy_") ? 1.8 : .32;
        if (material.transparent) material.depthWrite = false;
      });
      const clip = gltf.animations.find(animation => animation.name === "Take 001");
      if (!clip) throw new Error("Original Galaxy animation missing");
      scene.add(model); mixer = new THREE.AnimationMixer(model); mixer.timeScale = .35;
      mixer.clipAction(clip).setLoop(THREE.LoopRepeat, Infinity).play();
      ready = true; host.dataset.status = contextLost ? "error" : "ready";
      if (!contextLost) draw();
      update(state);
    }).catch(() => { if (!disposed) { stop(); host.dataset.status = "error"; } });
  return {
    update,
    dispose() {
      if (disposed) return;
      disposed = true; stop(); abort.abort(); observer.disconnect();
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", visibility);
      if (model) { mixer?.stopAllAction(); mixer?.uncacheRoot(model); releaseModel(model); scene.remove(model); }
      bloom.dispose(); output.dispose(); renderPass.dispose(); composer.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
