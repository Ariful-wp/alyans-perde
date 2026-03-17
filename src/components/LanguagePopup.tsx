import React, { useEffect, useState } from 'react';
import { X, Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Turkish',  nativeLabel: 'Türkçe',  flag: '🇹🇷' },
  { code: 'ar', label: 'Arabic',   nativeLabel: 'العربية', flag: '🇸🇦' },
];

const LanguagePopup: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Show popup once per session if no language saved
    const alreadyShown = sessionStorage.getItem('alyans_lang_shown');
    if (alreadyShown) return;

    const onScroll = () => {
      if (window.scrollY > 300) {
        sessionStorage.setItem('alyans_lang_shown', '1');
        setVisible(true);
        setAnimating(true);
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => {
    setAnimating(false);
    setTimeout(() => setVisible(false), 350);
  };

  const select = (code: Language) => {
    setLang(code);
    close();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #fdf8ef 100%)',
          transform: animating ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
          opacity: animating ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold top bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #b8860b, #d4a843, #f0c060, #d4a843, #b8860b)' }} />

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #d4a843, #b8860b)' }}
          >
            <Globe size={26} className="text-white" />
          </div>
          <h2
            className="text-2xl font-light text-stone-800 mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('lang_popup_title')}
          </h2>
          <p className="text-stone-500 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('lang_popup_sub')}
          </p>
        </div>

        {/* Language Options */}
        <div className="px-8 pb-4 grid grid-cols-3 gap-3">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className="group relative flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all duration-200"
              style={{
                borderColor: lang === l.code ? '#d4a843' : '#e7e0d4',
                background: lang === l.code
                  ? 'linear-gradient(135deg, #fef9ee, #fef3d0)'
                  : '#ffffff',
                boxShadow: lang === l.code
                  ? '0 4px 16px rgba(212,168,67,0.25)'
                  : '0 1px 4px rgba(0,0,0,0.06)',
                transform: lang === l.code ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <span className="text-3xl">{l.flag}</span>
              <span
                className="text-sm font-semibold text-stone-700"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {l.nativeLabel}
              </span>
              {lang === l.code && (
                <span
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d4a843, #b8860b)' }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-stone-100 my-2" />

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 text-center">
          <button
            onClick={close}
            className="text-sm text-stone-400 hover:text-amber-600 underline underline-offset-2 transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('lang_popup_close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;
