import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300" dir={dir}>
      {/* Newsletter Bar */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl text-white font-light mb-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {t('footer_newsletter')}
              </h3>
              <p className="text-stone-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('footer_newsletter_sub')}
              </p>
            </div>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder={t('footer_email_placeholder')}
                className="flex-1 md:w-72 px-4 py-3 bg-stone-800 border border-stone-700 text-white text-sm rounded-sm outline-none focus:border-amber-500 transition-colors placeholder-stone-500"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
              <button
                type="submit"
                className="btn-gold px-5 py-3 text-xs tracking-widest uppercase rounded-sm flex items-center gap-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('footer_subscribe')} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gold-gradient rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>A</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className="text-xl font-semibold tracking-widest text-white"
                    style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.15em' }}
                  >
                    ALYANS
                  </span>
                  <span
                    className="text-xs font-light tracking-[0.3em] uppercase text-amber-500"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    PERDE
                  </span>
                </div>
              </div>
            </Link>
            <p
              className="text-stone-400 text-sm leading-relaxed mb-5"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('footer_brand_desc')}
            </p>

            {/* Language Switcher in footer */}
            <div className="mb-5">
              <LanguageSwitcher variant="footer" />
            </div>

            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/website_developer_ariful/' },
                { Icon: Facebook, href: 'https://web.facebook.com/profile.php?id=61585937835405' },
                { Icon: Twitter, href: 'https://x.com/arif_ahmed_wp' }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('footer_quick_links')}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t('nav_home'), href: '/' },
                { label: t('nav_shop'), href: '/shop' },
                { label: t('nav_about'), href: '/about' },
                { label: t('nav_contact'), href: '/contact' },
                { label: t('cart_title'), href: '/cart' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-white text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('footer_collections')}
            </h4>
            <ul className="space-y-3">
              {[
                t('collection_sheer'),
                t('collection_blackout'),
                t('collection_velvet'),
                t('collection_linen'),
              ].map(cat => (
                <li key={cat}>
                  <Link
                    to="/shop"
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-white text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('footer_contact')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+8801743566895"
                  className="flex items-center gap-3 text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Phone size={16} className="text-amber-500 flex-shrink-0" />
                  +880 1743-566895
                </a>
              </li>
              <li>
                <a
                  href="mailto:arifulprowp@gmail.com"
                  className="flex items-center gap-3 text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Mail size={16} className="text-amber-500 flex-shrink-0" />
                  arifulprowp@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801743566895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <MessageCircle size={16} className="text-amber-500 flex-shrink-0" />
                  {t('contact_whatsapp')}
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-stone-800 rounded-sm">
              <p
                className="text-xs text-stone-400 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Mon – Fri: 9AM – 6PM<br />
                Sat: 10AM – 4PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <p>{t('footer_rights')}</p>
            <div className="flex gap-6">
              <a href="javascript:void(0)" className="hover:text-stone-300 transition-colors">{t('footer_privacy')}</a>
              <a href="javascript:void(0)" className="hover:text-stone-300 transition-colors">{t('footer_terms')}</a>
              <a href="javascript:void(0)" className="hover:text-stone-300 transition-colors">{t('footer_shipping')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
