import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="text-sm px-3 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
      aria-label="Switch language"
    >
      {t('app.language')}
    </button>
  );
}
