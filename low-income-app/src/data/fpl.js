// 2025 Federal Poverty Level Guidelines
// Source: https://aspe.hhs.gov/poverty-guidelines
// Updated annually, typically in January

const FPL_BASE = {
  contiguous: { base: 15650, perAdditional: 5550 },
  alaska: { base: 19560, perAdditional: 6940 },
  hawaii: { base: 18000, perAdditional: 6390 },
};

const ALASKA = 'AK';
const HAWAII = 'HI';

export function getFPL(householdSize, state) {
  let region = 'contiguous';
  if (state === ALASKA) region = 'alaska';
  if (state === HAWAII) region = 'hawaii';

  const { base, perAdditional } = FPL_BASE[region];

  if (householdSize <= 1) return base;
  return base + (householdSize - 1) * perAdditional;
}

export function getPercentFPL(annualIncome, householdSize, state) {
  const fpl = getFPL(householdSize, state);
  return (annualIncome / fpl) * 100;
}

export function getIncomeAtPercent(percent, householdSize, state) {
  const fpl = getFPL(householdSize, state);
  return Math.round((fpl * percent) / 100);
}
