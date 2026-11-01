// Regenerates the site title pictures, public/title-{hero,brand}.{avif,webp}, and src/components/titleImage.json (their
// sizes). The title is the Nabla colour font drawn to a transparent canvas at 4x the size it is shown at, because Safari
// can't draw that font and every browser has to fetch it before the title appears (see src/components/titleImage.tsx).
//
// Run it, then open the printed address in Chrome or Firefox (the page refuses to draw in a browser without colour
// font support, so the black Safari stand-in can't end up baked into the pictures):
//   node scripts/gen-title.cjs [text]
// The sizes the title is shown at (80px hero, 24px strip) are the font-sizes in style.css: .heroTitle (5rem) and
// .navbar-brand (1.5rem). If those change, change SHOWN_AT here and run it again.
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = path.resolve(__dirname, '..');
const sharp = require(path.join(root, 'node_modules/sharp'));

const text = process.argv[2] || 'lilykiwi.xyz';
const SCALE = 4;
const SHOWN_AT = { hero: 80, brand: 24 }; // CSS px of font-size where each picture is used
const PORT = 4399;

const page = `<!doctype html>
<meta charset="utf-8">
<title>gen-title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nabla&display=block">
<body style="font: 16px system-ui; background: #222; color: #eee; padding: 2rem">
<p id="s">drawing...</p>
<script>
const text = ${JSON.stringify(text)};
const variants = ${JSON.stringify(Object.fromEntries(Object.entries(SHOWN_AT).map(([k, v]) => [k, v * SCALE])))};
const status = document.getElementById('s');
(async () => {
  if (!CSS.supports('font-tech(color-COLRv1)')) {
    status.textContent = 'This browser cannot draw colour fonts. Open this page in Chrome or Firefox.';
    return;
  }
  await document.fonts.load('100px Nabla', text);
  await document.fonts.ready;
  if (!document.fonts.check('100px Nabla', text)) { status.textContent = 'Nabla did not load.'; return; }
  for (const [name, size] of Object.entries(variants)) {
    const pad = Math.round(size * 0.25); // generous: the trim step removes whatever isn't painted
    const probe = document.createElement('canvas').getContext('2d');
    probe.font = size + 'px Nabla';
    const m = probe.measureText(text);
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(m.width) + pad * 2;
    canvas.height = Math.ceil(m.fontBoundingBoxAscent + m.fontBoundingBoxDescent) + pad * 2;
    const ctx = canvas.getContext('2d');
    ctx.font = size + 'px Nabla';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, pad, pad + m.fontBoundingBoxAscent);
    await fetch('/png/' + name, { method: 'POST', body: canvas.toDataURL('image/png') });
  }
  await fetch('/done', { method: 'POST' });
  status.textContent = 'Done, you can close this tab.';
})();
</script>`;

const received = {};

async function build() {
  const sizes = { text };
  for (const [name, shown] of Object.entries(SHOWN_AT)) {
    const raw = Buffer.from(received[name].replace(/^data:image\/png;base64,/, ''), 'base64');
    const { data, info } = await sharp(raw).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
    await sharp(data).avif({ quality: 62, effort: 6 }).toFile(path.join(root, `public/title-${name}.avif`));
    await sharp(data).webp({ quality: 88, effort: 6, alphaQuality: 100 }).toFile(path.join(root, `public/title-${name}.webp`));
    // height as a multiple of the font-size it is shown at, so CSS can size it in em
    sizes[name] = { width: info.width, height: info.height, em: Math.round((info.height / (shown * SCALE)) * 10000) / 10000 };
    console.log(`${name}: ${info.width}x${info.height}`);
  }
  fs.writeFileSync(path.join(root, 'src/components/titleImage.json'), JSON.stringify(sizes, null, 2) + '\n');
  console.log('wrote public/title-*.avif/.webp and src/components/titleImage.json');
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(page);
    return;
  }
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    if (req.url.startsWith('/png/')) received[req.url.slice(5)] = body;
    res.end('ok');
    if (req.url === '/done') {
      try {
        await build();
        server.close();
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }
  });
});

server.listen(PORT, '127.0.0.1', () => console.log(`Open http://localhost:${PORT} in Chrome or Firefox`));
