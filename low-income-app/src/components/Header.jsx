import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-700 no-underline hover:text-blue-800">
          {t('app.title')}
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
