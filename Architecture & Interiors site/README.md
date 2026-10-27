# ATELIER — Architecture & Interiors

A cinematic, immersive luxury architecture and interior design website built using modern HTML5, CSS3, vanilla JavaScript, GSAP, ScrollTrigger, and Three.js.

Designed with contemporary architectural aesthetics: quiet luxury, editorial typography, asymmetric layouts, generous whitespace, scroll-driven storytelling, and an interactive 3D villa model with real-time lighting and camera controls.

---

## 1. Project Overview & Folder Structure

```text
atelier-studio/
├── index.html                  # Semantic, accessible HTML5 structure & SEO metadata
├── css/
│   └── style.css               # Design system, CSS tokens, responsive typography & layouts
├── js/
│   ├── main.js                 # Core interactions, modals, contact form, clipboard utility
│   ├── animations.js           # GSAP & ScrollTrigger timelines, pinning, parallax & horizontal track
│   └── scene3d.js              # Three.js 3D villa visualization, OrbitControls, atmospheres & fallback
├── assets/
│   ├── images/                 # High-resolution architectural photography & SVG favicon
│   │   ├── hero-villa.jpg
│   │   ├── about-architecture.jpg
│   │   ├── project-1-stillwater.jpg
│   │   ├── project-2-house-of-light.jpg
│   │   ├── project-3-courtyard.jpg
│   │   ├── project-4-horizon.jpg
│   │   ├── interior-hero.jpg
│   │   ├── interior-detail-1.jpg
│   │   ├── interior-detail-2.jpg
│   │   ├── material-stone.jpg
│   │   ├── material-oak.jpg
│   │   ├── material-linen.jpg
│   │   ├── studio-architect.jpg
│   │   └── favicon.svg
│   ├── models/                 # Directory for optional custom GLTF/GLB models
│   │   ├── README.md
│   │   └── villa.glb           # (Optional) Place custom 3D model here
│   └── fonts/                  # (Optional local fonts; Google Fonts CDN loaded in index.html)
└── README.md                   # Full documentation & setup guide
```

---

## 2. Launching Locally with VS Code Live Server

The project requires **no build system, bundler, or Node.js runtime**. It is 100% vanilla web technology designed to run immediately via VS Code Live Server.

### Step-by-Step Instructions:

1. **Install Live Server Extension** (if not already installed):
   - Open VS Code.
   - Press `Ctrl + Shift + X` (or `Cmd + Shift + X` on macOS) to open the Extensions tab.
   - Search for **"Live Server"** by *Ritwick Dey* and click **Install**.

2. **Open the Project Folder**:
   - In VS Code, go to **File → Open Folder...**
   - Select the `atelier-studio` folder (or the root workspace containing `index.html`).

3. **Start the Server**:
   - Right-click on `index.html` in the file explorer and select **"Open with Live Server"**.
   - Alternatively, click the **"Go Live"** button in the bottom-right status bar of VS Code.
   - Your default browser will launch at:
     ```text
     http://127.0.0.1:5500/index.html
     ```

---

## 3. How the 3D Villa Experience Works (`scene3d.js`)

The 3D interactive section provides real-time architectural exploration using Three.js and OrbitControls:

1. **Dual Asset Strategy (Procedural Architecture + Custom GLB Support)**:
   - When initialized, `js/scene3d.js` attempts to load `assets/models/villa.glb`.
   - If `villa.glb` is absent or encounters a network error, it automatically constructs a high-fidelity **procedural modernist villa** using parametric geometries:
     - Multi-tiered post-tensioned concrete slabs with 7-unit overhang cantilevers.
     - Glazed curtain walls with dark bronze mullions and interior warm floor plates.
     - Smoked oak horizontal solar louvers and pergolas.
     - Infinity pool with animated sinusoidal water ripples and turquoise basin.
     - Sunken lounge fire pit with animated ember flickering.
     - Manicured lawn podiums, stepping stones, and architectural cypress trees.
2. **Atmosphere Modes**:
   - **Golden Dusk**: Warm directional sunlight with long shadows, glowing interior downlights, and warm fire pit.
   - **Daylight**: Crisp natural architectural sunlight with clear sky fill.
   - **Night (Nocturne)**: Dramatic moody exterior lighting, underwater pool illuminations, and glowing room volumes.
3. **Camera Perspective Presets**:
   - **Hero**: Wide architectural 3/4 perspective.
   - **Pool**: Low terrace viewpoint capturing the reflection and water line.
   - **Upper (Cantilever)**: Focused close-up of the master cantilever and timber louvers.
   - **Plan**: Orthographic aerial plan view of the full site layout.
4. **Performance & Battery Preservation**:
   - An `IntersectionObserver` halts the `requestAnimationFrame` render loop whenever the 3D canvas is scrolled out of view.
   - OrbitControls are clamped (`maxPolarAngle = Math.PI / 2 - 0.03`) so users cannot clip underneath the ground.

