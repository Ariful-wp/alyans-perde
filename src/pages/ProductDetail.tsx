import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Star, Shield, Truck, RotateCcw, ChevronRight, Plus, Minus } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-3xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Product Not Found
        </h2>
        <Link to="/shop" className="btn-gold px-8 py-3 text-xs tracking-widest uppercase rounded-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b border-stone-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-stone-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-amber-600 transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-stone-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-8"
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-stone-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge */}
            {product.badge && (
              <span
                className={`absolute top-4 left-4 px-3 py-1.5 text-white text-xs font-semibold rounded-sm ${
                  product.badge === 'Sale' ? 'bg-red-500' :
                  product.badge === 'New' ? 'bg-emerald-500' :
                  product.badge === 'Premium' ? 'bg-purple-600' :
                  'bg-amber-500'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                {product.badge}
              </span>
            )}
            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-500'} />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <p
              className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {product.category}
            </p>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-light text-stone-800 mb-4 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                (128 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-stone-100">
              <span
                className="text-4xl font-semibold gold-text"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-stone-400 line-through mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ${product.originalPrice}
                  </span>
                  <span className="text-sm text-red-500 font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p
                className="text-stone-600 leading-relaxed mb-8"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}
              >
                {product.description}
              </p>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-xs font-semibold text-stone-700 tracking-widest uppercase mb-3"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Color: <span className="font-normal text-stone-500">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs rounded-sm border transition-all ${
                        selectedColor === color
                          ? 'border-amber-500 gold-text bg-amber-50'
                          : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <p
                  className="text-xs font-semibold text-stone-700 tracking-widest uppercase mb-3"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Size: <span className="font-normal text-stone-500">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs rounded-sm border transition-all ${
                        selectedSize === size
                          ? 'border-amber-500 gold-text bg-amber-50'
                          : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-sm overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-stone-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span
                  className="px-5 text-base font-medium"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 hover:bg-stone-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-widest uppercase rounded-sm font-medium transition-all duration-300 ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'btn-gold'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
              >
                <ShoppingCart size={16} />
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex items-center justify-center gap-2 py-3.5 border border-stone-200 text-sm text-stone-600 hover:border-red-300 hover:text-red-500 transition-all rounded-sm mb-8"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
            >
              <Heart size={16} className={isWishlisted ? 'fill-red-400 text-red-400' : ''} />
              {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trust Icons */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-stone-50 rounded-sm">
              {[
                { icon: Truck, text: 'Free Shipping', sub: 'Over $200' },
                { icon: Shield, text: 'Warranty', sub: '2 Years' },
                { icon: RotateCcw, text: 'Returns', sub: '30 Days' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center text-center gap-1">
                  <Icon size={20} className="text-amber-500" />
                  <p className="text-xs font-semibold text-stone-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{text}</p>
                  <p className="text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-3xl font-light text-stone-800"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                You May Also Like
              </h2>
              <Link
                to="/shop"
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
