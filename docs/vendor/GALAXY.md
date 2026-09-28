# Galaxy attribution

- Model: Galaxy by 991519166
- Source: https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad
- Author: https://sketchfab.com/991519166
- License displayed on the model page: CC Attribution, https://creativecommons.org/licenses/by/4.0/
- Rendering: official Sketchfab embed with Viewer API 1.12.1. Model files and textures are not extracted or redistributed.
- Poster: original thumbnail returned by the official Sketchfab oEmbed endpoint, stored unchanged in public/images/galaxy-poster.jpg. CSS fits it into the stage; the original asset is unmodified.
- Attribution remains visible beside the viewer and in reduced-motion/fallback mode. Sketchfab branding is not removed.

Download was checked on 2026-09-26: Sketchfab requires sign-in. The official embed preserves the original scene materials and animation without that dependency. The third-party viewer controls rendering resolution; the website bounds its viewport and stops it offscreen, removes it beyond the preload margin, and unmounts it when the page is hidden or motion is disabled.

## Update — 2026-09-28

The same original model now reaches viewerready in Chrome, both on the site and in the standalone official embed. The earlier blank remote document was not reproducible today; no claim is made about its original cause.

The original Take 001 animation is explicitly selected, looped at 0.35 speed, and played through the official API. Camera translation puts the galaxy in the right third of a full-section, uncropped iframe. The original scene background/materials are preserved. Camera:0 disables the default introductory camera move so the initial camera can be composed deterministically.

The viewer stays mounted after its first approach and is paused/stopped offscreen or in a hidden document; switching to reduced motion removes its isolated document. Parent messages validate source and origin. Playback acknowledgements are exposed as data-playback for diagnostics, not visitor controls. No model extraction or replacement geometry is used.

The poster file is unchanged; CSS feathering and repositioning adapt it as a static fallback. Attribution is now a compact footer line. The live iframe is neither masked nor cropped, and Sketchfab branding remains visible.

Remaining limitation: Sketchfab still displays its click-and-hold hint despite ui_hint:0. Official initialization documentation lists this as a Premium option. It is deliberately not hidden with an overlay. Stage 2 is therefore partial until a locally renderable official download is provided. Download 3D Model currently opens a login form (checked 2026-09-28). Required: official GLB or glTF ZIP with all textures, animation, and license information; its visual equivalence must be checked before replacing the embed.

Documentation: https://sketchfab.com/developers/viewer/initialization and https://sketchfab.com/developers/viewer/functions
