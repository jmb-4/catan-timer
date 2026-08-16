import { test, expect } from '@playwright/test';

/* ── buildSetupSequence ─────────────────────────────────────────────────── */

test('4 players: 8 steps total (forward 4 + backward 4)', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  expect(seq).toHaveLength(8);
});

test('4 players: last 4 steps have doubleTime = true', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  seq.slice(4).forEach(step => {
    expect(step.doubleTime).toBe(true);
  });
});

test('4 players: backward order is P4→P3→P2→P1', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  const back = seq.slice(4).map(s => s.playerIndex);
  expect(back).toEqual([3, 2, 1, 0]);
});

test('4 players: forward order is P1→P2→P3→P4', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  const fwd = seq.slice(0, 4).map(s => s.playerIndex);
  expect(fwd).toEqual([0, 1, 2, 3]);
});

test('forward steps have placementNumber = 1', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  seq.slice(0, 4).forEach(step => {
    expect(step.placementNumber).toBe(1);
  });
});

test('backward steps have placementNumber = 2', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  const seq = buildSetupSequence(4);
  seq.slice(4).forEach(step => {
    expect(step.placementNumber).toBe(2);
  });
});

test('2 players: 4 steps total', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  expect(buildSetupSequence(2)).toHaveLength(4);
});

test('6 players: 12 steps total', async () => {
  const { buildSetupSequence } = await import('../../setup-logic.js');
  expect(buildSetupSequence(6)).toHaveLength(12);
});

/* ── usedColors ─────────────────────────────────────────────────────────── */

test('usedColors returns empty array when upToIndex = 0', async () => {
  const { usedColors } = await import('../../setup-logic.js');
  const players = [{ color: '#red' }, { color: '#blue' }];
  expect(usedColors(players, 0)).toEqual([]);
});

test('usedColors returns colors up to (not including) index', async () => {
  const { usedColors } = await import('../../setup-logic.js');
  const players = [{ color: '#red' }, { color: '#blue' }, { color: '#green' }];
  expect(usedColors(players, 2)).toEqual(['#red', '#blue']);
});

/* ── nextAvailableColor ─────────────────────────────────────────────────── */

test('nextAvailableColor skips already-used colors', async () => {
  const { nextAvailableColor } = await import('../../setup-logic.js');
  const players = [{ color: '#d84545' }, { color: '#3878d8' }];
  const allColors = ['#d84545', '#3878d8', '#e07b00'];
  const next = nextAvailableColor(players, allColors, 2);
  expect(next).toBe('#e07b00');
});

test('nextAvailableColor returns first color when none used', async () => {
  const { nextAvailableColor } = await import('../../setup-logic.js');
  const players = [];
  const allColors = ['#d84545', '#3878d8'];
  expect(nextAvailableColor(players, allColors, 0)).toBe('#d84545');
});
