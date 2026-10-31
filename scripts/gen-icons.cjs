// Generates src/components/icons.tsx from @primer/octicons (raw SVG data, no React dependency).
// Re-run after adding a name to `names`:  node scripts/gen-icons.cjs
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const octicons = require(path.join(root, 'node_modules/@primer/octicons'));

const names = [
  'home', 'book', 'image', 'person', 'repo', 'repo-forked', 'archive', 'star-fill', 'law',
  'history', 'mark-github', 'mail', 'three-bars', 'x', 'arrow-left', 'arrow-right',
];

const pascal = (n) => n.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('') + 'Icon';

let out = `// Generated from @primer/octicons (regenerate with: node scripts/gen-icons.cjs). Raw SVG paths rather than
// @primer/octicons-react, which imports React and can't be server-rendered through Preact here.
import type { JSX } from 'preact';

interface IconProps {
  size?: number;
  class?: string;
}

function make(paths: string) {
  return function Icon({ size = 16, class: className }: IconProps): JSX.Element {
    return (
      <svg
        class={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'inline-block', userSelect: 'none', verticalAlign: 'text-bottom', overflow: 'visible' }}
        dangerouslySetInnerHTML={{ __html: paths }}
      />
    );
  };
}

`;

for (const n of names) {
  const icon = octicons[n];
  if (!icon) throw new Error('missing icon ' + n);
  const h = icon.heights[16] ? 16 : Object.keys(icon.heights)[0];
  const p = icon.heights[h].path;
  out += `export const ${pascal(n)} = make(${JSON.stringify(p)});\n`;
}

fs.writeFileSync(path.join(root, 'src/components/icons.tsx'), out);
console.log('wrote', names.length, 'icons');
