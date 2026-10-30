import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_DEVICES,
  kelvinToRgb,
  calculateRoomLighting,
  filterDevices,
  executeLocalCommand,
  getLightModePreset,
} from './mijiaEngine';

test('kelvinToRgb converts warm 2700K and cool 6500K accurately', () => {
  const warm = kelvinToRgb(2700);
  const cool = kelvinToRgb(6500);
  assert.equal(warm.r, 255);
  assert.ok(warm.b < 100, '2700K should have low blue channel');
  assert.ok(cool.b > 240, '6500K should have high blue channel');
});

test('calculateRoomLighting aggregates active lights and returns zero lux when all lights are off', () => {
  const initialSummary = calculateRoomLighting(INITIAL_DEVICES);
  assert.equal(initialSummary.anyLightOn, true);
  assert.equal(initialSummary.activeLightCount, 1);
  assert.ok(initialSummary.averageBrightness > 60);
  assert.ok(initialSummary.estimatedLux > 100);

  const allOffDevices = INITIAL_DEVICES.map((d) =>
    d.category === 'light' ? { ...d, on: false } : d
  );
  const offSummary = calculateRoomLighting(allOffDevices);
  assert.equal(offSummary.anyLightOn, false);
  assert.equal(offSummary.activeLightCount, 0);
  assert.equal(offSummary.averageBrightness, 0);
  assert.equal(offSummary.estimatedLux, 0);
});

test('filterDevices matches Pinyin initials like sftd and pmgd without switching IME', () => {
  const sftdResults = filterDevices(INITIAL_DEVICES, 'sftd');
  assert.equal(sftdResults.length, 1);
  assert.equal(sftdResults[0].id, 'study-desk-lamp');

  const pmgdResults = filterDevices(INITIAL_DEVICES, 'pmgd');
  assert.equal(pmgdResults.length, 1);
  assert.equal(pmgdResults[0].id, 'monitor-light-bar');

  const studyRoom = filterDevices(INITIAL_DEVICES, '', '书房');
  assert.equal(studyRoom.length, 3);
});

test('executeLocalCommand parses moonlight mode, all-off, and AC temperature adjustments locally', () => {
  const moonRes = executeLocalCommand(INITIAL_DEVICES, '书房吸顶灯月光模式');
  assert.equal(moonRes.matched, true);
  const studyLamp = moonRes.updatedDevices.find((d) => d.id === 'study-desk-lamp');
  assert.equal(studyLamp?.lightMode, 'moonlight');
  assert.equal(studyLamp?.colorTemp, 2700);

  const offRes = executeLocalCommand(INITIAL_DEVICES, '关闭所有灯');
  assert.equal(offRes.matched, true);
  const activeLights = offRes.updatedDevices.filter((d) => d.category === 'light' && d.on);
  assert.equal(activeLights.length, 0);
  // Smart plug should remain on (excluded from All Off by default)
  const plug = offRes.updatedDevices.find((d) => d.id === 'desk-smart-plug');
  assert.equal(plug?.on, true);

  const acRes = executeLocalCommand(INITIAL_DEVICES, '把空调调到 26 度');
  assert.equal(acRes.matched, true);
  const ac = acRes.updatedDevices.find((d) => d.id === 'living-ac');
  assert.equal(ac?.targetTemp, 26);
});

test('getLightModePreset returns authentic Kelvin and brightness values', () => {
  const moonlight = getLightModePreset('moonlight');
  assert.equal(moonlight.colorTemp, 2700);
  assert.equal(moonlight.brightness, 10);
});