---

## 4. Instructions for Placing an Optional Custom `.glb` Model

To use your own 3D architectural model exported from Blender, 3ds Max, Rhino, Revit, or SketchUp:

1. Export your model in binary format as **`.glb`**.
2. Optimize textures (use 1K or 2K compressed textures).
3. Save the file to:
   ```text
   assets/models/villa.glb
   ```
4. Reload the page. Three.js `GLTFLoader` will automatically detect `villa.glb`, import it into the scene, apply directional shadows, and position the camera.

---

## 5. How the GSAP and ScrollTrigger Animations Work (`animations.js`)

The motion design is choreographed with restrained elegance:

1. **Hero Entrance Sequence**:
   - `siteHeader` descends with subtle opacity.
   - Eyebrows reveal with vertical translation.
   - Oversized headline lines animate upward through masked parent wrappers (`overflow: hidden`).
   - Description and CTAs slide and fade into view.
2. **Scroll Effect A (Hero Transition)**:
   - Background image slowly zooms (`scale: 1.22`) and moves on scrub.
   - Hero copy fades and elevates out of focus as the user reaches the story section.
3. **Scroll Effect B (Multi-Layer Parallax)**:
   - Elements with `.parallax-box` utilize `data-speed` attributes to translate images along the vertical axis at varying relative speeds.
4. **Scroll Effect C (Pinned Story Section)**:
   - Left visual stage pins in place while the user scrolls through the 3 philosophy chapters.
   - As each text step passes the 55% viewport threshold, the active image crossfades smoothly.
5. **Scroll Effect D (Horizontal Project Gallery)**:
   - On desktop viewports (`min-width: 1024px`), the vertical scroll drives horizontal motion across the four project monographs.
   - An animated progress bar and counter track the current project (`01` to `04`).
   - On tablets and mobile, it gracefully reflows into a touch-friendly carousel/list.
6. **Animated Statistics**:
   - Studio stats (`18+`, `140+`, `14`, `6`) trigger once when entering viewport, counting smoothly from 0 to target values.
7. **Accessibility & Reduced Motion**:
   - When `prefers-reduced-motion: reduce` is detected (or toggled in OS settings), ScrollTrigger pinning, parallax transforms, and badge rotations are safely bypassed with static layouts.

---

## 6. Customization Guide

### 1. Colors & Design Tokens (`css/style.css`)
Edit the `:root` variables in `css/style.css` to update the palette:
```css
:root {
  --color-ivory: #F0EDE6;        /* Primary light background */
  --color-beige: #E7E1D7;        /* Soft neutral tone */
  --color-charcoal: #202321;     /* Contact section & deep darks */
  --color-dark-bg: #131514;      /* Main site background */
  --color-taupe: #9C8260;        /* Accent warm earth tone */
  --color-gold: #C9A978;         /* Signature understated gold */
}
```

### 2. Typography
In `index.html`, Google Fonts imports `Cormorant Garamond` (editorial serif) and `Plus Jakarta Sans` (clean sans-serif). To substitute fonts, update the `<link>` in the `<head>` and the font family declarations in `css/style.css`:
```css
--font-serif: 'Cormorant Garamond', Georgia, serif;
--font-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
```

### 3. Modifying Projects & Case Studies (`js/main.js`)
Edit the `ATELIER_PROJECTS` dictionary in `js/main.js` to change names, locations, narratives, or technical specifications. The modal automatically displays whatever data is configured in this object.

### 4. Updating Studio Information
All studio addresses, direct contact emails (`inquiries@atelier-architects.com`), phone numbers, and office locations are accessible directly within `index.html`.

---

## 7. Troubleshooting Guidance

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **3D Model does not render** | Local browser file protocol restrictions (`file:///`) block WebGL shaders or GLTFLoader. | Open the project using **VS Code Live Server** or any local HTTP server (`http://localhost:...`). Never double-click `index.html` directly from Windows Explorer. |
| **Missing Images** | Incorrect paths or broken internet connection. | All images are stored locally in `assets/images/`. Ensure the `assets/images/` directory is present alongside `index.html`. |
| **CDN Scripts Fail (GSAP or Three.js)** | Strict firewall or corporate network blocking Cloudflare / CDNJS. | Download `gsap.min.js`, `ScrollTrigger.min.js`, and `three.min.js` directly and save them to a local `js/libs/` folder, then update script tags in `index.html`. |
| **WebGL Disabled Message** | Hardware acceleration disabled in browser. | In Chrome/Edge: Go to `Settings → System` and turn ON **"Use graphics acceleration when available"**. |
| **Horizontal gallery does not scroll on mobile** | Designed responsive behavior. | On screens below 1024px, the website switches to natural touch-friendly swiping to ensure accessibility and avoid scroll hijacking. |
