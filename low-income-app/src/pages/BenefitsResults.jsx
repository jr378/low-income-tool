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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('results.benefitsTitle')}</h2>

      {eligible.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800 font-semibold text-lg">
            {t('results.eligible_count', { count: eligible.length })}
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
              reason={r.reason}
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
              reason={r.reason}
              householdSize={answers?.householdSize}
            />
          ))}
        </div>
      )}

      {unlikely.length > 0 && (
        <details className="mb-6">
          <summary className="text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
            {unlikely.length} {unlikely.length === 1 ? 'program' : 'programs'} you probably don't qualify for
          </summary>
          <div className="mt-3">
            {unlikely.map(r => (
              <ProgramCard
                key={r.program.id}
                program={r.program}
                status={r.status}
                reason={r.reason}
                householdSize={answers?.householdSize}
              />
            ))}
          </div>
        </details>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-800">{t('results.disclaimer')}</p>
        <p className="text-sm text-blue-700 mt-2">{t('results.dial211')}</p>
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
