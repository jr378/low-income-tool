import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TaxCreditCard from '../components/TaxCreditCard';
import { getTotalEstimatedCredits } from '../engine/taxEngine';
import { FREE_FILING_RESOURCES } from '../data/taxCredits';

export default function TaxResults({ results, answers }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEs = i18n.language === 'es';

  if (!results || results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">{t('results.noResults')}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
        >
          {t('app.startOver')}
        </button>
      </div>
    );
  }

  const totalCredits = getTotalEstimatedCredits(results);
  const eligible = results.filter(r => r.status === 'eligible');
  const unlikely = results.filter(r => r.status === 'unlikely');

  // Filter free filing resources by income
  const income = answers?.annualIncome ?? 0;
  const filingResources = FREE_FILING_RESOURCES.filter(
    r => r.incomeLimit === null || income <= r.incomeLimit
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('results.taxCreditsTitle')}</h2>

      {totalCredits > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800 font-semibold text-lg">
            {t('results.totalEstimated')}: <span className="text-2xl">${totalCredits.toLocaleString()}</span>{t('results.perYear')}
          </p>
        </div>
      )}

      {eligible.length > 0 && (
        <div className="mb-6">
          {eligible.map(r => (
            <TaxCreditCard
              key={r.credit.id}
              credit={r.credit}
              status={r.status}
              reason={r.reason}
              estimatedAmount={r.estimatedAmount}
            />
          ))}
        </div>
      )}

      {unlikely.length > 0 && (
        <details className="mb-6">
          <summary className="text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
            {t('results.unlikely_credits', { count: unlikely.length })}
          </summary>
          <div className="mt-3">
            {unlikely.map(r => (
              <TaxCreditCard
                key={r.credit.id}
                credit={r.credit}
                status={r.status}
                reason={r.reason}
                estimatedAmount={r.estimatedAmount}
              />
            ))}
          </div>
        </details>
      )}

      {filingResources.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('results.freeFilingTitle')}</h3>
          <p className="text-sm text-gray-600 mb-3">{t('results.freeFilingSubtitle')}</p>
          <div className="space-y-3">
            {filingResources.map(resource => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors no-underline"
              >
                <div className="font-semibold text-blue-700">
                  {isEs ? resource.nameEs : resource.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {isEs ? resource.descriptionEs : resource.description}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-800">{t('results.disclaimer')}</p>
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
