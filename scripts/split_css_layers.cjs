const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'frontend', 'build', 'assets', 'index-DiAc6ytY.css');
if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(1);
}
const outDir = path.dirname(src);
const text = fs.readFileSync(src, 'utf8');

// Find @layer blocks and extract each with balanced braces.
const layerRegex = /@layer\s+([^{\s]+)\s*\{/g;
let match;
const blocks = [];
while ((match = layerRegex.exec(text)) !== null) {
  const name = match[1];
  // position of the opening brace
  const openPos = text.indexOf('{', match.index + match[0].length - 1);
  if (openPos === -1) continue;
  // find matching closing brace using a simple stack counter
  let depth = 0;
  let endPos = -1;
  for (let i = openPos; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        endPos = i;
        break;
      }
    }
  }
  if (endPos === -1) continue; // unbalanced, skip
  const chunk = text.slice(match.index, endPos + 1).trim();
  blocks.push({ name, chunk });
}

if (blocks.length === 0) {
  console.log('No @layer blocks found; will not split by layers.');
  process.exit(0);
}

for (const b of blocks) {
  const name = b.name.replace(/[^a-z0-9_-]/gi, '_');
  const outFile = path.join(outDir, `index-DiAc6ytY.@layer.${name}.css`);
  fs.writeFileSync(outFile, b.chunk + '\n', 'utf8');
  console.log('Wrote', outFile);
}
console.log('Completed splitting by @layer blocks:', blocks.map(b => b.name).join(', '));
