/**
 * Play Screen – Spiel- und Aufbauphase Rendering.
 */

import {
  PHASES,
  getPhase,
  getPlayers,
  getSetupStep,
  getCurrentSetupStep,
  advanceSetup,
  getSetupSequenceLength,
  startPlayPhase,
  advancePlayer,
  getCurrentPlayerIndex,
  getActionTime,
  getSetupTime,
} from './game-state.js';
import { resetTimer, addTime, pauseTimer } from './timer.js';
import { ROBBER_BONUS } from './config.js';

/* ── Screen refs ─────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const playScreen   = $('playScreen');
const setupScreen  = $('setupScreen');
const playerListEl = $('playerList');
const phaseBanner  = $('phaseBanner');
const nextBtn      = $('nextBtn');
const backBtn      = $('backBtn');
const robberBtn    = $('robberBtn');
const playStartBtn = $('playStartBtn');

/* ── Rendering ─────────────────────────────────────────────── */

export function renderPlayScreen() {
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
    const isPlacing2 = step.placementNumber === 2 && i === step.playerIndex;

    let badge = '';
    if (isActive) {
      badge = isPlacing2
        ? '<span class="placement-badge">2</span>'
        : '<span class="placement-badge">1</span>';
    }

    const borderStyle = p.border ? `border: 1px solid ${p.border}` : '';
    return `
      <div class="player-info ${isActive ? 'active' : ''} ${isPlacing2 ? 'placing-both' : ''}">
        <div class="color-dot" style="background:${p.color}; ${borderStyle}"></div>
        <span class="player-name">${p.name}</span>
        ${badge}
      </div>`;
  }).join('');

  const baseTime = getSetupTime();
  resetTimer(baseTime);
}

function renderPlayPhase() {
  const players    = getPlayers();
  const activeIdx  = getCurrentPlayerIndex();
  const actionTime = getActionTime();

  phaseBanner.textContent = 'Spielphase';

  playerListEl.innerHTML = players.map((p, i) => {
    const isActive    = i === activeIdx;
    const borderStyle = p.border ? `border: 1px solid ${p.border}` : '';
    return `
      <div class="player-info ${isActive ? 'active' : ''}">
        <div class="color-dot" style="background:${p.color}; ${borderStyle}"></div>
        <span class="player-name">${p.name}</span>
      </div>`;
  }).join('');

  resetTimer(actionTime);
}

/* ── Show Play Screen ───────────────────────────────────────── */

export function showPlayScreen() {
  pauseTimer();
  setupScreen.classList.remove('active');
  playScreen.classList.add('active');
  renderPlayScreen();
}



/* ── Event wiring (called by orchestrator) ─────────────────── */

export function wirePlayScreenEvents({ onBack }) {
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
    addTime(ROBBER_BONUS);
  });

  backBtn.addEventListener('click', () => {
    pauseTimer();
    playScreen.classList.remove('active');
    onBack();
  });
}
