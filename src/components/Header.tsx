import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { t, dir } = useLanguage();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const navLinks = [
    { label: t('nav_home'),    href: '/' },
    { label: t('nav_shop'),    href: '/shop' },
    { label: t('nav_about'),   href: '/about' },
    { label: t('nav_contact'), href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      <header
        dir={dir}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gold-gradient rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>A</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className="text-xl font-semibold tracking-widest text-stone-800 group-hover:text-stone-600 transition-colors"
                    style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.15em' }}
                  >
                    ALYANS
                  </span>
                  <span
                    className="text-xs font-light tracking-[0.3em] uppercase text-amber-600 group-hover:text-amber-500 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    PERDE
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link text-sm font-medium tracking-widest uppercase transition-colors ${
                    isActive(link.href) ? 'gold-text active' : 'text-stone-700 hover:text-stone-900'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher variant="header" />
              </div>

              {/* Search */}
              <div className="relative hidden sm:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={t('search_placeholder')}
                      className="w-44 md:w-52 px-3 py-1.5 text-sm border border-stone-300 rounded-sm outline-none focus:border-amber-500 transition-colors bg-white"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                    <button
                      type="submit"
                      className="ml-1 p-1.5 gold-gradient text-white rounded-sm hover:opacity-90 transition-opacity"
                    >
                      <Search size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="ml-1 p-1 text-stone-500 hover:text-stone-700"
                    >
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-stone-600 hover:text-amber-600 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-amber-600 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 gold-gradient rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Shop Button */}
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1 btn-gold px-4 py-2 text-xs tracking-widest uppercase rounded-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('nav_shop_btn')}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-stone-100 px-4 py-6 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`block text-sm font-medium tracking-widest uppercase py-2 border-b border-stone-50 ${
                  isActive(link.href) ? 'gold-text' : 'text-stone-700'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 pt-1">
              <LanguageSwitcher variant="header" />
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-sm outline-none focus:border-amber-500 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
              <button type="submit" className="btn-gold px-4 py-2 rounded-sm text-xs">
                <Search size={16} />
              </button>
            </form>
            <Link
              to="/shop"
              className="block text-center btn-gold px-5 py-3 text-xs tracking-widest uppercase rounded-sm mt-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('nav_shop_btn')}
            </Link>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-[68px]" />
    </>
  );
};

export default Header;
