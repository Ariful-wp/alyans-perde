import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const badgeColor: Record<string, string> = {
    'Best Seller': 'bg-amber-500',
    'New': 'bg-emerald-500',
    'Premium': 'bg-purple-600',
    'Sale': 'bg-red-500',
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card group block">
      <div className="card-hover bg-white rounded-sm overflow-hidden border border-stone-100">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-stone-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-white text-xs font-semibold rounded-sm ${badgeColor[product.badge] || 'bg-stone-600'}`}
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em' }}
            >
              {product.badge}
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Heart
              size={14}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-500'}
            />
          </button>

          {/* Hover Overlay */}
          <div className="product-overlay absolute inset-0 bg-black/20 flex items-end justify-center pb-4 gap-2 px-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 ${
                addedFeedback
                  ? 'bg-emerald-500 text-white'
                  : 'btn-gold'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ShoppingCart size={13} />
              {addedFeedback ? '✓' : t('add_to_cart')}
            </button>
            <Link
              to={`/product/${product.id}`}
              className="w-10 h-10 bg-white flex items-center justify-center rounded-sm hover:bg-stone-100 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <Eye size={15} className="text-stone-700" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p
            className="text-xs text-stone-400 mb-1 uppercase tracking-wider"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem' }}
          >
            {product.category}
          </p>
          <h3
            className="text-stone-800 font-medium mb-2 leading-tight group-hover:text-amber-700 transition-colors"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-base font-semibold gold-text"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ${product.price}
            </span>
            {product.originalPrice && (
              <span
                className="text-sm text-stone-400 line-through"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span
                className="text-xs text-red-500 font-medium ml-auto"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
