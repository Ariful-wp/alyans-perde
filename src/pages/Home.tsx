import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { heroSlides, categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideTimer = () => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    slideTimerRef.current = setInterval(() => { goToNext(); }, 2000);
  };

  useEffect(() => {
    startSlideTimer();
    return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current); };
  }, [currentSlide]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (idx: number) => {
    if (isTransitioning || idx === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const featuredProducts = products.slice(0, 8);

  // Translated slide content
  const slideContent = [
    { title: t('slide1_title'), sub: t('slide1_sub'), desc: t('slide1_desc') },
    { title: t('slide2_title'), sub: t('slide2_sub'), desc: t('slide2_desc') },
    { title: t('slide3_title'), sub: t('slide3_sub'), desc: t('slide3_desc') },
  ];

  // Translated category names & descriptions
  const categoryTranslations: Record<string, { name: string; desc: string }> = {
    'Sheer Curtains':    { name: t('collection_sheer'),    desc: t('collection_sheer_desc') },
    'Blackout Curtains': { name: t('collection_blackout'), desc: t('collection_blackout_desc') },
    'Velvet Drapes':     { name: t('collection_velvet'),   desc: t('collection_velvet_desc') },
    'Linen & Cotton':    { name: t('collection_linen'),    desc: t('collection_linen_desc') },
  };

  return (
    <main dir={dir}>

      {/* ── Hero Slider ── */}
      <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 68px)', minHeight: '500px' }}>
        <div className="relative w-full h-full">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-all duration-700"
              style={{
                opacity: idx === currentSlide ? 1 : 0,
                transform: idx === currentSlide
                  ? 'translateX(0)'
                  : idx < currentSlide
                  ? 'translateX(-100%)'
                  : 'translateX(100%)',
                zIndex: idx === currentSlide ? 2 : 1,
              }}
            >
              <img
                src={slide.image}
                alt={slideContent[idx]?.title || slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 overlay-gradient" />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white max-w-3xl">
                  <p
                    className="text-amber-300 tracking-[0.3em] text-sm mb-4 uppercase"
                    style={{ fontFamily: 'Montserrat, sans-serif', opacity: idx === currentSlide ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}
                  >
                    {t('hero_tag')}
                  </p>
                  <h1
                    className="font-light mb-2 leading-tight"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(3rem, 8vw, 7rem)',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {slideContent[idx]?.title || slide.title}
                  </h1>
                  <h1
                    className="font-light italic mb-6 leading-tight"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(3rem, 8vw, 7rem)',
                      color: '#e8d48b',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {slideContent[idx]?.sub || slide.subtitle}
                  </h1>
                  <p
                    className="text-white/80 mb-8 max-w-xl mx-auto leading-relaxed"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}
                  >
                    {slideContent[idx]?.desc || slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      to="/shop"
                      className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase rounded-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('hero_cta')} <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase rounded-sm text-white border border-white/40 hover:border-white transition-all hover:bg-white/10"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('about_tag')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={goToPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-6 right-8 z-10 text-white/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck,     label: t('feat_free_shipping'), desc: t('feat_free_shipping_sub') },
              { icon: Shield,    label: t('feat_premium'),       desc: t('feat_premium_sub') },
              { icon: RotateCcw, label: t('feat_returns'),       desc: t('feat_returns_sub') },
              { icon: Star,      label: t('feat_support'),       desc: t('feat_support_sub') },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
                  <p className="text-xs text-stone-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('section_collections_sub')}
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('section_collections')}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-amber-400" />
            <div className="w-2 h-2 rotate-45 bg-amber-400" />
            <div className="h-px w-16 bg-amber-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const translated = categoryTranslations[cat.name] || { name: cat.name, desc: cat.description };
            return (
              <Link key={cat.id} to="/shop" className="group relative overflow-hidden rounded-sm aspect-[3/4] block">
                <img
                  src={cat.image}
                  alt={translated.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-amber-300 text-xs tracking-widest uppercase mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {cat.count} Designs
                  </p>
                  <h3 className="text-white text-xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {translated.name}
                  </h3>
                  <p className="text-white/70 text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {translated.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-amber-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {t('explore_collection')} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('section_featured_sub')}
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t('section_featured')}
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
            >
              {t('view_all')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 btn-gold px-8 py-3 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('view_all')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Video Section ── */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '400px' }}>
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/BYH0FAP8mws?autoplay=1&mute=1&loop=1&playlist=BYH0FAP8mws&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080&iv_load_policy=3&fs=0"
            title={t('video_title')}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute"
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '177.78vh', minWidth: '100%',
              height: '56.25vw', minHeight: '100%',
              border: 'none', pointerEvents: 'none',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-amber-300 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('video_tag')}
          </p>
          <h2
            className="text-white font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', lineHeight: '1.2' }}
          >
            {t('video_title')}<br />
            <span style={{ color: '#e8d48b', fontStyle: 'italic' }}>{t('video_title2')}</span>
          </h2>
          <p
            className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}
          >
            {t('video_desc')}
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 btn-gold px-8 py-4 text-sm tracking-widest uppercase rounded-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <Play size={14} /> {t('video_btn')}
          </Link>
        </div>
      </section>

      {/* ── About Snippet ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://i.imgur.com/AXH8ClI.jpg"
                alt="Alyans Perde curtain showcase"
                className="rounded-sm w-full h-64 md:h-80 object-cover"
              />
              <img
                src="https://i.imgur.com/UBAAMJg.jpg"
                alt="Alyans Perde curtain detail"
                className="rounded-sm w-full h-64 md:h-80 object-cover mt-10"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 gold-gradient text-white px-8 py-4 rounded-sm shadow-xl text-center whitespace-nowrap">
              <p className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>15+</p>
              <p className="text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('about_experience')}</p>
            </div>
          </div>

          <div className="pt-8 lg:pt-0">
            <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('about_tag')}
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-800 mb-6 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('about_title')} <br />
              <span className="italic gold-text">{t('about_title2')}</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-5" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>
              {t('about_desc1')}
            </p>
            <p className="text-stone-600 leading-relaxed mb-8" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>
              {t('about_desc2')}
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              {[
                ['2,000+', t('about_designs')],
                ['15K+',   t('about_customers')],
                ['50+',    t('about_countries')],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-semibold gold-text" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{num}</p>
                  <p className="text-xs text-stone-500 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 btn-gold px-8 py-3.5 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('learn_more')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}
      >
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#c9a84c', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: '#c9a84c', transform: 'translate(30%, 30%)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber-300 tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('contact_tag')}
          </p>
          <h2
            className="text-white font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            {t('cta_title')} <span style={{ color: '#e8d48b' }}>{t('cta_title2')}</span>
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed max-w-xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>
            {t('cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-sm tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('cta_btn')} <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 text-sm tracking-widest uppercase rounded-sm text-white border border-white/30 hover:border-amber-400 hover:text-amber-400 transition-all"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('cta_btn2')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact Preview ── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('contact_tag')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-stone-800 mb-10" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('contact_title')} {t('contact_title2')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Phone,         label: t('contact_phone'),    value: '+1 (234) 567-8900',      href: 'tel:+1234567890',              color: 'bg-blue-50 text-blue-500' },
              { icon: Mail,          label: t('contact_email'),    value: 'hello@alyansperde.com',  href: 'mailto:hello@alyansperde.com', color: 'bg-amber-50 text-amber-500' },
              { icon: MessageCircle, label: 'WhatsApp',            value: t('contact_whatsapp'),    href: 'https://wa.me/1234567890',     color: 'bg-green-50 text-green-500' },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center gap-3 group"
              >
                <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs text-stone-400 tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
                <p className="text-stone-800 font-medium" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
