// src/utils/pokerThresholds.js
// Central location for all numerical cut-offs that define “low / target / high”
// bands for common No-Limit Hold’em statistics.  Based on widely published
// population data for 6-max cash games and standard coaching materials.
//
// Each array is ascending; we’ll classify a value by comparing it against these
// break-points.  Example for vpip: [15, 28, 40, 50] →
//   <15     => bucket 0 (Very low / Nit)
//   15-28   => bucket 1 (Target)
//   28-40   => bucket 2 (Loose-Medium)
//   40-50   => bucket 3 (Loose-High)
//   >50     => bucket 4 (Maniac)

export const thresholds = {
  vpip:       [15, 28, 40, 50],
  pfr:        [10, 22, 30],
  vpipPfr:    [2.2, 3.5],
  threeBet:   [0.04, 0.10],      // proportion not %
  foldVs3bet: [0.55, 0.70],      // proportion
  fourBet:    [0.02, 0.06],
  foldVs4bet: [0.60, 0.75],
  cbetFlop:   [0.40, 0.70],
  cbetTurn:   [0.35, 0.60],
  foldVsCbet: [0.45, 0.70],
  af:         [1.0, 3.5],        // Aggression Factor
  wtsd:       [0.18, 0.32],
  wsd:        [0.42, 0.54],
  wwsf:       [0.42, 0.55],
  bbDefend:   [0.20, 0.50],
  openLimp:   [0.08],
};

// Converts a value + threshold array to a severity string.
// direction = 'high'  – bigger is worse (e.g., VPIP too high)
//             'low'   – smaller is worse (e.g., Aggression Factor too low)
//             'twoSided' – middle band is target, extremes are leaks
export function classify(value = 0, cuts = [], direction = 'twoSided') {
  if (value === null || value === undefined || isNaN(value)) return { bucket: -1, severity: 'Unknown' };

  const idx = cuts.findIndex(c => value < c);
  const bucket = idx === -1 ? cuts.length : idx; // 0-based bucket index

  let severity = 'Low';
  if (direction === 'twoSided') {
    if (bucket === 0 || bucket === cuts.length) severity = 'High'; // extreme
    else if (bucket === 1 || bucket === cuts.length - 1) severity = 'Medium';
    else severity = 'Low'; // within target band(s)
  } else if (direction === 'high') {
    if (bucket >= cuts.length) severity = 'High';
    else if (bucket >= cuts.length - 1) severity = 'Medium';
    else severity = 'Low';
  } else { // 'low'
    if (bucket === 0) severity = 'High';
    else if (bucket === 1) severity = 'Medium';
    else severity = 'Low';
  }

  return { bucket, severity };
}
