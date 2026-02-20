import { getPercentFPL } from '../data/fpl';
import { isMedicaidExpansionState } from '../data/states';
import { PROGRAMS } from '../data/programs';

/**
 * Checks eligibility for all benefit programs based on user answers.
 *
 * @param {Object} answers - User's screening answers
 * @param {string} answers.state - 2-letter state code
 * @param {number} answers.householdSize - Total people in household
 * @param {number} answers.annualIncome - Gross annual household income
 * @param {number} answers.age - Age of primary applicant
 * @param {boolean} answers.isPregnant - Whether anyone in household is pregnant
 * @param {boolean} answers.hasChildrenUnder5 - Whether household has children under 5
 * @param {boolean} answers.hasChildrenUnder18 - Whether household has children under 18
 * @param {boolean} answers.hasDisability - Whether applicant has a disability
 * @param {boolean} answers.isEmployed - Whether applicant is currently employed
 * @param {boolean} answers.isStudent - Whether applicant is a student
 *
 * @returns {Array} Array of { program, status, reasonKey, reasonParams }
 */
export function checkAllBenefits(answers) {
  const {
    state,
    householdSize,
    annualIncome,
    age,
    isPregnant,
    hasChildrenUnder5,
    hasChildrenUnder18,
    hasDisability,
    isStudent,
  } = answers;

  const percentFPL = getPercentFPL(annualIncome, householdSize, state);
  const results = [];

  for (const program of PROGRAMS) {
    const result = checkProgram(program, {
      state,
      householdSize,
      annualIncome,
      age,
      percentFPL,
      isPregnant,
      hasChildrenUnder5,
      hasChildrenUnder18,
      hasDisability,
      isStudent,
    });
    results.push(result);
  }

  // Sort: eligible first, then likely, then unlikely
  const order = { eligible: 0, likely: 1, unlikely: 2 };
  results.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));

  return results;
}

function checkProgram(program, data) {
  const { state, householdSize, annualIncome, age, percentFPL, isPregnant, hasChildrenUnder5, hasChildrenUnder18, hasDisability, isStudent } = data;

  switch (program.id) {
    case 'snap': {
      if (percentFPL <= 130) {
        return result(program, 'eligible', 'reasons.snap_eligible');
      }
      if (percentFPL <= 200) {
        return result(program, 'likely', 'reasons.snap_likely');
      }
      return result(program, 'unlikely', 'reasons.snap_unlikely');
    }

    case 'medicaid': {
      const isExpansion = isMedicaidExpansionState(state);
      if (isExpansion && percentFPL <= 138) {
        return result(program, 'eligible', 'reasons.medicaid_eligible_expansion');
      }
      if (!isExpansion && percentFPL <= 50 && hasChildrenUnder18) {
        return result(program, 'eligible', 'reasons.medicaid_eligible_parent');
      }
      if (!isExpansion && (isPregnant || hasChildrenUnder18)) {
        return result(program, 'likely', 'reasons.medicaid_likely_noexpansion');
      }
      if (isExpansion && percentFPL <= 200) {
        return result(program, 'likely', 'reasons.medicaid_likely_expansion');
      }
      return result(program, 'unlikely', 'reasons.medicaid_unlikely');
    }

    case 'chip': {
      if (!hasChildrenUnder18) {
        return result(program, 'unlikely', 'reasons.chip_unlikely_nochildren');
      }
      if (percentFPL <= 200) {
        return result(program, 'eligible', 'reasons.chip_eligible');
      }
      if (percentFPL <= 300) {
        return result(program, 'likely', 'reasons.chip_likely');
      }
      return result(program, 'unlikely', 'reasons.chip_unlikely');
    }

    case 'wic': {
      const hasWicEligiblePerson = isPregnant || hasChildrenUnder5;
      if (!hasWicEligiblePerson) {
        return result(program, 'unlikely', 'reasons.wic_unlikely_noperson');
      }
      if (percentFPL <= 185) {
        return result(program, 'eligible', 'reasons.wic_eligible');
      }
      return result(program, 'unlikely', 'reasons.wic_unlikely');
    }

    case 'liheap': {
      if (percentFPL <= 150) {
        return result(program, 'eligible', 'reasons.liheap_eligible');
      }
      if (percentFPL <= 200) {
        return result(program, 'likely', 'reasons.liheap_likely');
      }
      return result(program, 'unlikely', 'reasons.liheap_unlikely');
    }

    case 'ssi': {
      const monthlyIncome = annualIncome / 12;
      const isAgeEligible = age >= 65;
      if ((isAgeEligible || hasDisability) && monthlyIncome <= 1971) {
        return result(program, 'eligible', 'reasons.ssi_eligible');
      }
      if ((isAgeEligible || hasDisability) && monthlyIncome <= 3000) {
        return result(program, 'likely', 'reasons.ssi_likely');
      }
      if (!isAgeEligible && !hasDisability) {
        return result(program, 'unlikely', 'reasons.ssi_unlikely_age');
      }
      return result(program, 'unlikely', 'reasons.ssi_unlikely');
    }

    case 'tanf': {
      if (!hasChildrenUnder18) {
        return result(program, 'unlikely', 'reasons.tanf_unlikely_nochildren');
      }
      if (percentFPL <= 100) {
        return result(program, 'eligible', 'reasons.tanf_eligible');
      }
      if (percentFPL <= 150) {
        return result(program, 'likely', 'reasons.tanf_likely');
      }
      return result(program, 'unlikely', 'reasons.tanf_unlikely');
    }

    case 'lifeline': {
      if (percentFPL <= 135) {
        return result(program, 'eligible', 'reasons.lifeline_eligible');
      }
      return result(program, 'likely', 'reasons.lifeline_likely');
    }

    case 'pell': {
      if (percentFPL <= 175) {
        return result(program, 'eligible', 'reasons.pell_eligible');
      }
      if (percentFPL <= 350) {
        return result(program, 'likely', 'reasons.pell_likely');
      }
      return result(program, 'unlikely', 'reasons.pell_unlikely');
    }

    default:
      return result(program, 'unlikely', 'reasons.default_unlikely');
  }
}

function result(program, status, reasonKey, reasonParams) {
  return { program, status, reasonKey, reasonParams };
}
