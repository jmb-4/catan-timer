import { test, expect } from '@playwright/test';

/* ── Setup Screen – Render ──────────────────────────────────────────────── */

test('setup: renders heading', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('#setupScreen h1')).toHaveText('Catan Timer');
});

test('setup: shows player count select with 5 options', async ({ page }) => {
  await page.goto('/party-timer.html');
  const options = page.locator('#playerCount option');
  await expect(options).toHaveCount(5);
});

test('setup: shows setup time input with default 60', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('#setupTime')).toHaveValue('60');
});

test('setup: shows action time input with default 60', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('#actionTime')).toHaveValue('60');
});

test('setup: shows start button', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('#startBtn')).toBeVisible();
});

/* ── Player Color Rows ──────────────────────────────────────────────────── */

test('setup: default 6 color rows shown', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('.player-color-row')).toHaveCount(6);
});

test('setup: changing to 2 players shows 2 color rows', async ({ page }) => {
  await page.goto('/party-timer.html');
  await page.locator('#playerCount').selectOption('2');
  await expect(page.locator('.player-color-row')).toHaveCount(2);
});

test('setup: each color row has a label and a select', async ({ page }) => {
  await page.goto('/party-timer.html');
  await page.locator('#playerCount').selectOption('2');
  const first = page.locator('.player-color-row').first();
  await expect(first.locator('span')).toContainText('Spieler 1');
  await expect(first.locator('select')).toBeVisible();
});

/* ── Navigation ────────────────────────────────────────────────────────── */

test('setup: start button navigates to play screen', async ({ page }) => {
  await page.goto('/party-timer.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#playScreen')).toHaveClass(/active/);
  await expect(page.locator('#setupScreen')).not.toHaveClass(/active/);
});

test('setup: start button is enabled by default', async ({ page }) => {
  await page.goto('/party-timer.html');
  await expect(page.locator('#startBtn')).toBeEnabled();
});
