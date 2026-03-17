import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

const teamMembers = [
  { name: 'Ariful Islam', roleKey: 'Founder & Creative Director', image: 'https://i.imgur.com/NdkYWkY.jpg' },
  { name: 'James Shek',   roleKey: 'Head of Design',              image: 'https://i.imgur.com/4EDbtKl.jpg' },
  { name: 'Amelian',      roleKey: 'Fabric Curator',              image: 'https://i.imgur.com/eSnpKnn.jpg' },
];

const About: React.FC = () => {
  const { t, dir } = useLanguage();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const visibleCount = 3;
  const maxIdx = galleryImages.length - visibleCount;

  const prevGallery = () => setGalleryIdx(i => Math.max(0, i - 1));
  const nextGallery = () => setGalleryIdx(i => Math.min(maxIdx, i + 1));

  return (
    <main className="min-h-screen" dir={dir}>

      {/* Hero */}
      <div
        className="relative py-28 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2316 50%, #1a1a1a 100%)' }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://i.imgur.com/mkEsxKu.jpg"
            alt="Alyans Perde curtain collection"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <p
            className="text-amber-300 tracking-[0.3em] text-xs uppercase mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('about_page_tag')}
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-white mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('about_page_title')} <span style={{ color: '#e8d48b', fontStyle: 'italic' }}>{t('about_page_brand')}</span>
          </h1>
          <p
            className="text-white/60 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}
          >
            {t('about_page_subtitle')}
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('about_story_tag')}
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-stone-800 mb-6 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('about_story_title')}
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>
              <p>{t('about_story_p1')}</p>
              <p>{t('about_story_p2')}</p>
              <p>{t('about_story_p3')}</p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://i.imgur.com/BL5fB2r.jpg"
              alt="Alyans Perde showroom"
              className="rounded-sm w-full h-[500px] object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-sm" style={{ maxWidth: '200px' }}>
              <p className="text-4xl font-light gold-text" style={{ fontFamily: 'Cormorant Garamond, serif' }}>2009</p>
              <p className="text-xs text-stone-500 tracking-wider mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Year Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('about_values_tag')}
            </p>
            <h2 className="text-4xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('about_values_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { titleKey: 'value1_title', descKey: 'value1_desc' },
              { titleKey: 'value2_title', descKey: 'value2_desc' },
              { titleKey: 'value3_title', descKey: 'value3_desc' },
              { titleKey: 'value4_title', descKey: 'value4_desc' },
            ].map(val => (
              <div
                key={val.titleKey}
                className="bg-white p-8 rounded-sm border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
              >
                <span className="text-amber-500 text-xl mb-4 block" style={{ fontFamily: 'Cormorant Garamond, serif' }}>✦</span>
                <h3 className="text-xl font-medium text-stone-800 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {t(val.titleKey)}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {t(val.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Slider */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('about_gallery_tag')}
            </p>
            <h2 className="text-4xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('about_gallery_title')}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevGallery}
              disabled={galleryIdx === 0}
              className="w-10 h-10 border border-stone-300 rounded-full flex items-center justify-center text-stone-600 hover:border-amber-400 hover:text-amber-600 transition-all disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextGallery}
              disabled={galleryIdx >= maxIdx}
              className="w-10 h-10 border border-stone-300 rounded-full flex items-center justify-center text-stone-600 hover:border-amber-400 hover:text-amber-600 transition-all disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500"
            style={{ transform: `translateX(calc(-${galleryIdx} * (33.333% + 0.5rem)))` }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 aspect-square overflow-hidden rounded-sm bg-stone-100"
                style={{ width: 'calc(33.333% - 0.75rem)' }}
              >
                <img
                  src={img}
                  alt={`${t('about_gallery_title')} ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2316 50%, #1a1a1a 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '15+',    label: t('about_experience') },
            { num: '2,000+', label: t('about_designs') },
            { num: '15K+',   label: t('about_customers') },
            { num: '50+',    label: t('about_countries') },
          ].map(stat => (
            <div key={stat.label}>
              <p
                className="font-light mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#e8d48b' }}
              >
                {stat.num}
              </p>
              <p className="text-white/60 text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('about_team_tag')}
          </p>
          <h2 className="text-4xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('about_team_title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {teamMembers.map(member => (
            <div key={member.name} className="text-center group">
              <div className="relative w-36 h-36 mx-auto mb-4 overflow-hidden rounded-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/0 group-hover:border-amber-400/60 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {member.name}
              </h3>
              <p className="text-xs text-stone-400 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {member.roleKey}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-50 border-y border-amber-100">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-4xl font-light text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('about_cta_title')}
          </h2>
          <p className="text-stone-500 mb-8 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('about_cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('about_cta_btn')} <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="btn-outline-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('cta_btn2')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
