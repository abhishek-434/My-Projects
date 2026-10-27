/**
 * ATELIER — Architecture & Interiors
 * Interactive Three.js 3D Architectural Villa Module
 * 
 * Features:
 * - GLTF/GLB loader with automatic fallback to high-fidelity procedural modernist villa.
 * - Architectural procedural model: cantilevered volumes, post-tensioned slabs,
 *   infinity pool, louvers, sunken fire lounge, landscaping, interior lighting.
 * - Atmosphere modes: Golden Dusk, Daylight, Nocturne.
 * - Camera perspective presets: Hero, Poolside, Cantilever Suite, Aerial Plan.
 * - OrbitControls with ground damping & polar constraints.
 * - IntersectionObserver to halt rendering loop when offscreen.
 * - WebGL compatibility check & error fallback.
 */

class Atelier3DScene {
  constructor() {
    this.container = document.getElementById('canvasViewport');
    this.canvas = document.getElementById('threeCanvas');
    this.loader = document.getElementById('canvasLoader');
    this.loaderText = document.getElementById('loaderText');
    this.fallback = document.getElementById('webglFallback');

    // Controls elements
    this.btnReset = document.getElementById('btnResetCamera');
    this.btnWireframe = document.getElementById('btnToggleWireframe');
    this.lightButtons = document.querySelectorAll('[data-light]');
    this.camButtons = document.querySelectorAll('[data-cam]');

    // Scene variables
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.villaGroup = null;
    this.waterMesh = null;
    this.fireLight = null;
    this.interiorLights = [];
    this.materials = {};
    this.isWireframe = false;
    this.currentLightMode = 'dusk';
    this.isRendering = false;
    this.animationFrameId = null;

    // Camera preset coordinates
    this.cameraPresets = {
      hero: { x: 28, y: 16, z: 34, target: { x: 0, y: 4, z: 0 } },
      pool: { x: 12, y: 5, z: 24, target: { x: -2, y: 3, z: -4 } },
      cantilever: { x: -16, y: 14, z: 22, target: { x: 2, y: 7, z: -2 } },
      plan: { x: 0.1, y: 48, z: 0.1, target: { x: 0, y: 0, z: 0 } }
    };

    if (this.isWebGLSupported()) {
      this.init();
    } else {
      this.showFallback();
    }
  }

  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  showFallback() {
    if (this.loader) this.loader.style.display = 'none';
    if (this.canvas) this.canvas.style.display = 'none';
    if (this.fallback) this.fallback.style.display = 'flex';
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x131514);
    this.scene.fog = new THREE.FogExp2(0x131514, 0.012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 300);
    const heroPreset = this.cameraPresets.hero;
    this.camera.position.set(heroPreset.x, heroPreset.y, heroPreset.z);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 4. OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(heroPreset.target.x, heroPreset.target.y, heroPreset.target.z);
    this.controls.minDistance = 12;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent looking under ground
    this.controls.minPolarAngle = 0.1;

    // 5. Build Material Palette
    this.initMaterials();

    // 6. Lighting Setup
    this.initLighting();

    // 7. Load GLB or Fallback to Procedural Villa
    this.loadVillaModel();

    // 8. Event Listeners & UI Binding
    this.bindEvents();

    // 9. Intersection Observer (pause rendering when scrolled offscreen)
    this.setupIntersectionObserver();

