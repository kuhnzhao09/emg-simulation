const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
for (const text of ['运行仿真','教学预设','科研预设','导出参数 JSON','仿真完成。']) {
  assert(html.includes(text), `missing UI text: ${text}`);
}
for (const id of ['excitationCanvas','rasterCanvas','muapCanvas','rawCanvas','filteredCanvas','envelopeCanvas','forceCanvas','comparisonCanvas']) {
  assert(html.includes(`id="${id}"`), `missing canvas: ${id}`);
}
console.log('ui smoke tests passed');
