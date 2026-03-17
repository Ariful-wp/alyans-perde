import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
];

interface Props {
  variant?: 'header' | 'footer';
}

const LanguageSwitcher: React.FC<Props> = ({ variant = 'header' }) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isHeader = variant === 'header';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium tracking-wider transition-all duration-200 border ${
          isHeader
            ? 'border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600 bg-white'
            : 'border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-400 bg-transparent'
        }`}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        aria-label="Select language"
      >
        <Globe size={13} />
        <span>{current.flag}</span>
        <span className="uppercase">{current.label}</span>
        <ChevronDown
          size={11}
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-1 w-36 rounded-lg shadow-xl border overflow-hidden ${
            isHeader
              ? 'bg-white border-stone-100 top-full right-0'
              : 'bg-stone-800 border-stone-700 bottom-full right-0 mb-1'
          }`}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-all duration-150 ${
                lang === l.code
                  ? isHeader
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'bg-stone-700 text-amber-400 font-semibold'
                  : isHeader
                    ? 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    : 'text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1 text-left">
                {l.code === 'en' ? 'English' : l.code === 'tr' ? 'Türkçe' : 'العربية'}
              </span>
              {lang === l.code && (
                <span style={{ color: '#d4a843' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
