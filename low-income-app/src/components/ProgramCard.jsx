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
      <p className="text-gray-700 text-sm mb-2">{description}</p>
      {reason && (
        <p className="text-sm text-gray-600 italic mb-2">{reason}</p>
      )}
      {benefit && status !== 'unlikely' && (
        <p className="text-sm font-medium text-green-700 mb-2">
          {t('results.estimatedValue')}: {benefit}
        </p>
      )}
      {status !== 'unlikely' && program.applyUrl && (
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          {t('results.learnMore')} →
        </a>
      )}
    </div>
  );
}
