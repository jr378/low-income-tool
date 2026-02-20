import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';

export default function BenefitsResults({ results, answers }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!results || results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">{t('results.noResults')}</p>
        <p className="text-gray-500 mt-2">{t('results.dial211')}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
        >
          {t('app.startOver')}
        </button>
      </div>
    );
  }

  const eligible = results.filter(r => r.status === 'eligible');
  const likely = results.filter(r => r.status === 'likely');
  const unlikely = results.filter(r => r.status === 'unlikely');
  const actionable = eligible.length + likely.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('results.benefitsTitle')}</h2>

      {/* Nudge Hero: Loss-aversion framing + salience */}
      {actionable > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 mb-6 text-center">
          <p className="text-xl font-bold text-green-900 mb-2">
            {t('results.benefitsHero', { count: actionable })}
          </p>
          <p className="text-sm text-green-700">
            {t('results.benefitsHeroSub')}
          </p>
        </div>
      )}

      {eligible.length > 0 && (
        <div className="mb-6">
          {eligible.map(r => (
            <ProgramCard
              key={r.program.id}
              program={r.program}
              status={r.status}
              reason={t(r.reasonKey, r.reasonParams)}
              householdSize={answers?.householdSize}
            />
          ))}
        </div>
      )}

      {likely.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {t('results.likely_count', { count: likely.length })}
          </h3>
          {likely.map(r => (
            <ProgramCard
              key={r.program.id}
              program={r.program}
              status={r.status}
              reason={t(r.reasonKey, r.reasonParams)}
              householdSize={answers?.householdSize}
            />
          ))}
        </div>
      )}

      {unlikely.length > 0 && (
        <details className="mb-6">
          <summary className="text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
            {t('results.unlikely_programs', { count: unlikely.length })}
          </summary>
          <div className="mt-3">
            {unlikely.map(r => (
              <ProgramCard
                key={r.program.id}
                program={r.program}
                status={r.status}
                reason={t(r.reasonKey, r.reasonParams)}
                householdSize={answers?.householdSize}
              />
            ))}
          </div>
        </details>
      )}

      {/* Nudge: Clear next steps — reduce decision paralysis */}
      {actionable > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">{t('results.nextSteps')}</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              <span>{t('results.nextStep1')}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              <span>{t('results.nextStep2')}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              <span>{t('results.nextStep3')}</span>
            </li>
          </ol>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-600">{t('results.disclaimer')}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          {t('results.printResults')}
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {t('app.startOver')}
        </button>
      </div>
    </div>
  );
}
