import { test, expect } from '@playwright/test';
import { initGame, PHASES } from '../../party-timer/game-state.js';

/* ── Init & Phases ──────────────────────────────────────────────────────── */

test('initGame sets phase to SETUP', () => {
  initGame([{ name: 'P1', color: '#red' }], 60, 60);
  const { getPhase } = require('../../party-timer/game-state.js');
  expect(getPhase()).toBe(PHASES.SETUP);
});

test('initGame stores player count', () => {
  initGame([{ name: 'P1', color: '#red' }], 60, 60);
  const { getPlayers } = require('../../party-timer/game-state.js');
  expect(getPlayers()).toHaveLength(1);
});

test('initGame stores all players', () => {
  const players = [
    { name: 'P1', color: '#red' },
    { name: 'P2', color: '#blue' },
  ];
  initGame(players, 60, 60);
  const { getPlayers } = require('../../party-timer/game-state.js');
  expect(getPlayers()).toHaveLength(2);
});

/* ── Setup Sequence ─────────────────────────────────────────────────────── */

test('initGame builds 8-step sequence for 4 players', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { getSetupSequenceLength } = require('../../party-timer/game-state.js');
  expect(getSetupSequenceLength()).toBe(8);
});

test('initGame builds 12-step sequence for 6 players', () => {
  initGame(Array(6).fill({ name: '?', color: '#000' }), 60, 60);
  const { getSetupSequenceLength } = require('../../party-timer/game-state.js');
  expect(getSetupSequenceLength()).toBe(12);
});

test('initGame sets setupStep to 0', () => {
  initGame([{ name: 'P1', color: '#red' }], 60, 60);
  const { getSetupStep } = require('../../party-timer/game-state.js');
  expect(getSetupStep()).toBe(0);
});

test('advanceSetup increments setupStep', () => {
  initGame([{ name: 'P1', color: '#red' }], 60, 60);
  const { advanceSetup, getSetupStep } = require('../../party-timer/game-state.js');
  advanceSetup();
  expect(getSetupStep()).toBe(1);
});

test('advanceSetup transitions to PLAY after last step (4 players)', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { advanceSetup, getPhase } = require('../../party-timer/game-state.js');
  for (let i = 0; i < 7; i++) advanceSetup();
  expect(getPhase()).toBe(PHASES.PLAY);
});

/* ── Current Setup Step ─────────────────────────────────────────────────── */

test('getCurrentSetupStep returns step 0 first', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { getCurrentSetupStep } = require('../../party-timer/game-state.js');
  const step = getCurrentSetupStep();
  expect(step.playerIndex).toBe(0);
  expect(step.placementNumber).toBe(1);
  expect(step.doubleTime).toBe(false);
});

test('getCurrentSetupStep last step is player 0 with doubleTime', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { advanceSetup, getCurrentSetupStep } = require('../../party-timer/game-state.js');
  for (let i = 0; i < 7; i++) advanceSetup();
  const step = getCurrentSetupStep();
  expect(step.playerIndex).toBe(0);
  expect(step.doubleTime).toBe(true);
  expect(step.placementNumber).toBe(2);
});

/* ── isSetupDoubleTime ─────────────────────────────────────────────────── */

test('isSetupDoubleTime is false for forward steps', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { isSetupDoubleTime } = require('../../party-timer/game-state.js');
  expect(isSetupDoubleTime()).toBe(false);
});

test('isSetupDoubleTime is true for backward steps', () => {
  initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
  const { advanceSetup, isSetupDoubleTime } = require('../../party-timer/game-state.js');
  advanceSetup(); advanceSetup(); advanceSetup(); // step 3 = player 3 forward
  expect(isSetupDoubleTime()).toBe(true);
});

/* ── Play Phase ─────────────────────────────────────────────────────────── */

test('startPlayPhase sets phase to PLAY', () => {
  initGame([{ name: 'P1', color: '#red' }], 60, 60);
  const { startPlayPhase, getPhase } = require('../../party-timer/game-state.js');
  startPlayPhase();
  expect(getPhase()).toBe(PHASES.PLAY);
});

test('advancePlayer cycles through all players', () => {
  initGame(Array(3).fill({ name: '?', color: '#000' }), 60, 60);
  const { advancePlayer, getCurrentPlayerIndex } = require('../../party-timer/game-state.js');
  expect(getCurrentPlayerIndex()).toBe(0);
  advancePlayer(); expect(getCurrentPlayerIndex()).toBe(1);
  advancePlayer(); expect(getCurrentPlayerIndex()).toBe(2);
  advancePlayer(); expect(getCurrentPlayerIndex()).toBe(0); // wraps
});
