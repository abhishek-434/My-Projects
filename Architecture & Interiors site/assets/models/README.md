# 3D Architectural Model (Optional GLTF/GLB)

ATELIER includes a procedural 3D villa architectural model generated in real-time via Three.js.

If you wish to replace the procedural villa with your own custom architectural 3D model:
1. Export your architectural model in binary `.glb` format (e.g. from Blender, Rhino, Revit, SketchUp, or 3ds Max).
2. Optimize textures (WebP or compressed JPEG/PNG) and geometries using tools like `gltf-transform`.
3. Save the file as:
   `assets/models/villa.glb`

`js/scene3d.js` will automatically detect `villa.glb`, smoothly load it using Three.js `GLTFLoader`, fit it within the camera frustum, and apply realistic architectural lighting. If the file is not present or fails to load, ATELIER seamlessly renders the procedural modernist villa without interruption or error.
