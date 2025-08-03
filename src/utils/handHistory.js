export const STREET_ORDER = ['PREFLOP', 'FLOP', 'TURN', 'RIVER'];

export function splitActionsByStreet(history = {}) {
  const groups = {};
  STREET_ORDER.forEach(s => { groups[s] = []; });
  (history.actions || []).forEach(act => {
    const s = (act.street || 'PREFLOP').toUpperCase();
    if (!groups[s]) groups[s] = [];
    groups[s].push(act);
  });
  return groups;
}
