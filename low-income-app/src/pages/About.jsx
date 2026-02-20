import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function About() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('about.title')}</h1>

      {/* Disclaimer */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('about.disclaimerTitle')}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
          <p className="text-sm text-yellow-900 font-medium">{t('about.notGovernment')}</p>
          <p className="text-sm text-yellow-800">{t('about.estimatesOnly')}</p>
          <p className="text-sm text-yellow-800">{t('about.notLegalAdvice')}</p>
          <p className="text-sm text-yellow-800">{t('about.alwaysApply')}</p>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('about.sourcesTitle')}</h2>
        <p className="text-sm text-gray-600 mb-3">{t('about.dataAsOf')}</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>{isEs ? 'Niveles Federales de Pobreza' : 'Federal Poverty Levels'}</strong>
              {' \u2014 '}
              <a href="https://aspe.hhs.gov/poverty-guidelines" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                HHS ASPE
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>SNAP</strong>
              {' \u2014 '}
              <a href="https://www.fns.usda.gov/snap/recipient/eligibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                USDA FNS
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>Medicaid / CHIP</strong>
              {' \u2014 '}
              <a href="https://www.medicaid.gov/medicaid/eligibility/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                CMS Medicaid.gov
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>{isEs ? 'Cr\u00e9ditos Tributarios' : 'Tax Credits'} (EITC, CTC, AOC)</strong>
              {' \u2014 '}
              <a href="https://www.irs.gov/credits-deductions-for-individuals" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                IRS.gov
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>SSI</strong>
              {' \u2014 '}
              <a href="https://www.ssa.gov/ssi/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                SSA.gov
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">-</span>
            <span>
              <strong>WIC</strong>
              {' \u2014 '}
              <a href="https://www.fns.usda.gov/wic" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                USDA FNS
              </a>
            </span>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('about.howItWorksTitle')}</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>{t('about.howItWorks1')}</p>
          <p>{t('about.howItWorks2')}</p>
          <p>{t('about.howItWorks3')}</p>
        </div>
      </section>

      {/* Contact / Help */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('about.needHelpTitle')}</h2>
        <p className="text-sm text-gray-700 mb-2">{t('about.needHelp211')}</p>
        <p className="text-sm text-gray-700">{t('about.needHelpVita')}</p>
      </section>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-block py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors no-underline"
        >
          {t('app.startOver')}
        </Link>
        <Link
          to="/privacy"
          className="inline-block py-3 px-6 ml-3 text-blue-600 font-medium hover:text-blue-800 underline"
        >
          {t('about.privacyLink')}
        </Link>
      </div>
    </div>
  );
}