    // 10. Start loop
    this.startRendering();
  }

  initMaterials() {
    // Architectural Concrete / Limestone
    this.materials.concrete = new THREE.MeshStandardMaterial({
      color: 0xDDD8CF,
      roughness: 0.82,
      metalness: 0.05,
      bumpScale: 0.02
    });

    // Dark Basalt / Charcoal Foundation
    this.materials.basalt = new THREE.MeshStandardMaterial({
      color: 0x242826,
      roughness: 0.9,
      metalness: 0.1
    });

    // Timber Louvers & Ceiling (Smoked Oak)
    this.materials.timber = new THREE.MeshStandardMaterial({
      color: 0x946E4A,
      roughness: 0.65,
      metalness: 0.05
    });

    // Metal Mullions / Fascia (Black Bronze)
    this.materials.bronze = new THREE.MeshStandardMaterial({
      color: 0x1E201F,
      roughness: 0.35,
      metalness: 0.75
    });

    // Architectural Glass
    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xA3C2D1,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.52,
      depthWrite: false
    });

    // Balustrade Glass
    this.materials.balustrade = new THREE.MeshStandardMaterial({
      color: 0xD8EAF2,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1
    });

    // Infinity Pool Water
    this.materials.water = new THREE.MeshStandardMaterial({
      color: 0x1F8A98,
      roughness: 0.15,
      metalness: 0.35,
      transparent: true,
      opacity: 0.82
    });

    // Pool Basin
    this.materials.poolBasin = new THREE.MeshStandardMaterial({
      color: 0x144B52,
      roughness: 0.4
    });

    // Lawn / Landscape
    this.materials.lawn = new THREE.MeshStandardMaterial({
      color: 0x364034,
      roughness: 0.95,
      metalness: 0.02
    });

    // Fire Pit Coals (Emissive Warmth)
    this.materials.fire = new THREE.MeshStandardMaterial({
      color: 0xFF5500,
      emissive: 0xFF4400,
      emissiveIntensity: 2.5,
      roughness: 0.5
    });

    // Interior Warm Floors
    this.materials.interiorFloor = new THREE.MeshStandardMaterial({
      color: 0xBA9873,
      roughness: 0.5,
      metalness: 0.05
    });
  }

  initLighting() {
    this.lighting = {};

    // Ambient Light
    this.lighting.ambient = new THREE.AmbientLight(0xE2DCD4, 0.4);
    this.scene.add(this.lighting.ambient);

    // Directional Sun Light
    this.lighting.sun = new THREE.DirectionalLight(0xFCE1B6, 1.6);
    this.lighting.sun.position.set(38, 30, 24);
    this.lighting.sun.castShadow = true;
    this.lighting.sun.shadow.mapSize.width = 2048;
    this.lighting.sun.shadow.mapSize.height = 2048;
    this.lighting.sun.shadow.camera.near = 5;
    this.lighting.sun.shadow.camera.far = 130;
    this.lighting.sun.shadow.camera.left = -30;
    this.lighting.sun.shadow.camera.right = 30;
    this.lighting.sun.shadow.camera.top = 30;
    this.lighting.sun.shadow.camera.bottom = -30;
    this.lighting.sun.shadow.bias = -0.0004;
    this.scene.add(this.lighting.sun);

    // Subtle Sky Hemispheric Light
    this.lighting.hemi = new THREE.HemisphereLight(0xF4E8DA, 0x1C2220, 0.6);
    this.scene.add(this.lighting.hemi);

    // Warm Poolside Uplight
    this.lighting.poolGlow = new THREE.PointLight(0x2BD2E8, 0.8, 18);
    this.lighting.poolGlow.position.set(-6, 0.8, 8);
    this.scene.add(this.lighting.poolGlow);

    // Fire Pit Hearth Light
    this.fireLight = new THREE.PointLight(0xFFA133, 1.8, 12);
    this.fireLight.position.set(-8, 1.5, 14);
    this.scene.add(this.fireLight);

    // Interior Spotlights
    const intLight1 = new THREE.PointLight(0xFFE2B0, 1.5, 15);
    intLight1.position.set(2, 4.5, 0);
    this.scene.add(intLight1);
    this.interiorLights.push(intLight1);

    const intLight2 = new THREE.PointLight(0xFFE2B0, 1.5, 15);
    intLight2.position.set(6, 9.5, -2);
    this.scene.add(intLight2);
    this.interiorLights.push(intLight2);

    // Apply default mode (Dusk)
    this.setLightingMode('dusk');
  }

  loadVillaModel() {
    const gltfLoader = new THREE.GLTFLoader();
    const modelPath = 'assets/models/villa.glb';

    gltfLoader.load(
      modelPath,
      (gltf) => {
        // External GLB loaded successfully
        this.villaGroup = gltf.scene;
        this.villaGroup.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.scene.add(this.villaGroup);
        this.hideLoader();
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          if (this.loaderText) this.loaderText.textContent = `Loading Villa Model: ${percent}%`;
        }
      },
      () => {
        // Fallback: build procedural modernist architecture
        if (this.loaderText) this.loaderText.textContent = 'Generating Procedural Architecture...';
        this.buildProceduralVilla();
        this.hideLoader();
      }
    );
  }

  buildProceduralVilla() {
    this.villaGroup = new THREE.Group();

    // -------------------------------------------------------------
    // 1. Terrain & Ground Podium
    // -------------------------------------------------------------
    // Main site base
    const siteGeo = new THREE.BoxGeometry(70, 1, 60);
    const siteMesh = new THREE.Mesh(siteGeo, this.materials.basalt);
    siteMesh.position.y = -0.5;
    siteMesh.receiveShadow = true;
    this.villaGroup.add(siteMesh);

    // Manicured Lawn Pads
    const lawnGeo = new THREE.BoxGeometry(26, 0.3, 24);
    const lawnMesh = new THREE.Mesh(lawnGeo, this.materials.lawn);
    lawnMesh.position.set(-18, 0.15, -12);
    lawnMesh.receiveShadow = true;
    this.villaGroup.add(lawnMesh);

    // Architectural Podium Terrace (Travertine)
    const podiumGeo = new THREE.BoxGeometry(42, 1.2, 34);
    const podiumMesh = new THREE.Mesh(podiumGeo, this.materials.concrete);
    podiumMesh.position.set(0, 0.6, 2);
    podiumMesh.receiveShadow = true;
    this.villaGroup.add(podiumMesh);

    // Stepping stones
    for (let i = 0; i < 5; i++) {
      const stepGeo = new THREE.BoxGeometry(4, 0.25, 1.8);
      const step = new THREE.Mesh(stepGeo, this.materials.concrete);
      step.position.set(-15, 0.25, 4 + i * 2.8);
      step.receiveShadow = true;
      this.villaGroup.add(step);
    }

    // -------------------------------------------------------------
    // 2. Infinity Pool & Water
    // -------------------------------------------------------------
    // Pool Cutout / Basin
    const poolBasinGeo = new THREE.BoxGeometry(16, 1.4, 8);
    const poolBasin = new THREE.Mesh(poolBasinGeo, this.materials.poolBasin);
    poolBasin.position.set(-6, 0.5, 12);
    this.villaGroup.add(poolBasin);

    // Reflective Water Surface
    const waterGeo = new THREE.PlaneGeometry(15.4, 7.4, 24, 24);
    this.waterMesh = new THREE.Mesh(waterGeo, this.materials.water);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(-6, 1.05, 12);
    this.villaGroup.add(this.waterMesh);

    // Sunken Fire Pit Hearth
    const firePitGeo = new THREE.BoxGeometry(5, 0.6, 5);
    const firePit = new THREE.Mesh(firePitGeo, this.materials.basalt);
    firePit.position.set(-8, 0.9, 14);
    this.villaGroup.add(firePit);

    const coalGeo = new THREE.BoxGeometry(2, 0.3, 2);
    const coals = new THREE.Mesh(coalGeo, this.materials.fire);
    coals.position.set(-8, 1.15, 14);
    this.villaGroup.add(coals);

    // -------------------------------------------------------------
    // 3. Ground Level Living Pavilion
    // -------------------------------------------------------------
    // Concrete Feature Shear Wall
    const shearWallGeo = new THREE.BoxGeometry(1.2, 6.5, 20);
    const shearWall = new THREE.Mesh(shearWallGeo, this.materials.concrete);
    shearWall.position.set(-11, 4.45, 0);
    shearWall.castShadow = true;
    shearWall.receiveShadow = true;
    this.villaGroup.add(shearWall);

    // Rear Structural Wall
    const rearWallGeo = new THREE.BoxGeometry(24, 6.5, 1.2);
    const rearWall = new THREE.Mesh(rearWallGeo, this.materials.concrete);
    rearWall.position.set(1.5, 4.45, -9.5);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    this.villaGroup.add(rearWall);

    // Interior Warm Floor
    const intFloorGeo = new THREE.BoxGeometry(23, 0.1, 18);
    const intFloor = new THREE.Mesh(intFloorGeo, this.materials.interiorFloor);
    intFloor.position.set(1.5, 1.25, -0.5);
    this.villaGroup.add(intFloor);

    // Floor-to-Ceiling Glazed Facade (Front)
    const glassFrontGeo = new THREE.BoxGeometry(22, 5.8, 0.15);
    const glassFront = new THREE.Mesh(glassFrontGeo, this.materials.glass);
    glassFront.position.set(1.5, 4.2, 8.5);
    this.villaGroup.add(glassFront);

    // Glazed Facade (Side)
    const glassSideGeo = new THREE.BoxGeometry(0.15, 5.8, 18);
    const glassSide = new THREE.Mesh(glassSideGeo, this.materials.glass);
    glassSide.position.set(12.5, 4.2, -0.5);
    this.villaGroup.add(glassSide);

    // Black Metal Window Mullions (Front Framing)
    for (let x = -8; x <= 11; x += 4.75) {
      const mullionGeo = new THREE.BoxGeometry(0.2, 5.8, 0.3);
      const mullion = new THREE.Mesh(mullionGeo, this.materials.bronze);
      mullion.position.set(x, 4.2, 8.5);
      mullion.castShadow = true;
      this.villaGroup.add(mullion);
    }

    // -------------------------------------------------------------
    // 4. Ground Ceiling & Intermediate Slabs
    // -------------------------------------------------------------
    const midSlabGeo = new THREE.BoxGeometry(32, 1, 24);
    const midSlab = new THREE.Mesh(midSlabGeo, this.materials.concrete);
    midSlab.position.set(2, 7.6, 1);
    midSlab.castShadow = true;
    midSlab.receiveShadow = true;
    this.villaGroup.add(midSlab);

    // Timber Soffit / Under-Slab Cladding
    const soffitGeo = new THREE.BoxGeometry(31.6, 0.1, 23.6);
    const soffit = new THREE.Mesh(soffitGeo, this.materials.timber);
    soffit.position.set(2, 7.05, 1);
    this.villaGroup.add(soffit);

    // -------------------------------------------------------------
    // 5. Upper Level: Cantilevered Master Suite
    // -------------------------------------------------------------
    // Upper Main Volume (Cantilevers 7 units forward over pool terrace!)
    const upperGeo = new THREE.BoxGeometry(20, 5.5, 15);
    const upperMesh = new THREE.Mesh(upperGeo, this.materials.concrete);
    upperMesh.position.set(4, 10.85, 3.5);
    upperMesh.castShadow = true;
    upperMesh.receiveShadow = true;
    this.villaGroup.add(upperMesh);

    // Master Bedroom Glazing (Front of Cantilever)
    const upperGlassGeo = new THREE.BoxGeometry(17, 4.6, 0.15);
    const upperGlass = new THREE.Mesh(upperGlassGeo, this.materials.glass);
    upperGlass.position.set(4, 10.85, 11.05);
    this.villaGroup.add(upperGlass);

    // Timber Architectural Louver Screen / Slats
    for (let i = 0; i < 9; i++) {
      const louverGeo = new THREE.BoxGeometry(17, 0.18, 0.8);
      const louver = new THREE.Mesh(louverGeo, this.materials.timber);
      louver.position.set(4, 8.9 + i * 0.52, 11.5);
      louver.castShadow = true;
      this.villaGroup.add(louver);
    }

    // Upper Roof Floating Slab
    const roofSlabGeo = new THREE.BoxGeometry(22, 0.9, 17);
    const roofSlab = new THREE.Mesh(roofSlabGeo, this.materials.concrete);
    roofSlab.position.set(4, 14.05, 3.5);
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    this.villaGroup.add(roofSlab);

    // Cantilever Balustrade (Frameless Glass)
    const balustradeGeo = new THREE.BoxGeometry(18, 1.2, 0.1);
    const balustrade = new THREE.Mesh(balustradeGeo, this.materials.balustrade);
    balustrade.position.set(4, 8.7, 11.8);
    this.villaGroup.add(balustrade);

    // -------------------------------------------------------------
    // 6. External Architectural Slatted Pergola
    // -------------------------------------------------------------
    for (let p = 0; p < 8; p++) {
      const beamGeo = new THREE.BoxGeometry(0.2, 0.6, 11);
      const beam = new THREE.Mesh(beamGeo, this.materials.bronze);
      beam.position.set(-10 + p * 1.5, 7.8, 6.5);
      beam.castShadow = true;
      this.villaGroup.add(beam);
    }

    // -------------------------------------------------------------
    // 7. Landscaping: Minimalist Architectural Cypress / Trees
    // -------------------------------------------------------------
    const treePositions = [
      { x: -16, z: -10, s: 1.2 },
      { x: -19, z: -4, s: 0.9 },
      { x: -21, z: 8, s: 1.1 },
      { x: 18, z: -14, s: 1.3 },
      { x: 21, z: -8, s: 0.95 }
    ];

    treePositions.forEach((pos) => {
      const treeGroup = new THREE.Group();

      // Slender Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.12 * pos.s, 0.18 * pos.s, 2.5 * pos.s, 6);
      const trunk = new THREE.Mesh(trunkGeo, this.materials.bronze);
      trunk.position.y = (2.5 * pos.s) / 2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Architectural Foliage Cone
      const foliageGeo = new THREE.ConeGeometry(1.2 * pos.s, 6.5 * pos.s, 7);
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x2D372B,
        roughness: 0.9
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.5 * pos.s + (6.5 * pos.s) / 2 - 0.4;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      treeGroup.position.set(pos.x, 0, pos.z);
      this.villaGroup.add(treeGroup);
    });

    // Add everything to scene
    this.scene.add(this.villaGroup);
  }

  setLightingMode(mode) {
    this.currentLightMode = mode;
    if (!this.lighting) return;

    if (mode === 'dusk') {
      // Golden Hour Warmth
      this.scene.background.set(0x131514);
      this.scene.fog.color.set(0x131514);
      this.lighting.ambient.color.set(0xCAA885);
      this.lighting.ambient.intensity = 0.55;

      this.lighting.sun.color.set(0xFFAF55);
      this.lighting.sun.intensity = 2.2;
      this.lighting.sun.position.set(40, 18, 22);

      this.lighting.hemi.color.set(0xE0A370);
      this.lighting.hemi.groundColor.set(0x181F1D);
      this.lighting.hemi.intensity = 0.6;

      this.renderer.toneMappingExposure = 1.25;

      if (this.fireLight) this.fireLight.intensity = 2.4;
      this.interiorLights.forEach((l) => (l.intensity = 2.0));
    } else if (mode === 'day') {
      // Crisp Natural Daylight
      this.scene.background.set(0x1E2220);
      this.scene.fog.color.set(0x1E2220);
      this.lighting.ambient.color.set(0xE7E2D9);
      this.lighting.ambient.intensity = 0.7;

      this.lighting.sun.color.set(0xFFF6E8);
      this.lighting.sun.intensity = 2.4;
      this.lighting.sun.position.set(30, 45, 30);

      this.lighting.hemi.color.set(0xC9DBE6);
      this.lighting.hemi.groundColor.set(0x383F3A);
      this.lighting.hemi.intensity = 0.8;

      this.renderer.toneMappingExposure = 1.05;

      if (this.fireLight) this.fireLight.intensity = 0.6;
      this.interiorLights.forEach((l) => (l.intensity = 0.5));
    } else if (mode === 'night') {
      // Atmospheric Nocturne
      this.scene.background.set(0x0C0E0D);
      this.scene.fog.color.set(0x0C0E0D);
      this.lighting.ambient.color.set(0x3A444C);
      this.lighting.ambient.intensity = 0.25;

      this.lighting.sun.color.set(0x7894B0);
      this.lighting.sun.intensity = 0.45;
      this.lighting.sun.position.set(25, 35, 10);

      this.lighting.hemi.color.set(0x232E3A);
      this.lighting.hemi.groundColor.set(0x0B0D0C);
      this.lighting.hemi.intensity = 0.35;

      this.renderer.toneMappingExposure = 1.4;

      if (this.fireLight) this.fireLight.intensity = 3.6;
      this.interiorLights.forEach((l) => (l.intensity = 3.2));
    }
  }

  setCameraPreset(presetKey) {
    const preset = this.cameraPresets[presetKey];
    if (!preset || !this.camera || !this.controls) return;

    if (window.gsap) {
      window.gsap.to(this.camera.position, {
        x: preset.x,
        y: preset.y,
        z: preset.z,
        duration: 1.4,
        ease: 'power2.inOut'
      });
      window.gsap.to(this.controls.target, {
        x: preset.target.x,
        y: preset.target.y,
        z: preset.target.z,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => this.controls.update()
      });
    } else {
      this.camera.position.set(preset.x, preset.y, preset.z);
      this.controls.target.set(preset.target.x, preset.target.y, preset.target.z);
      this.controls.update();
    }
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    Object.values(this.materials).forEach((mat) => {
      if (mat) mat.wireframe = this.isWireframe;
    });
    if (this.btnWireframe) {
      this.btnWireframe.classList.toggle('active', this.isWireframe);
    }
  }

  resetCamera() {
    this.setCameraPreset('hero');
  }

  hideLoader() {
    if (this.loader) {
      this.loader.classList.add('hidden');
    }
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Reset button
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.resetCamera());
    }

    // Wireframe button
    if (this.btnWireframe) {
      this.btnWireframe.addEventListener('click', () => this.toggleWireframe());
    }

    // Lighting Mode buttons
    this.lightButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.lightButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-light');
        this.setLightingMode(mode);
      });
    });

    // Camera preset buttons
    this.camButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.camButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cam = btn.getAttribute('data-cam');
        this.setCameraPreset(cam);
      });
    });

    // Cursor interaction indicator
    if (this.container) {
      this.container.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-drag');
      });
      this.container.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-drag');
      });
    }
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startRendering();
          } else {
            this.stopRendering();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(this.container);
  }

  startRendering() {
    if (this.isRendering) return;
    this.isRendering = true;
    this.renderLoop();
  }

  stopRendering() {
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  renderLoop() {
    if (!this.isRendering) return;

    this.animationFrameId = requestAnimationFrame(() => this.renderLoop());

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Water ripple subtle animation
    if (this.waterMesh && this.waterMesh.geometry) {
      const time = performance.now() * 0.002;
      const pos = this.waterMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.5 + time) * 0.04 + Math.cos(v * 0.5 + time * 0.8) * 0.03;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // Fire flickering
    if (this.fireLight) {
      this.fireLight.intensity += (Math.random() - 0.5) * 0.15;
      this.fireLight.intensity = Math.max(1.2, Math.min(3.8, this.fireLight.intensity));
    }

    // Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.atelier3D = new Atelier3DScene();
});
