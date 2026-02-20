import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export default function Question({ question, type, value, onChange, options, placeholder, helpText }) {
  const { t } = useTranslation();
  const id = useId();
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="mb-6" role="group" aria-labelledby={`${id}-label`}>
      <label id={`${id}-label`} htmlFor={type === 'number' || type === 'select' ? `${id}-input` : undefined} className="block text-lg font-medium text-gray-800 mb-3">
        {question}
      </label>
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600 mb-3">{helpText}</p>
      )}

      {type === 'yesno' && (
        <div className="flex gap-3" role="radiogroup" aria-labelledby={`${id}-label`}>
          <button
            type="button"
            role="radio"
            aria-checked={value === true}
            onClick={() => onChange(true)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 text-lg font-medium transition-colors ${
              value === true
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('app.yes')}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={value === false}
            onClick={() => onChange(false)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 text-lg font-medium transition-colors ${
              value === false
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('app.no')}
          </button>
        </div>
      )}

      {type === 'number' && (
        <input
          id={`${id}-input`}
          type="number"
          inputMode="numeric"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={placeholder}
          aria-describedby={helpId}
          className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none"
          min="0"
        />
      )}

      {type === 'select' && (
        <select
          id={`${id}-input`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          aria-describedby={helpId}
          className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="">{t('app.select')}</option>
          {options && options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {type === 'radio' && (
        <div className="space-y-2" role="radiogroup" aria-labelledby={`${id}-label`}>
          {options && options.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={value === opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full py-3 px-4 rounded-lg border-2 text-left text-lg font-medium transition-colors ${
                value === opt.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
