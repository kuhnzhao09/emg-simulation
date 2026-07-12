const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script id="app-script">([\s\S]*?)<\/script>/);
assert(match, 'app script not found');
const sandbox = { window: {}, console, Math, Float64Array, Uint8Array, Int32Array, Array, JSON, Date, Blob: function(){}, URL: { createObjectURL(){} } };
vm.createContext(sandbox);
vm.runInContext(match[1], sandbox);
const core = sandbox.window.EMGSimulatorCore;
assert(core, 'EMGSimulatorCore missing');

function approxArrayEqual(a, b, tol = 1e-12) {
  assert.strictEqual(a.length, b.length);
  for (let i = 0; i < a.length; i++) assert(Math.abs(a[i]-b[i]) <= tol, `difference at ${i}`);
}

{
  const r1 = core.createSeededRng(42);
  const r2 = core.createSeededRng(42);
  for (let i=0;i<10;i++) assert.strictEqual(r1(), r2());
}

{
  const p = core.defaultParams();
  const th = core.generateRecruitmentThresholds(p);
  assert.strictEqual(th.length, p.motorUnitCount);
  for (let i=1;i<th.length;i++) assert(th[i] >= th[i-1]);
  assert(Math.abs(th[th.length-1] - p.lastRecruitmentThreshold) < 1e-12);
}

{
  const p = {...core.defaultParams(), excitationType:'trapezoid'};
  const ex = core.generateExcitation(p);
  assert.strictEqual(ex.length, Math.round(p.duration*p.sampleRate));
  for (const v of ex) assert(v >= -1e-12 && v <= p.maxExcitation + 1e-12);
}

{
  const p = {...core.defaultParams(), duration: 2, sampleRate: 500, motorUnitCount: 20, channelCount: 2};
  const a = core.runSimulation(p);
  const b = core.runSimulation(p);
  assert.strictEqual(a.time.length, 1000);
  assert.strictEqual(a.signals.raw.length, 1000);
  assert.strictEqual(a.signals.channels.length, 2);
  approxArrayEqual(a.signals.raw, b.signals.raw);
  assert(a.summary.recruitedUnits >= 0 && a.summary.recruitedUnits <= 20);
  assert(a.signals.envelope.every(v => v >= -1e-12));
  const arrays = [a.time,a.excitation,a.recruitedCount,a.signals.raw,a.signals.filtered,a.signals.envelope,a.force];
  for (const arr of arrays) for (const v of arr) assert(Number.isFinite(v));
}

{
  const base = {...core.defaultParams(), duration: 2, sampleRate: 500, motorUnitCount: 30};
  const low = core.runSimulation({...base, maxExcitation:0.2});
  const high = core.runSimulation({...base, maxExcitation:0.8});
  assert(high.summary.recruitedUnits >= low.summary.recruitedUnits);
}

console.log('core tests passed');
