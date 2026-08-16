/**
 * Setup – Aufbauphasen-Logik.
 *
 * Die Platzierungsreihenfolge folgt dem Catan-Standard:
 *   Hin:  P1 → P2 → … → Pn
 *   Zurück: Pn (doppelte Zeit, 2 Siedlungen) → … → P1 (doppelte Zeit, 2 Siedlungen)
 *
 * Beispiel 4 Spieler:
 *   P1(1) → P2(1) → P3(1) → P4(2x) → P3(2x) → P2(2x) → P1(2x)
 *
 * Jeder Eintrag in der Sequence ist:
 *   { playerIndex, placementNumber, setupTime, doubleTime }
 */

export function buildSetupSequence(playerCount) {
  const forward  = range(0, playerCount);                   // [0, 1, …, n-1]
  const backward = range(playerCount - 1, -1);              // [n-1, n-2, …, 0]

  const forwardSteps  = forward.map(i => makeStep(i, 1, false));
  const backwardSteps = backward.map(i => makeStep(i, 2, true));

  return [...forwardSteps, ...backwardSteps];
}

function makeStep(playerIndex, placementNumber, doubleTime) {
  return { playerIndex, placementNumber, doubleTime };
}

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) result.push(i);
  return result;
}

/** Alle Farben, die schon vergeben sind */
export function usedColors(players, upToIndex) {
  return players.slice(0, upToIndex).map(p => p.color);
}

/** Nächste freie Farbe, die noch nicht vergeben ist */
export function nextAvailableColor(players, colors, upToIndex) {
  const used = usedColors(players, upToIndex);
  return colors.find(c => !used.includes(c)) ?? colors[0];
}
