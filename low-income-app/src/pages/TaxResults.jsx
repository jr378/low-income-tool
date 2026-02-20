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
  const monthlyTotal = totalCredits > 0 ? Math.round(totalCredits / 12) : 0;

  // Filter free filing resources by income
  const income = answers?.annualIncome ?? 0;
  const filingResources = FREE_FILING_RESOURCES.filter(
    r => r.incomeLimit === null || income <= r.incomeLimit
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('results.taxCreditsTitle')}</h2>

      {/* Nudge Hero: Big anchoring number + monthly reframing + loss aversion */}
      {totalCredits > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
            {t('results.taxCreditsHero')}
          </p>
          <p className="text-4xl font-extrabold text-green-900 mb-1">
            {`$${totalCredits.toLocaleString()}`}{t('results.perYear')}
          </p>
          {monthlyTotal > 0 && (
            <p className="text-lg font-medium text-green-700 mb-2">
              {t('results.monthlyBreakdown', { amount: monthlyTotal.toLocaleString() })}
            </p>
          )}
          <p className="text-sm text-green-600">
            {t('results.taxCreditsHeroSub')}
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
              reason={t(r.reasonKey, r.reasonParams)}
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
                reason={t(r.reasonKey, r.reasonParams)}
                estimatedAmount={r.estimatedAmount}
              />
            ))}
          </div>
        </details>
      )}

      {/* Nudge: Free filing resources with clear action-oriented framing */}
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
                className="flex items-center justify-between bg-white border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors no-underline group"
              >
                <div>
                  <div className="font-semibold text-blue-700 group-hover:text-blue-800">
                    {isEs ? resource.nameEs : resource.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isEs ? resource.descriptionEs : resource.description}
                  </div>
                </div>
                <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-600 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Nudge: Clear next steps */}
      {eligible.length > 0 && (
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
