/**
 * GameState – zentraler State für das Spiel.
 */

export const PHASES = {
  SETUP: 'setup',
  PLAY:  'play',
};

export const PLAYER_STATES = {
  WAITING:    'waiting',
  ACTIVE:     'active',
  PLACING_2:  'placing-2', // letzter Spieler setzt 2 Siedlungen
};

let state = {
  phase:              PHASES.SETUP,
  players:            [],         // [{ name, color }]
  playerCount:        4,
  setupTime:          60,
  actionTime:         60,
  // Setup
  setupSequence:      [],        // [{ playerIndex, placementNumber, doubleTime }]
  setupStep:          0,         // Index in setupSequence
  // Play
  currentPlayerIndex: 0,         // 0-based im Play
};

export function initGame(players, setupTime, actionTime) {
  const playerCount = players.length;
  state.players      = players;
  state.setupTime    = setupTime;
  state.actionTime   = actionTime;
  state.playerCount  = playerCount;
  state.phase        = PHASES.SETUP;
  state.setupStep    = 0;
  state.currentPlayerIndex = 0;

  // Setup-Sequence berechnen
  state.setupSequence = buildSequence(playerCount);
}

export function getPhase()         { return state.phase; }
export function getPlayers()      { return state.players; }
export function getSetupStep()    { return state.setupStep; }
export function getCurrentPlayerIndex() { return state.currentPlayerIndex; }

export function getCurrentSetupStep() {
  return state.setupSequence[state.setupStep] ?? null;
}

export function isSetupDoubleTime() {
  const step = getCurrentSetupStep();
  return step ? step.doubleTime : false;
}

export function advanceSetup() {
  state.setupStep++;
  if (state.setupStep >= state.setupSequence.length) {
    startPlayPhase();
  }
}

export function startPlayPhase() {
  state.phase = PHASES.PLAY;
  state.currentPlayerIndex = 0;
}

export function advancePlayer() {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.playerCount;
}

export function getSetupSequenceLength() {
  return state.setupSequence.length;
}

function buildSequence(playerCount) {
  const forward  = Array.from({ length: playerCount }, (_, i) => i);
  const backward = [...forward].reverse();

  return [
    ...forward.map(i => ({ playerIndex: i, placementNumber: 1, doubleTime: false })),
    ...backward.map(i => ({ playerIndex: i, placementNumber: 2, doubleTime: true  })),
  ];
}
