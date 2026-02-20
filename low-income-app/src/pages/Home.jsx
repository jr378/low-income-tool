import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {t('app.tagline')}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {t('app.subtitle')}
        </p>
        <div className="inline-flex items-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-2">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t('app.privacy')}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => navigate('/screener/benefits')}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-sm"
        >
          {t('app.startBenefits')}
        </button>

        <button
          onClick={() => navigate('/screener/tax')}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-sm"
        >
          {t('app.startTaxCredits')}
        </button>

        <button
          onClick={() => navigate('/screener/both')}
          className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 text-lg font-semibold rounded-xl transition-colors shadow-sm border-2 border-gray-200"
        >
          {t('app.startBoth')}
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl mb-1">{t('home.timeEstimate')}</div>
          <div className="text-sm text-gray-500">{t('home.quickScreener')}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl mb-1">9+</div>
          <div className="text-sm text-gray-500">{t('home.programsChecked')}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl mb-1">$0</div>
          <div className="text-sm text-gray-500">{t('home.alwaysFree')}</div>
        </div>
      </div>
    </div>
  );
}
