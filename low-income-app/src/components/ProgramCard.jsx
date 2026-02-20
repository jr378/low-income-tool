import { useTranslation } from 'react-i18next';

const STATUS_STYLES = {
  eligible: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-800',
    icon: '✓',
  },
  likely: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: '?',
  },
  unlikely: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    badge: 'bg-gray-100 text-gray-500',
    icon: '—',
  },
};

export default function ProgramCard({ program, status, reason, estimatedBenefit, householdSize }) {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const style = STATUS_STYLES[status];

  const name = isEs ? (program.nameEs || program.name) : program.name;
  const description = isEs ? (program.descriptionEs || program.description) : program.description;
  const benefit = estimatedBenefit || (
    isEs
      ? (program.estimateBenefitEs ? program.estimateBenefitEs(householdSize || 1) : null)
      : (program.estimateBenefit ? program.estimateBenefit(householdSize || 1) : null)
  );

  return (
    <div className={`border-2 ${style.border} ${style.bg} rounded-xl p-4 mb-4`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge} whitespace-nowrap ml-2`}>
          {style.icon} {t(`results.${status}`)}
        </span>
      </div>
      <p className="text-gray-700 text-sm mb-3">{description}</p>
      {reason && (
        <p className="text-sm text-gray-600 italic mb-3">{reason}</p>
      )}

      {/* Nudge: Make estimated value large and unmissable */}
      {benefit && status !== 'unlikely' && (
        <div className="bg-white border border-green-300 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
            {t('results.estimatedValue')}
          </p>
          <p className="text-xl font-bold text-green-800">
            {benefit}
          </p>
        </div>
      )}

      {/* Nudge: Big, clear Apply button — reduce friction */}
      {status !== 'unlikely' && program.applyUrl && (
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-xl transition-colors no-underline shadow-sm"
        >
          {t('results.applyNow')}
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
