import * as THREE from "three";
import { cloths, treatmentNames } from "./data.js";

function clothMaterial(key) {
  const cloth = cloths[key] || cloths.oat;
  const sheer = cloth.opacity != null;
  return new THREE.MeshStandardMaterial({
    color: cloth.color,
    roughness: cloth.roughness,
    metalness: 0,
    side: THREE.DoubleSide,
    transparent: sheer,
    opacity: sheer ? cloth.opacity : 1,
    depthWrite: !sheer,
  });
}

function curtainPanel(width, height, folds, material, phase) {
  const geometry = new THREE.PlaneGeometry(width, height, folds * 6, 24);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const across = x / width + 0.5;
    const down = y / height + 0.5;
    const wave = Math.sin(across * Math.PI * folds + phase) * Math.min(0.07, width * 0.08);
    const weight = (1 - down) * 0.012;
    position.setZ(i, wave * (0.45 + down * 0.7) + weight);
  }
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createOrbit(camera, dom, target) {
  const state = { dragging: false, x: 0, y: 0, theta: 0.35, phi: 1.05, radius: 7 };
  const cleanups = [];

  function apply() {
    const sinPhi = Math.sin(state.phi);
    camera.position.set(
      target.x + state.radius * sinPhi * Math.sin(state.theta),
      target.y + state.radius * Math.cos(state.phi),
      target.z + state.radius * sinPhi * Math.cos(state.theta),
    );
    camera.lookAt(target);
  }

  function sync() {
    const offset = new THREE.Vector3().copy(camera.position).sub(target);
    state.radius = Math.max(offset.length(), 0.1);
    state.theta = Math.atan2(offset.x, offset.z);
    state.phi = Math.acos(Math.min(1, Math.max(-1, offset.y / state.radius)));
    apply();
  }

  const onDown = (event) => {
    state.dragging = true;
    state.x = event.clientX;
    state.y = event.clientY;
    dom.setPointerCapture(event.pointerId);
  };
  const onMove = (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    state.x = event.clientX;
    state.y = event.clientY;
    state.theta -= dx * 0.005;
    state.phi = Math.min(1.35, Math.max(0.35, state.phi + dy * 0.005));
    apply();
  };
  const stop = () => {
    state.dragging = false;
  };
  const onWheel = (event) => {
    event.preventDefault();
    state.radius = Math.min(18, Math.max(1.8, state.radius + Math.sign(event.deltaY) * 0.28));
    apply();
  };

  dom.addEventListener("pointerdown", onDown);
  dom.addEventListener("pointermove", onMove);
  dom.addEventListener("pointerup", stop);
  dom.addEventListener("pointercancel", stop);
  dom.addEventListener("wheel", onWheel, { passive: false });
  cleanups.push(() => {
    dom.removeEventListener("pointerdown", onDown);
    dom.removeEventListener("pointermove", onMove);
    dom.removeEventListener("pointerup", stop);
    dom.removeEventListener("pointercancel", stop);
    dom.removeEventListener("wheel", onWheel);
  });

  return {
    sync,
    dispose() {
      cleanups.forEach((fn) => fn());
    },
  };
}

