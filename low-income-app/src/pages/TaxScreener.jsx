import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Question from '../components/Question';

const TOTAL_STEPS = 8;

export default function TaxScreener({ onComplete, prefill }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    annualIncome: prefill?.annualIncome ?? null,
    filingStatus: null,
    numChildren: prefill?.hasChildrenUnder18 ? null : 0,
    childrenUnder17: null,
    age: prefill?.age ?? null,
    isStudent: null,
    isEmployed: prefill?.isEmployed ?? null,
    contributesToRetirement: null,
    isEnrolledInCollege: null,
  });

  const update = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return answers.filingStatus !== null;
      case 2: return answers.annualIncome !== null && answers.annualIncome >= 0;
      case 3: return answers.numChildren !== null && answers.numChildren >= 0;
      case 4: return answers.childrenUnder17 !== null && answers.childrenUnder17 >= 0;
      case 5: return answers.age !== null && answers.age > 0;
      case 6: return answers.isEmployed !== null;
      case 7: return answers.isStudent !== null && answers.contributesToRetirement !== null;
      case 8: return answers.isEnrolledInCollege !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      // Skip children under 17 question if no children
      if (step === 3 && answers.numChildren === 0) {
        setAnswers(prev => ({ ...prev, childrenUnder17: 0 }));
        setStep(step + 2);
        return;
      }
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      // Skip back over children under 17 if no children
      if (step === 5 && answers.numChildren === 0) {
        setStep(3);
        return;
      }
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 1 && (
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
      {step === 2 && (
        <Question
          question={t('screener.incomeQuestion')}
          type="number"
          value={answers.annualIncome}
          onChange={(v) => update('annualIncome', v)}
          placeholder={t('screener.incomePlaceholder')}
          helpText={t('screener.incomeHelp')}
        />
      )}
      {step === 3 && (
        <Question
          question={t('screener.numChildrenQuestion')}
          type="number"
          value={answers.numChildren}
          onChange={(v) => update('numChildren', v)}
          placeholder="0"
        />
      )}
      {step === 4 && (
        <Question
          question={t('screener.childrenUnder17Question')}
          type="number"
          value={answers.childrenUnder17}
          onChange={(v) => update('childrenUnder17', v)}
          placeholder="0"
        />
      )}
      {step === 5 && (
        <Question
          question={t('screener.ageQuestion')}
          type="number"
          value={answers.age}
          onChange={(v) => update('age', v)}
          placeholder={t('screener.agePlaceholder')}
        />
      )}
      {step === 6 && (
        <Question
          question={t('screener.employedQuestion')}
          type="yesno"
          value={answers.isEmployed}
          onChange={(v) => update('isEmployed', v)}
        />
      )}
      {step === 7 && (
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
      {step === 8 && (
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
          {step === TOTAL_STEPS ? t('app.seeResults') : t('app.next')}
        </button>
      </div>
    </div>
  );
}
