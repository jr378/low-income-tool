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
      {status === 'eligible' && estimatedAmount > 0 && (
        <p className="text-sm font-bold text-green-700 mb-2">
          {t('results.estimatedValue')}: ${estimatedAmount.toLocaleString()}{t('results.perYear')}
        </p>
      )}
      {credit.refundable && status === 'eligible' && (
        <p className="text-xs text-green-600 mb-2">
          {isEs ? 'Reembolsable — recibe dinero incluso si no debe impuestos' : 'Refundable — you get money back even if you owe no tax'}
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
