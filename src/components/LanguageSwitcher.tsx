import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
            i18n.resolvedLanguage === lang.code
              ? 'bg-blue-600 text-white shadow-md scale-110'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
          }`}
          title={lang.label}
          aria-label={lang.label}
        >
          <span className="text-lg leading-none">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
}
