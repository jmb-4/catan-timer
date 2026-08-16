/**
 * GameState – zentraler State für das Spiel.
 */

export const PHASES = {
  SETUP: 'setup',
  PLAY:  'play',
};

let state = {
  phase:              PHASES.SETUP,
  players:            [],
  playerCount:        4,
  setupTime:          60,
  actionTime:         60,
  setupSequence:      [],
  setupStep:          0,
  currentPlayerIndex: 0,
};

export function initGame(players, setupTime, actionTime) {
  state.players       = players;
  state.playerCount   = players.length;
  state.setupTime     = setupTime;
  state.actionTime    = actionTime;
  state.phase        = PHASES.SETUP;
  state.setupStep     = 0;
  state.currentPlayerIndex = 0;
  state.setupSequence = buildSequence(players.length);
}

export function getPhase()              { return state.phase; }
export function getPlayers()            { return state.players; }
export function getSetupStep()           { return state.setupStep; }
export function getCurrentPlayerIndex() { return state.currentPlayerIndex; }
export function getSetupTime()          { return state.setupTime; }
export function getActionTime()         { return state.actionTime; }
export function getPlayerCount()        { return state.playerCount; }

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
