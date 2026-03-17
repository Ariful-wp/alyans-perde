import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const allCategoryKeys = ['All', 'Sheer', 'Blackout', 'Velvet', 'Silk', 'Linen', 'Cotton', 'Jacquard'];

const Shop: React.FC = () => {
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { label: t('shop_sort_featured'),   value: 'featured' },
    { label: t('shop_sort_price_asc'),  value: 'price-asc' },
    { label: t('shop_sort_price_desc'), value: 'price-desc' },
    { label: t('shop_sort_name'),       value: 'name-asc' },
  ];

  const filtered = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [selectedCategory, sortBy, priceRange, searchQuery]);

  return (
    <main className="min-h-screen" dir={dir}>
      {/* Page Header */}
      <div
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ece4 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full" style={{ background: '#c9a84c', transform: 'translate(-40%, -40%)' }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full" style={{ background: '#c9a84c', transform: 'translate(30%, 30%)' }} />
        </div>
        <div className="relative">
          <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('shop_subtitle')}
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {searchQuery ? `"${searchQuery}"` : t('shop_title')}
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem' }}>
            {filtered.length} {t('shop_results')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {allCategoryKeys.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded-sm transition-all ${
                  selectedCategory === cat
                    ? 'btn-gold'
                    : 'border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {cat === 'All' ? t('shop_all') : cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-sm text-stone-700 hover:border-amber-400 transition-colors rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
            >
              <SlidersHorizontal size={14} />
              {t('shop_sort')}: {sortOptions.find(o => o.value === sortBy)?.label}
              <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 shadow-lg rounded-sm z-20 min-w-[200px]">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs hover:bg-stone-50 transition-colors ${
                      sortBy === opt.value ? 'gold-text font-semibold' : 'text-stone-600'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-8 p-4 bg-stone-50 rounded-sm flex flex-wrap items-center gap-6">
          <span className="text-xs text-stone-500 font-semibold tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('shop_price_range')}:
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>${priceRange[0]}</span>
            <input
              type="range" min={0} max={500} step={10}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-40 accent-amber-500"
            />
            <span className="text-xs text-stone-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>${priceRange[1]}</span>
          </div>
          {(selectedCategory !== 'All' || searchQuery || priceRange[1] < 500) && (
            <button
              onClick={() => { setSelectedCategory('All'); setPriceRange([0, 500]); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <X size={12} /> {t('shop_filter')}
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SlidersHorizontal size={28} className="text-stone-400" />
            </div>
            <h3 className="text-2xl font-light text-stone-700 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('shop_no_results')}
            </h3>
            <p className="text-stone-400 mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem' }}>
              {t('shop_no_results_sub')}
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setPriceRange([0, 500]); }}
              className="btn-gold px-8 py-3 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('shop_filter')}
            </button>
          </div>
        )}
      </div>

      {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
    </main>
  );
};

export default Shop;
