import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'gu', label: 'ગુ' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [activeLang, setActiveLang] = useState<string>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || i18n.language || 'en';
    const baseCode = savedLang.split('-')[0].toLowerCase();
    setActiveLang(baseCode);
  }, [i18n.language]);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setActiveLang(code);
  };

  return (
    <div
      className="inline-flex bg-[#11141A] border border-[#323A46] rounded-xl p-1 shadow-inner w-full justify-between"
      role="group"
      aria-label={t('languageSelection')}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`flex-1 py-1 text-xs font-heading rounded-lg transition-all ${
            activeLang === lang.code
              ? 'bg-[#323A46] text-[#DFE6EF] shadow-sm font-bold border border-[#7E8A99]/40'
              : 'text-[#7E8A99] hover:bg-[#1B2028] hover:text-[#DFE6EF]'
          }`}
          aria-pressed={activeLang === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
