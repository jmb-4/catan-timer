/**
 * Catan Timer – Haupteinstiegspunkt.
 *
 * Liest die Setup-Screen-Inputs und orchestriert den Wechsel
 * zwischen Setup-Screen und Play-Screen.
 */

import { PLAYER_COLORS, DEFAULT_SETUP_TIME, DEFAULT_ACTION_TIME } from './config.js';
import { nextAvailableColor } from './setup-logic.js';
import {
  initGame,
  PHASES,
  getPhase,
  getPlayers,
  getSetupStep,
  getCurrentSetupStep,
  isSetupDoubleTime,
  advanceSetup,
  getSetupSequenceLength,
  startPlayPhase,
  advancePlayer,
  getCurrentPlayerIndex,
  getActionTime,
  getSetupTime,
} from './game-state.js';
import { resetTimer, addTime, startTimer, pauseTimer, toggleTimer, getTimeLeft } from './timer.js';

/* ── Screen refs ─────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const setupScreen   = $('setupScreen');
const playScreen    = $('playScreen');
const playerCount   = $('playerCount');
const colorList     = $('playerColorList');
const setupTimeEl   = $('setupTime');
const actionTimeEl  = $('actionTime');
const startBtn      = $('startBtn');
const playerListEl  = $('playerList');
const phaseBanner   = $('phaseBanner');
const nextBtn       = $('nextBtn');
const backBtn       = $('backBtn');
const robberBtn     = $('robberBtn');
const playStartBtn  = $('playStartBtn');

/* ── Setup Screen ────────────────────────────────────────── */

function renderColorRows() {
  const count = parseInt(playerCount.value, 10);
  const players = getPlayers();
  colorList.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const existing = players[i]?.color ?? nextAvailableColor(players, PLAYER_COLORS.map(c => c.value), i);
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

function getPlayersFromDOM() {
  const count = parseInt(playerCount.value, 10);
  const rows = colorList.querySelectorAll('.player-color-row');
  return Array.from(rows).map((row, i) => ({
    name:  `Spieler ${i + 1}`,
    color: row.querySelector('.player-color').value,
  }));
}

playerCount.addEventListener('change', () => {
  renderColorRows();
});

startBtn.addEventListener('click', () => {
  const players    = getPlayersFromDOM();
  const setupTime  = parseInt(setupTimeEl.value, 10) || DEFAULT_SETUP_TIME;
  const actionTime = parseInt(actionTimeEl.value, 10) || DEFAULT_ACTION_TIME;

  initGame(players, setupTime, actionTime);
  showPlayScreen();
});

/* ── Play Screen ─────────────────────────────────────────── */

function showPlayScreen() {
  pauseTimer();
  setupScreen.classList.remove('active');
  playScreen.classList.add('active');
  renderPlayScreen();
}

function renderPlayScreen() {
  const phase = getPhase();

  if (phase === PHASES.SETUP) {
    renderSetupPhase();
  } else {
    renderPlayPhase();
  }
}

function renderSetupPhase() {
  const players = getPlayers();
  const step    = getCurrentSetupStep();
  if (!step) return;

  phaseBanner.textContent = `Aufbauphase – Schritt ${getSetupStep() + 1} von ${getSetupSequenceLength()}`;

  playerListEl.innerHTML = players.map((p, i) => {
    const isActive   = i === step.playerIndex;
    const isPlacing2 = step.doubleTime && i === step.playerIndex;

    let badge = '';
    if (isActive) {
      badge = isPlacing2
        ? '<span class="placement-badge">2×</span>'
        : '<span class="placement-badge">1×</span>';
    }

    const borderStyle = p.color === '#f4f3ef' ? 'border: 1px solid #ccc' : '';
    return `
      <div class="player-info ${isActive ? 'active' : ''} ${isPlacing2 ? 'placing-both' : ''}">
        <div class="color-dot" style="background:${p.color}; ${borderStyle}"></div>
        <span class="player-name">${p.name}</span>
        ${badge}
      </div>`;
  }).join('');

  const baseTime = getSetupTime();
  const time     = step.doubleTime ? baseTime * 2 : baseTime;
  resetTimer(time);
}

function renderPlayPhase() {
  const players    = getPlayers();
  const activeIdx  = getCurrentPlayerIndex();
  const actionTime = getActionTime();

  phaseBanner.textContent = 'Spielphase';

  playerListEl.innerHTML = players.map((p, i) => {
    const isActive   = i === activeIdx;
    const borderStyle = p.color === '#f4f3ef' ? 'border: 1px solid #ccc' : '';
    return `
      <div class="player-info ${isActive ? 'active' : ''}">
        <div class="color-dot" style="background:${p.color}; ${borderStyle}"></div>
        <span class="player-name">${p.name}</span>
      </div>`;
  }).join('');

  resetTimer(actionTime);
}

nextBtn.addEventListener('click', () => {
  pauseTimer();
  if (getPhase() === PHASES.SETUP) {
    advanceSetup();
    renderPlayScreen();
  } else {
    advancePlayer();
    renderPlayScreen();
  }
});

robberBtn.addEventListener('click', () => {
  addTime(15);
});

backBtn.addEventListener('click', () => {
  pauseTimer();
  playScreen.classList.remove('active');
  setupScreen.classList.add('active');
  renderColorRows();
});

playStartBtn.addEventListener('click', () => {
  toggleTimer();
});

/* ── Init ─────────────────────────────────────────────────── */

renderColorRows();
