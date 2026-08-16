/**
 * Setup – Aufbauphasen-Logik.
 *
 * Die Platzierungsreihenfolge folgt dem Catan-Standard:
 *   Hin:  P1 → P2 → … → Pn
 *   Zurück: Pn → … → P1
 *
 * Beispiel 4 Spieler:
 *   P1(1) → P2(1) → P3(1) → P4(1) → P4(2) → P3(2) → P2(2) → P1(2)
 *
 * Jeder Eintrag in der Sequence ist:
 *   { playerIndex, placementNumber }
 */

export function buildSetupSequence(playerCount) {
  const forward   = range(0, playerCount, 1);    // [0, 1, …, n-1]
  const backward = range(playerCount - 1, -1, -1); // [n-1, …, 0]

  const forwardSteps  = forward.map(i => ({ playerIndex: i, placementNumber: 1 }));
  const backwardSteps = backward.map(i => ({ playerIndex: i, placementNumber: 2 }));

  return [...forwardSteps, ...backwardSteps];
}

function range(start, end, step) {
  const result = [];
  for (let i = start; (step > 0 ? i < end : i > end); i += step) result.push(i);
  return result;
}
