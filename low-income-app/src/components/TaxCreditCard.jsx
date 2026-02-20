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

export default function TaxCreditCard({ credit, status, reason, estimatedAmount }) {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const style = STATUS_STYLES[status];

  const name = isEs ? (credit.nameEs || credit.name) : credit.name;
  const description = isEs ? (credit.descriptionEs || credit.description) : credit.description;
  const requirements = isEs ? (credit.requirementsEs || credit.requirements) : credit.requirements;

  const monthlyAmount = estimatedAmount > 0 ? Math.round(estimatedAmount / 12) : 0;

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

      {/* Nudge: Large, prominent dollar amount with monthly reframing */}
      {status === 'eligible' && estimatedAmount > 0 && (
        <div className="bg-white border border-green-300 rounded-lg p-4 mb-3 text-center">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
            {t('results.estimatedValue')}
          </p>
          <p className="text-3xl font-bold text-green-800 mb-1">
            {`$${estimatedAmount.toLocaleString()}`}{t('results.perYear')}
          </p>
          {/* Temporal reframing: monthly amount feels more real and immediate */}
          {monthlyAmount > 0 && (
            <p className="text-sm font-medium text-green-700">
              {t('results.monthlyBreakdown', { amount: monthlyAmount.toLocaleString() })}
            </p>
          )}
        </div>
      )}

      {/* Nudge: Make refundable badge prominent — key info that reduces uncertainty */}
      {credit.refundable && status === 'eligible' && (
        <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
          <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-emerald-800">
            {t('results.refundable')}
          </p>
        </div>
      )}

      {/* Nudge: Clear call to action */}
      {status === 'eligible' && estimatedAmount > 0 && (
        <p className="text-sm font-semibold text-green-700 text-center mb-2">
          {t('results.fileToGetMoney')}
        </p>
      )}

      {status !== 'unlikely' && requirements && (
        <details className="mt-2">
          <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
            {t('results.requirements')}
          </summary>
          <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
