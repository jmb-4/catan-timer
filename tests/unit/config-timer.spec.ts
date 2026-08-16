import { test, expect } from '@playwright/test';

/* ── Config ──────────────────────────────────────────────────────────────── */

test('config exports PLAYER_COLORS with at least 6 colors', async () => {
  const { PLAYER_COLORS } = await import('../../party-timer/config.js');
  expect(PLAYER_COLORS.length).toBeGreaterThanOrEqual(6);
});

test('config exports DEFAULT_SETUP_TIME and DEFAULT_ACTION_TIME', async () => {
  const mod = await import('../../party-timer/config.js');
  expect(mod.DEFAULT_SETUP_TIME).toBe(60);
  expect(mod.DEFAULT_ACTION_TIME).toBe(60);
});

test('config exports ROBBER_BONUS = 15', async () => {
  const { ROBBER_BONUS } = await import('../../party-timer/config.js');
  expect(ROBBER_BONUS).toBe(15);
});

/* ── Timer Logic ─────────────────────────────────────────────────────────── */

test('formatTime returns string number for positive', async () => {
  const { formatTime } = await import('../../party-timer/timer-logic.js');
  expect(formatTime(30)).toBe('30');
  expect(formatTime(1)).toBe('1');
});

test('formatTime returns "Zeit abgelaufen" for zero', async () => {
  const { formatTime } = await import('../../party-timer/timer-logic.js');
  expect(formatTime(0)).toBe('Zeit abgelaufen');
});

test('calcPercent returns 100 when full', async () => {
  const { calcPercent } = await import('../../party-timer/timer-logic.js');
  expect(calcPercent(60, 60)).toBe(100);
});

test('calcPercent returns 50 when half', async () => {
  const { calcPercent } = await import('../../party-timer/timer-logic.js');
  expect(calcPercent(30, 60)).toBe(50);
});

test('calcPercent clamps to 0..100', async () => {
  const { calcPercent } = await import('../../party-timer/timer-logic.js');
  expect(calcPercent(70, 60)).toBe(100);
  expect(calcPercent(-10, 60)).toBe(0);
});

test('isLow returns true when ≤ 10', async () => {
  const { isLow } = await import('../../party-timer/timer-logic.js');
  expect(isLow(10)).toBe(true);
  expect(isLow(5)).toBe(true);
  expect(isLow(11)).toBe(false);
});

/* ── Timer Module ──────────────────────────────────────────────────────── */

test('resetTimer sets timeLeft to given value', async ({ page }) => {
  await page.goto('party-timer.html');
  await page.evaluate(() => {
    const { resetTimer } = await import('./timer.js');
    resetTimer(45);
  });
  await expect(page.locator('#timer')).toHaveText('45');
});

test('addTime increases timeLeft', async ({ page }) => {
  await page.goto('party-timer.html');
  await page.evaluate(async () => {
    const { resetTimer, addTime } = await import('./timer.js');
    resetTimer(10);
    addTime(15);
  });
  await expect(page.locator('#timer')).toHaveText('25');
});
