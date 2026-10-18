import test from 'node:test';
import assert from 'node:assert/strict';
import { gardenProgress } from '../src/workspace/garden.js';
const session = (minutes, id = 'one', mode = 'focus', status = 'completed') => ({ id, mode, status, duration: minutes * 60 });
test('garden begins empty and planting alone does not award minutes', () => {
  assert.equal(gardenProgress([]).planted, false);
  const planted = gardenProgress([], true);
  assert.equal(planted.planted, true); assert.equal(planted.total, 0); assert.equal(planted.stage, 0);
});
test('garden reaches each milestone using only completed focus minutes', () => {
  for (const [minutes, stage] of [[0,0], [24,0], [25,1], [74,1], [75,2], [149,2], [150,3], [249,3], [250,4]]) {
    assert.equal(gardenProgress([session(minutes)], true).stage, stage);
  }
});
test('breaks, abandoned sessions and duplicate completion records do not grow plants', () => {
  const garden = gardenProgress([session(25), session(25), session(15, 'break', 'long'), session(25, 'abandoned', 'focus', 'abandoned')]);
  assert.equal(garden.total, 25); assert.equal(garden.stage, 1);
});
test('completed plants remain collected when the next seed is planted', () => {
  const bloomed = gardenProgress([session(250)]);
  assert.equal(bloomed.blooms, 1); assert.equal(bloomed.stage, 4);
  const planted = gardenProgress([session(250)], true, 1);
  assert.equal(planted.blooms, 1); assert.equal(planted.minutes, 0); assert.equal(planted.stage, 0);
  const growing = gardenProgress([session(250), session(25, 'next')], true, 1);
  assert.equal(growing.blooms, 1); assert.equal(growing.stage, 1);
});
test('historical focus grows several plants and a future plant index cannot award progress', () => {
  const garden = gardenProgress([session(575)], true, 100);
  assert.equal(garden.blooms, 2); assert.equal(garden.minutes, 75); assert.equal(garden.stage, 2);
});

test('first-bloom keepsake uses the real threshold completion date, independent of listener order', async () => {
  const { firstBloomDate } = await import('../src/workspace/garden.js');
  const early = { ...session(125, 'early'), completedAt: 1000 };
  const late = { ...session(125, 'late'), completedAt: 2000 };
  assert.equal(firstBloomDate([late, early]), 2000);
  assert.equal(firstBloomDate([early, early]), null);
  assert.equal(firstBloomDate([{ ...session(250, 'break', 'long'), completedAt: 1 }, early]), null);
  assert.equal(firstBloomDate([{ ...session(250, 'invalid'), completedAt: NaN }]), null);
});
