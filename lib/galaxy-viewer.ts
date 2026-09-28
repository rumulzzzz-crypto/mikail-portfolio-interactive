// The isolated SDK document releases its global listeners when motion is disabled.
// Only documented Viewer API calls are used; Sketchfab branding stays untouched.
export const galaxyViewerDocument = `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}iframe{display:block;width:100%;height:100%;border:0}</style>
</head><body>
<iframe id="scene" title="Galaxy by 991519166 on Sketchfab" allow="autoplay" tabindex="-1"></iframe>
<script>
const origin = parent.location.origin;
let api = null, ready = false, running = false, originalCamera = null, fov = 45;
let playbackRevision = 0;
const notify = status => parent.postMessage({type:"portfolio-galaxy",status}, origin);
const playback = () => {
  if(!ready) return;
  const revision = ++playbackRevision;
  const report = playback => {
    if(revision === playbackRevision) parent.postMessage({type:"portfolio-galaxy",playback},origin);
  };
  if(running && !document.hidden) {
    api.start(() => {
      if(revision !== playbackRevision) return;
      api.play(error => { if(!error) report("playing"); });
    });
  } else {
    api.pause(() => {
      if(revision === playbackRevision) api.stop(() => report("paused"));
    });
  }
};
addEventListener("message", event => {
  if(event.source !== parent || event.origin !== origin || event.data?.type !== "portfolio-galaxy-running") return;
  running = event.data.running === true;
  playback();
});
addEventListener("visibilitychange", playback);
// Pan the camera, not the iframe: the complete canvas and watermark remain visible.
function compose() {
  if(!originalCamera) return;
  const p = originalCamera.position, t = originalCamera.target;
  const v = p.map((n,i) => n-t[i]);
  const length = Math.hypot(...v);
  const forward = v.map(n => -n/length);
  const rightLength = Math.hypot(forward[0],forward[1]);
  if(rightLength < .0001) return;
  const right = [forward[1]/rightLength,-forward[0]/rightLength,0];
  const up = [right[1]*forward[2],-right[0]*forward[2],right[0]*forward[1]-right[1]*forward[0]];
  const mobile = innerWidth < 700;
  const distance = length * (mobile ? 1.85 : 1.3);
  const viewHeight = 2*distance*Math.tan(fov*Math.PI/360);
  const offsetX = (mobile ? .17 : .24) * viewHeight * innerWidth/innerHeight;
  const offsetY = (mobile ? .18 : .02) * viewHeight;
  const shift = right.map((n,i) => -n*offsetX - up[i]*offsetY);
  const target = t.map((n,i) => n+shift[i]);
  const position = t.map((n,i) => n+v[i]*distance/length+shift[i]);

  api.setCameraLookAt(position,target,0);
}
let resizeTimer;
addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer=setTimeout(compose,120); });
const sdk = document.createElement("script");
sdk.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
sdk.onerror = () => notify("error");
sdk.onload = () => {
  try {
    new Sketchfab("1.12.1", document.getElementById("scene")).init("dbb2f075329747a09cc8add2ad05acad", {
      autostart:1, preload:0, transparent:0, animation_autoplay:0, camera:0,
      max_texture_size: innerWidth < 700 ? 1024 : 2048,
      ui_infos:0, ui_hint:0, ui_controls:0, ui_stop:0, scrollwheel:0, dnt:1,
      success(viewer) {
        api = viewer;
        api.addEventListener("viewerready", () => {
          api.setUserInteraction(false);

          api.getCameraLookAt((error,camera) => {
            if(error) { notify("error"); return; }
            originalCamera = camera;
            api.getFov((error,value) => {
              if(!error) fov=value;
              compose();
              api.getAnimations((error,animations) => {
                if(error || !animations.length) { notify("error"); return; }
                api.setCurrentAnimationByUID(animations[0][0], () => {
                  api.setCycleMode("loopOne");
                  api.setSpeed(.35);
                  ready=true;
                  playback();
                  notify("ready");
                });
              });
            });
          });
        });
        api.start();
      },
      error() { notify("error"); }
    });
  } catch { notify("error"); }
};
document.head.appendChild(sdk);
</script></body></html>`;
