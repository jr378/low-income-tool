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
 * @returns {Array} Array of { credit, eligible, estimatedAmount, reason }
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
    const tierIndex = Math.min(numChildren, 3);
    const tier = credit.tiers[tierIndex];
    const incomeLimit = isMarried ? tier.incomeLimitMarried : tier.incomeLimitSingle;

    if (!isEmployed) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'EITC requires earned income from employment or self-employment.' });
    } else if (annualIncome <= incomeLimit) {
      // Estimate the credit amount (simplified — real calculation uses earned income tables)
      const ratio = 1 - (annualIncome / incomeLimit);
      const estimated = Math.round(tier.maxCredit * Math.min(ratio * 2, 1));
      results.push({ credit, status: 'eligible', estimatedAmount: estimated, reason: `Your income is within EITC limits for ${numChildren} qualifying child${numChildren !== 1 ? 'ren' : ''}.` });
    } else {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Your income exceeds EITC limits for your filing status and number of children.' });
    }
  }

  // CTC
  {
    const credit = TAX_CREDITS.find(c => c.id === 'ctc');
    if (childrenUnder17 > 0) {
      const phaseOut = isMarried ? credit.phaseOutMarried : credit.phaseOutSingle;
      if (annualIncome <= phaseOut) {
        const estimated = childrenUnder17 * credit.perChild;
        results.push({ credit, status: 'eligible', estimatedAmount: estimated, reason: `$${credit.perChild.toLocaleString()} per qualifying child under 17.` });
      } else {
        const reduction = Math.floor((annualIncome - phaseOut) / 1000) * 50;
        const full = childrenUnder17 * credit.perChild;
        const remaining = Math.max(full - reduction, 0);
        if (remaining > 0) {
          results.push({ credit, status: 'eligible', estimatedAmount: remaining, reason: 'Your credit is reduced due to income phase-out.' });
        } else {
          results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Your income exceeds the Child Tax Credit phase-out range.' });
        }
      }
    } else {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'The Child Tax Credit requires qualifying children under 17.' });
    }
  }

  // Saver's Credit
  {
    const credit = TAX_CREDITS.find(c => c.id === 'savers');
    if (age < 18 || isStudent) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Must be 18+ and not a full-time student.' });
    } else if (!contributesToRetirement) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Requires contributions to a retirement account (401k, IRA, etc.). If you start contributing, you could qualify.' });
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
        results.push({ credit, status: 'eligible', estimatedAmount: estimated, reason: `You could get a ${rate}% credit on retirement contributions up to $${maxContribution.toLocaleString()}.` });
      } else {
        results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Your income exceeds Saver\'s Credit limits for your filing status.' });
      }
    }
  }

  // American Opportunity Credit
  {
    const credit = TAX_CREDITS.find(c => c.id === 'aoc');
    if (!isEnrolledInCollege) {
      results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'This credit is for students enrolled at least half-time in college. If you plan to enroll, you could qualify.' });
    } else {
      const limit = isMarried ? credit.incomeLimitMarried : credit.incomeLimitSingle;
      if (annualIncome <= limit) {
        results.push({ credit, status: 'eligible', estimatedAmount: credit.maxCredit, reason: `Up to $${credit.maxCredit.toLocaleString()}/year for tuition, fees, and course materials.` });
      } else {
        results.push({ credit, status: 'unlikely', estimatedAmount: 0, reason: 'Your income exceeds the American Opportunity Credit limits.' });
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