export function createRoomView(canvas, onSummary) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0xe4dccd);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 80);
  const lookTarget = new THREE.Vector3(0, 1.3, 0);
  const orbit = createOrbit(camera, canvas, lookTarget);

  scene.add(new THREE.HemisphereLight(0xfff7ee, 0x8d7b68, 0.95));
  const sun = new THREE.DirectionalLight(0xfff1dc, 1.45);
  sun.position.set(4, 8, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xd7e4ef, 0.35);
  fill.position.set(-4, 3, -2);
  scene.add(fill);

  const room = new THREE.Group();
  scene.add(room);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(20, 48),
    new THREE.MeshStandardMaterial({ color: 0xd5cbbd, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.09;
  ground.receiveShadow = true;
  scene.add(ground);

  let frameKey = "";
  let frameId = 0;
  let stopped = false;

  function addBox(width, height, depth, x, y, z, material, cast = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    room.add(mesh);
    return mesh;
  }

  function clearRoom() {
    const materials = new Set();
    room.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const list = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
      list.forEach((material) => materials.add(material));
    });
    materials.forEach((material) => material.dispose());
    room.clear();
  }

  function frameCamera(width, height, depth) {
    lookTarget.set(0, height * 0.42, -depth * 0.08);
    camera.position.set(width * 0.62, height * 0.92, depth / 2 + Math.max(width, depth) * 0.9);
    orbit.sync();
  }

  function buildFurniture(kind, width, depth, wood, upholstery) {
    if (kind === "bedroom") {
      const bedW = Math.min(1.7, width * 0.46);
      const bedL = Math.min(2.1, depth * 0.58);
      const x = width / 2 - bedW / 2 - 0.28;
      addBox(bedW, 0.28, bedL, x, 0.32, 0.05, upholstery);
      addBox(bedW, 0.7, 0.1, x, 0.62, -bedL / 2 + 0.1, wood);
      addBox(bedW * 0.42, 0.12, 0.32, x - bedW * 0.18, 0.58, -bedL / 2 + 0.42, clothMaterial("chalk"));
      return;
    }
    if (kind === "dining") {
      const topW = Math.min(1.6, width * 0.42);
      const topD = Math.min(0.9, depth * 0.28);
      addBox(topW, 0.06, topD, 0, 0.75, 0.15, wood);
      [-1, 1].forEach((sx) => {
        [-1, 1].forEach((sz) => {
          addBox(0.08, 0.72, 0.08, sx * (topW / 2 - 0.12), 0.36, 0.15 + sz * (topD / 2 - 0.12), wood);
        });
      });
      return;
    }
    if (kind === "study") {
      const deskW = Math.min(1.4, width * 0.4);
      addBox(deskW, 0.05, 0.62, width / 2 - deskW / 2 - 0.3, 0.76, depth / 2 - 0.7, wood);
      addBox(deskW, 0.62, 0.04, width / 2 - deskW / 2 - 0.3, 0.42, depth / 2 - 0.4, wood);
      addBox(0.46, 0.46, 0.46, width / 2 - deskW - 0.15, 0.23, depth / 2 - 0.85, upholstery);
      return;
    }
    const sofaW = Math.min(2.25, width * 0.58);
    const sofaD = 0.86;
    const z = depth / 2 - sofaD / 2 - 0.28;
    addBox(sofaW, 0.28, sofaD, 0, 0.28, z, upholstery);
    addBox(sofaW, 0.42, 0.14, 0, 0.58, z + sofaD / 2 - 0.07, upholstery);
    addBox(0.12, 0.24, sofaD, -sofaW / 2 + 0.06, 0.48, z, upholstery);
    addBox(0.12, 0.24, sofaD, sofaW / 2 - 0.06, 0.48, z, upholstery);
    addBox(Math.min(1.15, width * 0.28), 0.06, 0.58, 0, 0.4, z - sofaD / 2 - 0.48, wood);
  }

  function resize() {
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 640;
    const height = canvas.clientHeight || 640;
    const ratio = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }
  }

  function update(spec, reframe = false) {
    const unit = spec.unit === "ft" ? "ft" : "m";
    const read = (value) => {
      const number = parseFloat(value);
      if (!Number.isFinite(number)) return NaN;
      return unit === "ft" ? number * 0.3048 : number;
    };
    const raw = {
      width: read(spec.width),
      depth: read(spec.depth),
      height: read(spec.height),
      windowWidth: read(spec.windowWidth),
      windowDrop: read(spec.windowDrop),
    };
    if (Object.values(raw).some((value) => Number.isNaN(value))) return;

    const notes = [];
    const fit = (value, min, max, label) => {
      const next = Math.min(max, Math.max(min, value));
      if (Math.abs(next - value) > 0.02) notes.push(label);
      return next;
    };
    const width = fit(raw.width, 2.2, 14, "Width was fitted to a buildable room");
    const depth = fit(raw.depth, 2.2, 14, "Depth was fitted to a buildable room");
    const height = fit(raw.height, 2.2, 6, "Ceiling height was fitted");
    const windowWidth = fit(raw.windowWidth, 0.5, width - 0.5, "Window width was fitted to the wall");
    const windowDrop = fit(raw.windowDrop, 0.5, height - 0.4, "Window drop was fitted under the ceiling");
    const treatment = spec.treatment;
    const hem = spec.hem;
    const closed = Math.min(1, Math.max(0, Number(spec.closed) / 100));
    const cloth = cloths[spec.cloth] || cloths.oat;

    clearRoom();
    const wall = new THREE.MeshStandardMaterial({ color: 0xf4f0e8, roughness: 0.96 });
    const floor = new THREE.MeshStandardMaterial({ color: 0xa67c52, roughness: 0.72 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x6d4c34, roughness: 0.62 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xb7b1a8, roughness: 0.35, metalness: 0.55 });
    const upholstery = new THREE.MeshStandardMaterial({ color: 0xcfc6b8, roughness: 0.9 });
    const fabric = clothMaterial(spec.cloth);
    const sheer = new THREE.MeshStandardMaterial({
      color: 0xf7f4ee,
      roughness: 0.25,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const thickness = 0.1;
    const innerZ = -depth / 2;
    const wallZ = innerZ - thickness / 2;
    const sill = height - 0.16 - windowDrop;
    const pier = (width - windowWidth) / 2;

    addBox(width + thickness * 2, 0.08, depth + thickness, 0, -0.04, 0, floor, false);
    addBox(pier, height, thickness, -width / 2 + pier / 2, height / 2, wallZ, wall, false);
    addBox(pier, height, thickness, width / 2 - pier / 2, height / 2, wallZ, wall, false);
    addBox(windowWidth, Math.max(sill, 0.05), thickness, 0, Math.max(sill, 0.05) / 2, wallZ, wall, false);
    addBox(windowWidth, 0.16, thickness, 0, height - 0.08, wallZ, wall, false);
    addBox(thickness, height, depth, -width / 2 - thickness / 2, height / 2, 0, wall, false);
    addBox(thickness, height, depth, width / 2 + thickness / 2, height / 2, 0, wall, false);
    addBox(width + thickness * 2, 0.08, depth + thickness, 0, height + 0.04, 0, wall, false);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.max(windowWidth - 0.08, 0.2), Math.max(windowDrop - 0.08, 0.2)),
      new THREE.MeshStandardMaterial({
        color: 0xd5e6ea,
        transparent: true,
        opacity: 0.2,
        roughness: 0.05,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    );
    glass.position.set(0, sill + windowDrop / 2, innerZ + 0.02);
    room.add(glass);

    const daylight = new THREE.Mesh(
      new THREE.PlaneGeometry(windowWidth * 1.5, windowDrop * 1.35),
      new THREE.MeshBasicMaterial({ color: 0xd5e7d2 }),
    );
    daylight.position.set(0, sill + windowDrop / 2, innerZ - 0.35);
    room.add(daylight);

    const frameDepth = 0.045;
    addBox(windowWidth + 0.08, 0.05, frameDepth, 0, sill + windowDrop + 0.01, innerZ + 0.04, wood);
    addBox(windowWidth + 0.08, 0.05, frameDepth, 0, sill - 0.01, innerZ + 0.04, wood);
    addBox(0.05, windowDrop, frameDepth, -windowWidth / 2 - 0.01, sill + windowDrop / 2, innerZ + 0.04, wood);
    addBox(0.05, windowDrop, frameDepth, windowWidth / 2 + 0.01, sill + windowDrop / 2, innerZ + 0.04, wood);

    if (treatment === "curtains" || treatment === "layered") {
      const rodY = sill + windowDrop + 0.07;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, windowWidth + 0.36, 18), metal);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(0, rodY, innerZ + 0.14);
      rod.castShadow = true;
      room.add(rod);
      const hemBottom = hem === "floor" ? 0.03 : sill + 0.04;
      const panelH = Math.max(0.4, rodY - 0.03 - hemBottom);
      const panelW = windowWidth * 0.66;
      const closedX = -windowWidth / 2 + panelW / 2 - windowWidth * 0.03;
      const openX = Math.max(-width / 2 + panelW / 2 + 0.08, -windowWidth / 2 - panelW * 0.32);
      const leftX = THREE.MathUtils.lerp(openX, closedX, closed);
      if (treatment === "layered") {
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth - 0.05, windowDrop), sheer);
        sheet.position.set(0, sill + windowDrop / 2, innerZ + 0.08);
        room.add(sheet);
      }
      const left = curtainPanel(panelW, panelH, 5, fabric, 0);
      left.position.set(leftX, hemBottom + panelH / 2, innerZ + 0.18);
      room.add(left);
      const right = curtainPanel(panelW, panelH, 5, fabric, Math.PI);
      right.position.set(-leftX, hemBottom + panelH / 2, innerZ + 0.18);
      room.add(right);
    }

    if (treatment === "roman") {
      const lowered = Math.max(0.04, windowDrop * closed);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth - 0.08, lowered), fabric);
      cloth.position.set(0, sill + windowDrop - lowered / 2, innerZ + 0.09);
      cloth.castShadow = true;
      room.add(cloth);
      for (let i = 0; i < 4; i += 1) {
        const fold = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth - 0.06, 0.035, 0.05 + (1 - closed) * 0.04),
          fabric,
        );
        fold.position.set(0, sill + windowDrop - 0.02 - i * 0.03 * (1.15 - closed), innerZ + 0.12);
        fold.castShadow = true;
        room.add(fold);
      }
    }

    if (treatment === "roller") {
      const cassette = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, windowWidth - 0.02, 20), metal);
      cassette.rotation.z = Math.PI / 2;
      cassette.position.set(0, sill + windowDrop - 0.02, innerZ + 0.11);
      room.add(cassette);
      const lowered = Math.max(0.03, (windowDrop - 0.08) * closed);
      const shade = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth - 0.08, lowered), fabric);
      shade.position.set(0, sill + windowDrop - 0.06 - lowered / 2, innerZ + 0.09);
      shade.castShadow = true;
      room.add(shade);
    }

    if (treatment === "venetian") {
      const count = Math.max(8, Math.round(windowDrop / 0.09));
      const gap = (windowDrop - 0.08) / count;
      for (let i = 0; i < count; i += 1) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(windowWidth - 0.1, Math.max(gap * 0.9, 0.01), 0.008), fabric);
        slat.position.set(0, sill + 0.04 + gap * (i + 0.5), innerZ + 0.1);
        slat.rotation.x = (1 - closed) * 1.2;
        slat.castShadow = true;
        room.add(slat);
      }
    }

    buildFurniture(spec.kind || "living", width, depth, wood, upholstery);

    const span = Math.max(width, depth, height);
    sun.shadow.camera.left = -span;
    sun.shadow.camera.right = span;
    sun.shadow.camera.top = span;
    sun.shadow.camera.bottom = -span;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = span * 4;
    sun.shadow.camera.updateProjectionMatrix();

    const sizeKey = `${width.toFixed(2)}-${depth.toFixed(2)}-${height.toFixed(2)}`;
    if (reframe || sizeKey !== frameKey) {
      frameKey = sizeKey;
      frameCamera(width, height, depth);
    }

    const hemNote = treatment === "curtains" || treatment === "layered"
      ? hem === "floor" ? ", hem to the floor" : ", hem to the sill"
      : "";
    const summary = [
      `Room ${width.toFixed(2)} × ${depth.toFixed(2)} × ${height.toFixed(2)} m`,
      `Window ${windowWidth.toFixed(2)} × ${windowDrop.toFixed(2)} m`,
      `${cloth.name}, ${treatmentNames[treatment] || treatment}${hemNote}`,
      notes[0],
    ].filter(Boolean).join(". ") + ".";
    onSummary?.(summary);
    resize();
    renderer.render(scene, camera);
  }

  function loop() {
    if (stopped) return;
    resize();
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(loop);
  }
  loop();

  return {
    update,
    resetView() {
      frameKey = "";
    },
    dispose() {
      stopped = true;
      cancelAnimationFrame(frameId);
      orbit.dispose();
      clearRoom();
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
    },
  };
}
