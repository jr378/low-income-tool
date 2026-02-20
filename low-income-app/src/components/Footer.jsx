import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <p className="text-xs text-gray-500 text-center mb-2">
          {t('footer.notGovernment')}
        </p>
        <div className="flex justify-center gap-4 text-xs">
          <Link to="/about" className="text-blue-600 hover:text-blue-800 underline">
            {t('footer.about')}
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
