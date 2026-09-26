// Keep the official SDK in its own document: removing the outer iframe releases
// its message listeners, global instance registry and the nested WebGL viewer.
export const galaxyViewerDocument = `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}iframe{display:block;width:100%;height:100%;border:0}</style>
</head><body>
<iframe id="scene" title="Galaxy by 991519166 on Sketchfab" allow="autoplay;fullscreen;xr-spatial-tracking" allowfullscreen></iframe>
<script>
const origin = parent.location.origin;
let api = null;
let running = true;
const notify = status => parent.postMessage({type:"portfolio-galaxy",status}, origin);
addEventListener("message", event => {
  if(event.source !== parent || event.origin !== origin || event.data?.type !== "portfolio-galaxy-running") return;
  running = event.data.running === true;
  if(api) running ? api.start() : api.stop();
});
const sdk = document.createElement("script");
sdk.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
sdk.onerror = () => notify("error");
sdk.onload = () => {
  try {
    new Sketchfab("1.12.1", document.getElementById("scene")).init("dbb2f075329747a09cc8add2ad05acad", {
      autostart:1, preload:0, transparent:0,
      max_texture_size: innerWidth < 500 ? 1024 : 2048,
      ui_infos:0, ui_hint:0, ui_controls:0, ui_stop:0, scrollwheel:0, dnt:1,
      success(viewer) {
        api = viewer;
        api.addEventListener("viewerready", () => {
          notify("ready");
          if(!running) api.stop();
        });
        api.start();
      },
      error() { notify("error"); }
    });
  } catch { notify("error"); }
};
document.head.appendChild(sdk);
</script></body></html>`;
