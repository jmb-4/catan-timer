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
  getCurrentSetupStep,
  isSetupDoubleTime,
  advanceSetup,
  getSetupSequenceLength,
  startPlayPhase,
  advancePlayer,
} from './game-state.js';
import { resetTimer, addTime, getTimeLeft } from './timer.js';

/* ── Screen refs ─────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const setupScreen  = $('setupScreen');
const playScreen   = $('playScreen');
const playerCount  = $('playerCount');
const colorList    = $('playerColorList');
const setupTimeEl  = $('setupTime');
const actionTimeEl = $('actionTime');
const startBtn     = $('startBtn');
const playerListEl = $('playerList');
const phaseBanner   = $('phaseBanner');
const nextBtn      = $('nextBtn');
const backBtn      = $('backBtn');
const robberBtn    = $('robberBtn');
const playStartBtn = $('playStartBtn');

/* ── Setup Screen ────────────────────────────────────────── */

function renderColorRows() {
  const count = parseInt(playerCount.value, 10);
  const players = getPlayers();
  colorList.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const existing = players[i]?.color ?? nextAvailableColor(players, PLAYER_COLORS.map(c => c.value), i);
    const row = document.createElement('div');
    row.className = 'player-color-row';
    row.innerHTML = `
      <span>Spieler ${i + 1}</span>
      <select class="player-color" data-index="${i}">
        ${PLAYER_COLORS.map(c => {
          const used = players.slice(0, i).map(p => p.color);
          const disabled = used.includes(c.value) ? 'disabled' : '';
          return `<option value="${c.value}" ${c.value === existing ? 'selected' : ''} ${disabled}>${c.name}</option>`;
        }).join('')}
      </select>
    `;
    colorList.appendChild(row);
  }
}

function getPlayersFromDOM() {
  const count = parseInt(playerCount.value, 10);
  return Array.from(colorList.querySelectorAll('.player-color')).map((sel, i) => ({
    name:  `Spieler ${i + 1}`,
    color: sel.value,
  }));
}

playerCount.addEventListener('change', () => {
  renderColorRows();
});

startBtn.addEventListener('click', () => {
  const players     = getPlayersFromDOM();
  const setupTime   = parseInt(setupTimeEl.value, 10) || DEFAULT_SETUP_TIME;
  const actionTime = parseInt(actionTimeEl.value, 10) || DEFAULT_ACTION_TIME;

  initGame(players, setupTime, actionTime);
  showPlayScreen();
});

/* ── Play Screen ─────────────────────────────────────────── */

function showPlayScreen() {
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
  const players    = getPlayers();
  const step       = getCurrentSetupStep();
  if (!step) return;

  phaseBanner.textContent = `Aufbauphase – Schritt ${step.setupStep + 1} von ${getSetupSequenceLength()}`;

  playerListEl.innerHTML = players.map((p, i) => {
    const isActive   = i === step.playerIndex;
    const isPlacing2 = step.doubleTime && i === step.playerIndex;

    let badge = '';
    if (isActive) {
      badge = isPlacing2
        ? '<span class="placement-badge">2×</span>'
        : '<span class="placement-badge">1×</span>';
    }

    return `
      <div class="player-info ${isActive ? 'active' : ''} ${isPlacing2 ? 'placing-both' : ''}">
        <div class="color-dot" style="background:${p.color}; ${p.color === '#f4f3ef' ? 'border:1px solid #ccc' : ''}"></div>
        <span class="player-name">${p.name}</span>
        ${badge}
      </div>`;
  }).join('');

  const time = isSetupDoubleTime() ? step.setupTime * 2 : step.setupTime;
  resetTimer(time);
  nextBtn.textContent = step.doubleTime ? 'Nächster Spieler' : 'Weiter';
}

function renderPlayPhase() {
  const players = getPlayers();

  phaseBanner.textContent = 'Spielphase';
  playerListEl.innerHTML = players.map((p, i) => {
    const { getCurrentPlayerIndex } = await import('./game-state.js');
    const isActive = i === getCurrentPlayerIndex();
    return `
      <div class="player-info ${isActive ? 'active' : ''}">
        <div class="color-dot" style="background:${p.color}; ${p.color === '#f4f3ef' ? 'border:1px solid #ccc' : ''}"></div>
        <span class="player-name">${p.name}</span>
      </div>`;
  }).join('');

  // Import dynamically to avoid circular
  const { getCurrentPlayerIndex } = await import('./game-state.js');
  const time = getCurrentPlayerIndex() === 0 ? 0 : 0; // placeholder
  resetTimer(60); // TODO
}

nextBtn.addEventListener('click', () => {
  if (getPhase() === PHASES.SETUP) {
    advanceSetup();
    renderPlayScreen();
  } else {
    advancePlayer();
    renderPlayScreen();
    // TODO: reset timer
  }
});

robberBtn.addEventListener('click', () => {
  addTime(15);
});

backBtn.addEventListener('click', () => {
  playScreen.classList.remove('active');
  setupScreen.classList.add('active');
  renderColorRows();
});

playStartBtn.addEventListener('click', () => {
  import('./timer.js').then(({ toggleTimer }) => toggleTimer());
});

/* ── Init ─────────────────────────────────────────────────── */

renderColorRows();
