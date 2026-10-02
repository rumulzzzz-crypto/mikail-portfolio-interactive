// Local-only QA proxy. No diagnostics or failure switches are shipped to the site.
// Run after `next start --port 3101`: node scripts/qa-server.mjs
import http from 'node:http';

const probe = (scenario) => `<script>
(() => {
  const mode = ${JSON.stringify(scenario)};
  if (mode === 'no-webgl') {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl'
        ? null : original.call(this, type, ...args);
    };
  }
  if (mode === 'reduced-motion') {
    const original = window.matchMedia.bind(window);
    window.matchMedia = query => {
      const result = original(query);
      if (query === '(prefers-reduced-motion: reduce)') Object.defineProperty(result, 'matches', {value:true});
      return result;
    };
  }
  const metrics = {scenario: mode, lcpMs: null, lcpElement: null, cls: 0, shifts: [], longTasks: 0, blockingMsLab: 0, eventMaxMsLab: null};
  let sessionValue = 0, firstShift = 0, lastShift = 0;
  const supported = PerformanceObserver.supportedEntryTypes;
  function observe(type, handler, extra = {}) {
    if (!supported.includes(type)) return;
    new PerformanceObserver(list => list.getEntries().forEach(handler)).observe({type, buffered:true, ...extra});
  }
  observe('largest-contentful-paint', e => { metrics.lcpMs = e.startTime; metrics.lcpElement = e.element?.tagName; });
  observe('layout-shift', e => {
    if (e.hadRecentInput) return;
    if (!firstShift || e.startTime-lastShift > 1000 || e.startTime-firstShift > 5000) {
      firstShift = e.startTime; sessionValue = 0;
    }
    lastShift = e.startTime; sessionValue += e.value;
    metrics.cls = Math.max(metrics.cls, sessionValue);
    metrics.shifts.push({time:e.startTime, value:e.value, sources:e.sources.map(s => ({tag:s.node?.tagName, className:s.node?.className}))});
  });
  observe('longtask', e => { metrics.longTasks++; metrics.blockingMsLab += Math.max(0,e.duration-50); });
  observe('event', e => { if(e.interactionId) metrics.eventMaxMsLab = Math.max(metrics.eventMaxMsLab || 0,e.duration); }, {durationThreshold:16});
  const publish = () => {
    const output = document.getElementById('portfolio-qa-metrics');
    if (!output) return;
    metrics.resources = performance.getEntriesByType('resource').map(e => ({path:new URL(e.name).pathname, bytes:e.transferSize, ms:e.duration}));
    output.textContent = JSON.stringify(metrics);
  };
  document.addEventListener('DOMContentLoaded', () => {
    const output = document.createElement('output'); output.id='portfolio-qa-metrics'; output.hidden=true;
    document.body.append(output); publish(); setInterval(publish, 500);
    setTimeout(() => { publish(); output.dataset.ready = 'true'; }, 2000);
  });
})();
</script>`;

http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:3102');
  const allowed = ['normal','no-webgl','slow-model','missing-model','slow-images','slow-fonts','reduced-motion'];
  const cookie = request.headers.cookie?.match(/portfolio-qa=([^;]+)/)?.[1];
  const candidate = url.searchParams.get('qa') || cookie || 'normal';
  const mode = allowed.includes(candidate) ? candidate : 'normal';
  if (url.searchParams.has('qa')) response.setHeader('Set-Cookie', 'portfolio-qa='+mode+'; Path=/; HttpOnly; SameSite=Lax');
  const model = url.pathname === '/models/galaxy.glb';
  if (model && mode === 'missing-model') { response.writeHead(404); response.end('QA: missing model'); return; }
  const delay = model && mode === 'slow-model' ? 8000
    : url.pathname.startsWith('/images/') && mode === 'slow-images' ? 1800
    : url.pathname.startsWith('/fonts/') && mode === 'slow-fonts' ? 1800 : 0;
  const forward = () => {
    const headers = {...request.headers, host:'127.0.0.1:3101', 'accept-encoding':'identity'};
    http.get({hostname:'127.0.0.1', port:3101, path:request.url, headers}, upstream => {
      const chunks=[];
      upstream.on('data', chunk => chunks.push(chunk));
      upstream.on('end', () => {
        let body = Buffer.concat(chunks);
        const outHeaders = {...upstream.headers};
        delete outHeaders['content-length']; delete outHeaders['transfer-encoding']; delete outHeaders['content-encoding'];
        outHeaders['cache-control']='no-store';
        if (outHeaders['content-type']?.includes('text/html')) {
          body = Buffer.from(body.toString('utf8').replace('<head>', '<head>'+probe(mode)));
        }
        response.writeHead(upstream.statusCode, outHeaders); response.end(body);
      });
    }).on('error', () => { response.writeHead(502); response.end('Start the local production server on port 3101 first.'); });
  };
  if (delay) setTimeout(forward,delay); else forward();
}).listen(3102,'127.0.0.1', () => console.log('Local QA: http://127.0.0.1:3102/?qa=normal'));
