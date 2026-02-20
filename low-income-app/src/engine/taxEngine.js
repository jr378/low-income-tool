import { TAX_CREDITS } from '../data/taxCredits';

/**
 * Checks eligibility for tax credits based on user answers.
 *
 * @param {Object} answers
 * @param {number} answers.annualIncome - Earned income
 * @param {string} answers.filingStatus - 'single', 'married', 'hoh' (head of household)
 * @param {number} answers.numChildren - Number of qualifying children
 * @param {number} answers.childrenUnder17 - Number of children under 17
 * @param {number} answers.age - Age of primary filer
 * @param {boolean} answers.isStudent - Full-time student?
 * @param {boolean} answers.contributesToRetirement - Contributes to 401k/IRA?
 * @param {boolean} answers.isEnrolledInCollege - Enrolled at least half-time in college?
 * @param {boolean} answers.isEmployed - Has earned income?
 *
 * @returns {Array} Array of { credit, status, estimatedAmount, reasonKey, reasonParams }
 */
export function checkAllTaxCredits(answers) {
  const {
    annualIncome,
    filingStatus,
    numChildren,
    childrenUnder17,
    age,
    isStudent,
    contributesToRetirement,
    isEnrolledInCollege,
    isEmployed,
  } = answers;

  const results = [];
  const isMarried = filingStatus === 'married';

  // EITC
  {
    const credit = TAX_CREDITS.find(c => c.id === 'eitc');
    if (!credit) throw new Error('EITC credit definition missing from TAX_CREDITS');
    const tierIndex = Math.min(numChildren, 3);
    const tier = credit.tiers[tierIndex];
    const incomeLimit = isMarried ? tier.incomeLimitMarried : tier.incomeLimitSingle;

    if (!isEmployed) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.eitc_no_employment' });
    } else if (annualIncome <= incomeLimit) {
      // Estimate the credit amount (simplified — real calculation uses earned income tables)
      const ratio = 1 - (annualIncome / incomeLimit);
      const estimated = Math.round(tier.maxCredit * Math.min(ratio * 2, 1));
      results.push({ credit, status: 'eligible', estimatedAmount: estimated, reasonKey: 'reasons.eitc_eligible', reasonParams: { count: numChildren } });
    } else {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.eitc_unlikely' });
    }
  }

  // CTC
  {
    const credit = TAX_CREDITS.find(c => c.id === 'ctc');
    if (!credit) throw new Error('CTC credit definition missing from TAX_CREDITS');
    if (childrenUnder17 > 0) {
      const phaseOut = isMarried ? credit.phaseOutMarried : credit.phaseOutSingle;
      if (annualIncome <= phaseOut) {
        const estimated = childrenUnder17 * credit.perChild;
        results.push({ credit, status: 'eligible', estimatedAmount: estimated, reasonKey: 'reasons.ctc_eligible', reasonParams: { amount: credit.perChild.toLocaleString() } });
      } else {
        const reduction = Math.floor((annualIncome - phaseOut) / 1000) * 50;
        const full = childrenUnder17 * credit.perChild;
        const remaining = Math.max(full - reduction, 0);
        if (remaining > 0) {
          results.push({ credit, status: 'eligible', estimatedAmount: remaining, reasonKey: 'reasons.ctc_phaseout' });
        } else {
          results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.ctc_unlikely_income' });
        }
      }
    } else {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.ctc_unlikely_nochildren' });
    }
  }

  // Saver's Credit
  {
    const credit = TAX_CREDITS.find(c => c.id === 'savers');
    if (!credit) throw new Error('Savers credit definition missing from TAX_CREDITS');
    if (age < 18 || isStudent) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.savers_underage' });
    } else if (!contributesToRetirement) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.savers_no_contribution' });
    } else {
      const statusKey = filingStatus === 'hoh' ? 'hoh' : (isMarried ? 'married' : 'single');
      const tiers = credit.incomeLimits[statusKey];
      let rate = 0;
      for (const tier of tiers) {
        if (annualIncome <= tier.limit) {
          rate = tier.rate;
          break;
        }
      }
      if (rate > 0) {
        const maxContribution = isMarried ? 4000 : 2000;
        const estimated = Math.round(maxContribution * rate / 100);
        results.push({ credit, status: 'eligible', estimatedAmount: estimated, reasonKey: 'reasons.savers_eligible', reasonParams: { rate, amount: maxContribution.toLocaleString() } });
      } else {
        results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.savers_unlikely' });
      }
    }
  }

  // American Opportunity Credit
  {
    const credit = TAX_CREDITS.find(c => c.id === 'aoc');
    if (!credit) throw new Error('AOC credit definition missing from TAX_CREDITS');
    if (!isEnrolledInCollege) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.aoc_not_enrolled' });
    } else {
      const limit = isMarried ? credit.incomeLimitMarried : credit.incomeLimitSingle;
      if (annualIncome <= limit) {
        results.push({ credit, status: 'eligible', estimatedAmount: credit.maxCredit, reasonKey: 'reasons.aoc_eligible', reasonParams: { amount: credit.maxCredit.toLocaleString() } });
      } else {
        results.push({ credit, status: 'unlikely', estimatedAmount: 0, reasonKey: 'reasons.aoc_unlikely' });
      }
    }
  }

  const order = { eligible: 0, likely: 1, unlikely: 2 };
  results.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));

  return results;
}

/**
 * Returns total estimated annual value from eligible tax credits
 */
export function getTotalEstimatedCredits(results) {
  if (!results) return 0;
  return results
    .filter(r => r.status === 'eligible')
    .reduce((sum, r) => sum + r.estimatedAmount, 0);
}
