/**
 * Catan Timer – Haupteinstiegspunkt (Orchestrator).
 *
 * Importiert Setup- und Play-Screen-Module und verdrahtet
 * die globalen Event Listener.
 */

import { initGame } from './game-state.js';
import { toggleTimer, resetAll } from './timer.js';
import {
  renderColorRows,
  wireSetupScreenEvents,
  showSetupScreen,
} from './setup-screen.js';
import {
  showPlayScreen,
  wirePlayScreenEvents,
} from './play-screen.js';

const $ = id => document.getElementById(id);
const playStartBtn = $('playStartBtn');

/* ── Init ─────────────────────────────────────────────────── */

renderColorRows();

wireSetupScreenEvents({
  onStart: (players, setupTime, actionTime) => {
    initGame(players, setupTime, actionTime);
    showPlayScreen();
  },
});

wirePlayScreenEvents({
  onBack: () => {
    resetAll();
    showSetupScreen();
    renderColorRows();
  },
});

playStartBtn.addEventListener('click', () => {
  toggleTimer();
});
