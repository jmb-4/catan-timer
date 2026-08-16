import { test, expect } from '@playwright/test';

/**
 * Game-state.spec.ts — tests pure logic exported from game-state.js.
 * Integration tests (clicking through UI) live in play-screen.spec.ts.
 */

// Import once; state is module-level so tests run serially via test.describe.serial
const gs = await import('../../game-state.js');

test.describe.serial('game-state', () => {

  /* ── buildSequence (via game-state internal, tested via setup-logic) ─── */

  test('4 players: sequence has 8 steps', () => {
    // buildSequence is private — test via initGame + getSetupSequenceLength
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    expect(gs.getSetupSequenceLength()).toBe(8);
  });

  test('6 players: sequence has 12 steps', () => {
    gs.initGame(Array(6).fill({ name: '?', color: '#000' }), 60, 60);
    expect(gs.getSetupSequenceLength()).toBe(12);
  });

  /* ── initGame ─────────────────────────────────────────────────────────── */

  test('initGame sets phase to SETUP', () => {
    gs.initGame([{ name: 'P1', color: '#red' }], 60, 60);
    expect(gs.getPhase()).toBe(gs.PHASES.SETUP);
  });

  test('initGame stores player count', () => {
    gs.initGame([{ name: 'P1', color: '#red' }, { name: 'P2', color: '#blue' }], 60, 60);
    expect(gs.getPlayers()).toHaveLength(2);
  });

  test('initGame sets setupStep to 0', () => {
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    expect(gs.getSetupStep()).toBe(0);
  });

  /* ── Setup Step Progression ────────────────────────────────────────────── */

  test('getCurrentSetupStep: first step is player 0, placement 1, not doubleTime', () => {
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    const step = gs.getCurrentSetupStep();
    expect(step.playerIndex).toBe(0);
    expect(step.placementNumber).toBe(1);
    expect(step.doubleTime).toBe(false);
  });

  test('advanceSetup increments setupStep', () => {
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    gs.advanceSetup();
    expect(gs.getSetupStep()).toBe(1);
  });

  test('advanceSetup transitions to PLAY after last step', () => {
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    for (let i = 0; i < 8; i++) gs.advanceSetup();
    expect(gs.getPhase()).toBe(gs.PHASES.PLAY);
  });

  test('last setup step: player 0, placement 2, doubleTime', () => {
    gs.initGame(Array(4).fill({ name: '?', color: '#000' }), 60, 60);
    for (let i = 0; i < 7; i++) gs.advanceSetup();
    const step = gs.getCurrentSetupStep();
    expect(step.playerIndex).toBe(0);
    expect(step.placementNumber).toBe(2);
    expect(step.doubleTime).toBe(true);
  });

  /* ── Play Phase ────────────────────────────────────────────────────────── */

  test('startPlayPhase sets phase to PLAY', () => {
    gs.initGame([{ name: 'P1', color: '#red' }], 60, 60);
    gs.startPlayPhase();
    expect(gs.getPhase()).toBe(gs.PHASES.PLAY);
  });

  test('advancePlayer cycles through all players', () => {
    gs.initGame(Array(3).fill({ name: '?', color: '#000' }), 60, 60);
    gs.startPlayPhase();
    expect(gs.getCurrentPlayerIndex()).toBe(0);
    gs.advancePlayer();
    expect(gs.getCurrentPlayerIndex()).toBe(1);
    gs.advancePlayer();
    expect(gs.getCurrentPlayerIndex()).toBe(2);
    gs.advancePlayer();
    expect(gs.getCurrentPlayerIndex()).toBe(0); // wraps
  });

  test('getSetupTime and getActionTime return correct values', () => {
    gs.initGame([{ name: 'P1', color: '#red' }], 45, 90);
    expect(gs.getSetupTime()).toBe(45);
    expect(gs.getActionTime()).toBe(90);
  });
});
