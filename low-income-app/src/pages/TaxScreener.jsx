import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Question from '../components/Question';
import IncomeInput from '../components/IncomeInput';

// All possible step IDs in order
const ALL_STEPS = [
  'filingStatus',
  'income',
  'numChildren',
  'childrenUnder17',
  'age',
  'employed',
  'studentRetirement',
  'college',
];

export default function TaxScreener({ onComplete, prefill, onBack }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const noChildrenFromPrefill = prefill?.hasChildrenUnder18 === false;

  const [answers, setAnswers] = useState({
    annualIncome: prefill?.annualIncome ?? null,
    filingStatus: null,
    numChildren: noChildrenFromPrefill ? 0 : null,
    childrenUnder17: noChildrenFromPrefill ? 0 : null,
    age: prefill?.age ?? null,
    isStudent: null,
    isEmployed: prefill?.isEmployed ?? null,
    contributesToRetirement: null,
    isEnrolledInCollege: null,
  });

  // Build the list of steps the user actually needs to see.
  // Steps already answered via prefill are skipped entirely.
  const visibleSteps = useMemo(() => {
    return ALL_STEPS.filter(stepId => {
      if (!prefill) return true;
      if (stepId === 'income' && prefill.annualIncome != null) return false;
      if (stepId === 'age' && prefill.age != null) return false;
      if (stepId === 'employed' && prefill.isEmployed != null) return false;
      // If benefits screener said no children under 18, skip both children questions
      if (stepId === 'numChildren' && noChildrenFromPrefill) return false;
      if (stepId === 'childrenUnder17' && noChildrenFromPrefill) return false;
      return true;
    });
  }, [prefill, noChildrenFromPrefill]);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = visibleSteps[stepIndex];
  const totalVisible = visibleSteps.length;

  const update = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStepId) {
      case 'filingStatus': return answers.filingStatus !== null;
      case 'income': return answers.annualIncome !== null && answers.annualIncome >= 0;
      case 'numChildren': return answers.numChildren !== null && answers.numChildren >= 0;
      case 'childrenUnder17': return answers.childrenUnder17 !== null && answers.childrenUnder17 >= 0;
      case 'age': return answers.age !== null && answers.age > 0;
      case 'employed': return answers.isEmployed !== null;
      case 'studentRetirement': return answers.isStudent !== null && answers.contributesToRetirement !== null;
      case 'college': return answers.isEnrolledInCollege !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (stepIndex < totalVisible - 1) {
      let nextIndex = stepIndex + 1;
      // Skip childrenUnder17 step if user said 0 children
      if (currentStepId === 'numChildren' && answers.numChildren === 0) {
        setAnswers(prev => ({ ...prev, childrenUnder17: 0 }));
        const under17Index = visibleSteps.indexOf('childrenUnder17');
        if (under17Index === nextIndex) {
          nextIndex++;
        }
      }
      if (nextIndex >= totalVisible) {
        onComplete(answers);
      } else {
        setStepIndex(nextIndex);
      }
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      let prevIndex = stepIndex - 1;
      // Skip back over childrenUnder17 if no children
      if (visibleSteps[prevIndex] === 'childrenUnder17' && answers.numChildren === 0) {
        prevIndex--;
      }
      if (prevIndex < 0) {
        onBack ? onBack() : navigate('/');
      } else {
        setStepIndex(prevIndex);
      }
    } else {
      onBack ? onBack() : navigate('/');
    }
  };

  // Compute progress position, accounting for dynamically skipped childrenUnder17
  const effectiveTotal = (answers.numChildren === 0 && visibleSteps.includes('childrenUnder17'))
    ? totalVisible - 1
    : totalVisible;
  const effectiveCurrent = Math.min(stepIndex + 1, effectiveTotal);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProgressBar current={effectiveCurrent} total={effectiveTotal} />

      {currentStepId === 'filingStatus' && (
        <Question
          question={t('screener.filingStatusQuestion')}
          type="radio"
          value={answers.filingStatus}
          onChange={(v) => update('filingStatus', v)}
          options={[
            { value: 'single', label: t('screener.filingSingle') },
            { value: 'married', label: t('screener.filingMarried') },
            { value: 'hoh', label: t('screener.filingHoh') },
          ]}
        />
      )}
      {currentStepId === 'income' && (
        <IncomeInput
          value={answers.annualIncome}
          onChange={(v) => update('annualIncome', v)}
          helpText={t('screener.incomeHelp')}
        />
      )}
      {currentStepId === 'numChildren' && (
        <Question
          question={t('screener.numChildrenQuestion')}
          type="number"
          value={answers.numChildren}
          onChange={(v) => update('numChildren', v)}
          placeholder="0"
        />
      )}
      {currentStepId === 'childrenUnder17' && (
        <Question
          question={t('screener.childrenUnder17Question')}
          type="number"
          value={answers.childrenUnder17}
          onChange={(v) => update('childrenUnder17', v)}
          placeholder="0"
        />
      )}
      {currentStepId === 'age' && (
        <Question
          question={t('screener.ageQuestion')}
          type="number"
          value={answers.age}
          onChange={(v) => update('age', v)}
          placeholder={t('screener.agePlaceholder')}
        />
      )}
      {currentStepId === 'employed' && (
        <Question
          question={t('screener.employedQuestion')}
          type="yesno"
          value={answers.isEmployed}
          onChange={(v) => update('isEmployed', v)}
        />
      )}
      {currentStepId === 'studentRetirement' && (
        <>
          <Question
            question={t('screener.studentQuestion')}
            type="yesno"
            value={answers.isStudent}
            onChange={(v) => update('isStudent', v)}
          />
          <Question
            question={t('screener.retirementQuestion')}
            type="yesno"
            value={answers.contributesToRetirement}
            onChange={(v) => update('contributesToRetirement', v)}
          />
        </>
      )}
      {currentStepId === 'college' && (
        <Question
          question={t('screener.collegeQuestion')}
          type="yesno"
          value={answers.isEnrolledInCollege}
          onChange={(v) => update('isEnrolledInCollege', v)}
        />
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleBack}
          className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          {t('app.back')}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
            canProceed()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {stepIndex === totalVisible - 1 ? t('app.seeResults') : t('app.next')}
        </button>
      </div>
    </div>
  );
}
