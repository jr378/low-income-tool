import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { STATES } from '../data/states';
import ProgressBar from '../components/ProgressBar';
import Question from '../components/Question';
import IncomeInput from '../components/IncomeInput';

const TOTAL_STEPS = 9;

export default function BenefitsScreener({ onComplete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    state: null,
    householdSize: null,
    annualIncome: null,
    age: null,
    isPregnant: null,
    hasChildrenUnder5: null,
    hasChildrenUnder18: null,
    hasDisability: null,
    isEmployed: null,
  });

  const update = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return answers.state !== null;
      case 2: return answers.householdSize !== null && answers.householdSize > 0;
      case 3: return answers.annualIncome !== null && answers.annualIncome >= 0;
      case 4: return answers.age !== null && answers.age > 0;
      case 5: return answers.isPregnant !== null;
      case 6: return answers.hasChildrenUnder5 !== null;
      case 7: return answers.hasChildrenUnder18 !== null;
      case 8: return answers.hasDisability !== null;
      case 9: return answers.isEmployed !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Add isStudent default for compatibility with tax engine
      const finalAnswers = { ...answers, isStudent: false };
      onComplete(finalAnswers);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const stateOptions = STATES.map(s => ({ value: s.code, label: s.name }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <Question
          question={t('screener.stateQuestion')}
          type="select"
          value={answers.state}
          onChange={(v) => update('state', v)}
          options={stateOptions}
        />
      )}
      {step === 2 && (
        <Question
          question={t('screener.householdSizeQuestion')}
          type="number"
          value={answers.householdSize}
          onChange={(v) => update('householdSize', v)}
          placeholder="e.g. 3"
        />
      )}
      {step === 3 && (
        <IncomeInput
          value={answers.annualIncome}
          onChange={(v) => update('annualIncome', v)}
          helpText={t('screener.incomeHelp')}
        />
      )}
      {step === 4 && (
        <Question
          question={t('screener.ageQuestion')}
          type="number"
          value={answers.age}
          onChange={(v) => update('age', v)}
          placeholder={t('screener.agePlaceholder')}
        />
      )}
      {step === 5 && (
        <Question
          question={t('screener.pregnantQuestion')}
          helpText={t('screener.pregnantHelp')}
          type="yesno"
          value={answers.isPregnant}
          onChange={(v) => update('isPregnant', v)}
        />
      )}
      {step === 6 && (
        <Question
          question={t('screener.childrenUnder5Question')}
          type="yesno"
          value={answers.hasChildrenUnder5}
          onChange={(v) => update('hasChildrenUnder5', v)}
        />
      )}
      {step === 7 && (
        <Question
          question={t('screener.childrenUnder18Question')}
          type="yesno"
          value={answers.hasChildrenUnder18}
          onChange={(v) => update('hasChildrenUnder18', v)}
        />
      )}
      {step === 8 && (
        <Question
          question={t('screener.disabilityQuestion')}
          type="yesno"
          value={answers.hasDisability}
          onChange={(v) => update('hasDisability', v)}
        />
      )}
      {step === 9 && (
        <Question
          question={t('screener.employedQuestion')}
          type="yesno"
          value={answers.isEmployed}
          onChange={(v) => update('isEmployed', v)}
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
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === TOTAL_STEPS ? t('app.seeResults') : t('app.next')}
        </button>
      </div>
    </div>
  );
}
