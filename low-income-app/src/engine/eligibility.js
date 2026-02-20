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
 * @returns {Array} Array of { program, eligible, reason }
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
        return result(program, 'eligible', 'Your income is within the SNAP gross income limit.');
      }
      if (percentFPL <= 200) {
        return result(program, 'likely', 'Some states have expanded SNAP eligibility (Broad-Based Categorical Eligibility). You may qualify in your state.');
      }
      return result(program, 'unlikely', 'Your income appears to exceed SNAP limits, but you may still qualify if you have high housing or childcare costs.');
    }

    case 'medicaid': {
      const isExpansion = isMedicaidExpansionState(state);
      if (isExpansion && percentFPL <= 138) {
        return result(program, 'eligible', 'Your state expanded Medicaid and your income is within the limit.');
      }
      if (!isExpansion && percentFPL <= 50 && hasChildrenUnder18) {
        return result(program, 'eligible', 'As a parent with very low income, you likely qualify even without Medicaid expansion.');
      }
      if (!isExpansion && (isPregnant || hasChildrenUnder18)) {
        return result(program, 'likely', 'Your state has not expanded Medicaid, but pregnant women and children often have higher income limits.');
      }
      if (isExpansion && percentFPL <= 200) {
        return result(program, 'likely', 'You may qualify through state-specific programs or if your income decreases.');
      }
      return result(program, 'unlikely', 'Your income may exceed Medicaid limits in your state.');
    }

    case 'chip': {
      if (!hasChildrenUnder18) {
        return result(program, 'unlikely', 'CHIP is for children under 19.');
      }
      if (percentFPL <= 200) {
        return result(program, 'eligible', 'Your income is within typical CHIP limits and you have children.');
      }
      if (percentFPL <= 300) {
        return result(program, 'likely', 'Many states cover children at higher income levels through CHIP.');
      }
      return result(program, 'unlikely', 'Your income may exceed CHIP limits in your state.');
    }

    case 'wic': {
      const hasWicEligiblePerson = isPregnant || hasChildrenUnder5;
      if (!hasWicEligiblePerson) {
        return result(program, 'unlikely', 'WIC is for pregnant/postpartum women, infants, and children under 5.');
      }
      if (percentFPL <= 185) {
        return result(program, 'eligible', 'Your income is within WIC limits and your household includes an eligible person.');
      }
      return result(program, 'unlikely', 'Your income appears to exceed WIC limits (185% FPL).');
    }

    case 'liheap': {
      if (percentFPL <= 150) {
        return result(program, 'eligible', 'Your income is within LIHEAP limits.');
      }
      if (percentFPL <= 200) {
        return result(program, 'likely', 'Some states have higher LIHEAP income limits. You may qualify.');
      }
      return result(program, 'unlikely', 'Your income appears to exceed LIHEAP limits.');
    }

    case 'ssi': {
      const monthlyIncome = annualIncome / 12;
      const isAgeEligible = age >= 65;
      if ((isAgeEligible || hasDisability) && monthlyIncome <= 1971) {
        return result(program, 'eligible', 'You meet the age/disability requirement and your income is within SSI limits.');
      }
      if ((isAgeEligible || hasDisability) && monthlyIncome <= 3000) {
        return result(program, 'likely', 'You meet the age/disability requirement. SSI has complex income rules — not all income is counted.');
      }
      if (!isAgeEligible && !hasDisability) {
        return result(program, 'unlikely', 'SSI requires age 65+ or a qualifying disability.');
      }
      return result(program, 'unlikely', 'Your income may exceed SSI limits.');
    }

    case 'tanf': {
      if (!hasChildrenUnder18) {
        return result(program, 'unlikely', 'TANF is primarily for families with children.');
      }
      if (percentFPL <= 100) {
        return result(program, 'eligible', 'Your income is within typical TANF limits and you have children.');
      }
      if (percentFPL <= 150) {
        return result(program, 'likely', 'TANF limits vary by state. You may qualify depending on your state\'s rules.');
      }
      return result(program, 'unlikely', 'Your income may exceed TANF limits in your state.');
    }

    case 'lifeline': {
      if (percentFPL <= 135) {
        return result(program, 'eligible', 'Your income is within Lifeline limits.');
      }
      return result(program, 'likely', 'You may qualify for Lifeline if you participate in SNAP, Medicaid, SSI, or other qualifying programs.');
    }

    case 'pell': {
      if (percentFPL <= 175) {
        return result(program, 'eligible', 'Based on your income, you would likely receive a significant Pell Grant if enrolled in college.');
      }
      if (percentFPL <= 350) {
        return result(program, 'likely', 'You may qualify for a partial Pell Grant if enrolled in college.');
      }
      return result(program, 'unlikely', 'Your income may be too high for a Pell Grant.');
    }

    default:
      return result(program, 'unlikely', 'Unable to determine eligibility.');
  }
}

function result(program, status, reason) {
  return { program, status, reason };
}
