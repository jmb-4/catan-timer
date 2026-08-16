/**
 * Setup Screen – Spieler-Konfiguration und Farbauswahl.
 */

import { PLAYER_COLORS, DEFAULT_SETUP_TIME, DEFAULT_ACTION_TIME } from './config.js';
import { getPlayers, getSetupStep } from './game-state.js';
import { resetAll as resetTimerAll } from './timer.js';

/* ── Screen refs ─────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const setupScreen  = $('setupScreen');
const playerCount  = $('playerCount');
const colorList    = $('playerColorList');
const setupTimeEl  = $('setupTime');
const actionTimeEl = $('actionTime');
const startBtn     = $('startBtn');

/* ── Rendering ─────────────────────────────────────────────── */

export function renderColorRows() {
  const count = parseInt(playerCount.value, 10);
  const players = getPlayers();
  colorList.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const existing = players[i]?.color ?? PLAYER_COLORS.map(c => c.value).find(
      c => !players.slice(0, i).map(p => p.color).includes(c)
    );
    const usedColors = players.slice(0, i).map(p => p.color);

    const row = document.createElement('div');
    row.className = 'player-color-row';
    row.innerHTML = `
      <span>Spieler ${i + 1}</span>
      <select class="player-color" data-index="${i}">
        ${PLAYER_COLORS.map(c => {
          const disabled = usedColors.includes(c.value) ? 'disabled' : '';
          const selected = c.value === existing ? 'selected' : '';
          return `<option value="${c.value}" ${selected} ${disabled}>${c.name}</option>`;
        }).join('')}
      </select>
    `;
    colorList.appendChild(row);
  }
}

export function getPlayersFromDOM() {
  const count = parseInt(playerCount.value, 10);
  const rows = colorList.querySelectorAll('.player-color-row');
  return Array.from(rows).map((row, i) => {
    const colorVal = row.querySelector('.player-color').value;
    const colorDef = PLAYER_COLORS.find(c => c.value === colorVal);
    return {
      name:  `Spieler ${i + 1}`,
      color: colorVal,
      border: colorDef?.border ?? null,
    };
  });
}

/* ── Show Setup Screen ─────────────────────────────────────── */

export function showSetupScreen() {
  resetTimerAll();
  setupScreen.classList.add('active');
}

/* ── Event wiring (called by orchestrator) ─────────────────── */

export function wireSetupScreenEvents({ onStart }) {
  playerCount.addEventListener('change', () => {
    renderColorRows();
  });

  startBtn.addEventListener('click', () => {
    const players    = getPlayersFromDOM();
    const setupTime  = parseInt(setupTimeEl.value, 10) || DEFAULT_SETUP_TIME;
    const actionTime = parseInt(actionTimeEl.value, 10) || DEFAULT_ACTION_TIME;
    onStart(players, setupTime, actionTime);
  });
}
