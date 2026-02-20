import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('privacy.title')}</h1>

      <div className="space-y-6 text-sm text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.summaryTitle')}</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium">{t('privacy.summaryText')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.whatWeCollectTitle')}</h2>
          <p>{t('privacy.whatWeCollect')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.howItWorksTitle')}</h2>
          <p>{t('privacy.howItWorks')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.cookiesTitle')}</h2>
          <p>{t('privacy.cookies')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.thirdPartyTitle')}</h2>
          <p>{t('privacy.thirdParty')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.childrenTitle')}</h2>
          <p>{t('privacy.children')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('privacy.changesTitle')}</h2>
          <p>{t('privacy.changes')}</p>
        </section>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-block py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors no-underline"
        >
          {t('app.startOver')}
        </Link>
      </div>
    </div>
  );
}
