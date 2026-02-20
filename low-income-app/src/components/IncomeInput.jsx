import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const FREQUENCIES = [
  { value: 'yearly', multiplier: 1 },
  { value: 'monthly', multiplier: 12 },
  { value: 'biweekly', multiplier: 26 },
  { value: 'weekly', multiplier: 52 },
  { value: 'hourly', multiplier: 2080 },
];

export default function IncomeInput({ value, onChange, helpText }) {
  const { t } = useTranslation();
  const [frequency, setFrequency] = useState('yearly');
  const [rawAmount, setRawAmount] = useState(value ?? '');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentMultiplier = FREQUENCIES.find(f => f.value === frequency)?.multiplier ?? 1;

  useEffect(() => {
    if (rawAmount === '' || rawAmount === null) {
      onChangeRef.current(null);
    } else {
      const num = parseFloat(String(rawAmount).replace(/,/g, ''));
      if (!isNaN(num)) {
        onChangeRef.current(Math.round(num * currentMultiplier));
      }
    }
  }, [rawAmount, currentMultiplier]);

  const annualAmount = value !== null && value !== undefined ? value : null;

  return (
    <div className="mb-6">
      <label htmlFor="income-input" className="block text-lg font-medium text-gray-800 mb-3">
        {t('screener.incomeQuestion')}
      </label>
      {helpText && (
        <p id="income-help" className="text-sm text-gray-600 mb-3">{helpText}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {FREQUENCIES.map(f => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFrequency(f.value);
              setRawAmount('');
              onChange(null);
            }}
            className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              frequency === f.value
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {t(`screener.freq_${f.value}`)}
          </button>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">$</span>
        <input
          id="income-input"
          type="text"
          inputMode="decimal"
          value={rawAmount}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.,]/g, '');
            setRawAmount(val);
          }}
          placeholder={t(`screener.incomePlaceholder_${frequency}`)}
          aria-describedby={helpText ? 'income-help' : undefined}
          className="w-full py-3 pl-8 pr-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      {annualAmount !== null && annualAmount > 0 && frequency !== 'yearly' && (
        <p className="text-sm text-gray-500 mt-2">
          {t('screener.incomeAnnualEstimate', { amount: annualAmount.toLocaleString() })}
        </p>
      )}
    </div>
  );
}
