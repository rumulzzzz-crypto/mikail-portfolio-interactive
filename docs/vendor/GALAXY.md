# Galaxy — official local asset

- Model: Galaxy by 991519166.
- Source: https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad
- Author: https://sketchfab.com/991519166
- License: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/
- Download: official Download 3D Model dialog, GLB / 2k, on 2026-10-02 after the user connected their account. No hidden viewer assets were extracted.
- File: public/models/galaxy.glb, 1,277,240 bytes; unchanged from the official download.
- SHA-256: 466c0fcce1d6fe3da6baa56c754754e484b9fe00b5a32cc1744046019597990d.
- Embedded metadata records title, author, source and CC-BY-4.0. Asset includes Galaxy mesh, original surrounding Sphere001, three PNG images and the original Take 001 rotation animation.
- Full attribution, original source, license and rendering modifications are presented on the public /credits page, accessible through the visible «Источники» footer link, including in static mode. No third-party player is embedded, so no player branding or hint needs to be hidden.

## Rendering adaptation

Three.js GLTFLoader reads the complete local GLB. Original geometry, texture maps, alpha and animation are retained. The renderer adjusts emissive intensity, exposure and bloom to suit the black contact section; star-sphere intensity is lowered. The SDK camera's Z-up coordinates are converted to glTF Y-up. This recreates the composition rather than claiming a pixel-identical copy of Sketchfab's postprocessing.

Take 001 loops at 0.35 speed. Real spherical camera interpolation changes from the oblique view to a near top view in 1 second and returns in 1.2 seconds; interrupted requests start from the current angle. The galaxy stays on the right using responsive camera translation. The local canvas covers the complete section and is inert.

Rendering pauses offscreen and in a hidden document; reduced mode unmounts the renderer. Renderer, postprocessing targets, materials, geometry, textures and ImageBitmaps are released on unmount. Asset fetch is abortable, and late loader results are disposed. The drawing buffer is capped at 1920x1080 and DPR 1.25. WebGL failure leaves the existing poster and functional contacts.

The original official oEmbed thumbnail remains unchanged at public/images/galaxy-poster.jpg, with CSS feathering for the static fallback.

## History

The previous SDK embed was used until the official download became available. Its native click-and-hold hint could not be suppressed under the documented account restrictions; that limitation is now resolved by removing the embed entirely.

References: https://threejs.org/docs/pages/GLTFLoader.html, https://threejs.org/docs/pages/WebGLRenderer.html, https://threejs.org/docs/pages/UnrealBloomPass.html.
