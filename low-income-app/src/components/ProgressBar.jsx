import { useTranslation } from 'react-i18next';

export default function ProgressBar({ current, total }) {
  const { t } = useTranslation();
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{t('screener.step', { current, total })}</span>
        <span>{t('screener.progress', { percent })}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
