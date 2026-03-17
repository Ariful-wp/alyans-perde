import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Shield, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = cartTotal >= 200 ? 0 : 14.99;
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const tax = (cartTotal - discount) * 0.08;
  const total = cartTotal - discount + shipping + tax;

  const handleCoupon = () => {
    if (coupon.toLowerCase() === 'curtains10' || coupon.toLowerCase() === 'welcome') {
      setCouponApplied(true);
    }
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2
            className="text-4xl font-light text-stone-800 mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Order Placed!
          </h2>
          <p
            className="text-stone-500 mb-8 text-sm leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Thank you for shopping with Curtains. Your order has been confirmed and you'll receive a confirmation email shortly.
          </p>
          <div className="bg-stone-50 rounded-sm p-5 mb-8 text-left">
            <p className="text-xs text-stone-500 tracking-wider mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>ORDER DETAILS</p>
            <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-stone-600">Order Number</span>
              <span className="text-stone-800 font-semibold">#CRT-{Math.floor(Math.random() * 90000) + 10000}</span>
            </div>
            <div className="flex justify-between text-sm mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-stone-600">Estimated Delivery</span>
              <span className="text-stone-800 font-semibold">5–7 Business Days</span>
            </div>
          </div>
          <Link
            to="/shop"
            className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-xs tracking-widest uppercase rounded-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div
        className="relative py-20 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ece4 100%)' }}
      >
        <p
          className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Review Your Selection
        </p>
        <h1
          className="text-5xl md:text-6xl font-light text-stone-800"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Your Cart
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-stone-400" />
            </div>
            <h3
              className="text-3xl font-light text-stone-700 mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Your Cart is Empty
            </h3>
            <p
              className="text-stone-400 mb-8 text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Discover our premium curtain collections and add your favorites.
            </p>
            <Link
              to="/shop"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-xs tracking-widest uppercase rounded-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Browse Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-light text-stone-800"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Trash2 size={13} /> Clear All
                </button>
              </div>

              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-5 p-5 bg-white border border-stone-100 rounded-sm shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link to={`/product/${item.id}`} className="w-24 h-28 flex-shrink-0 overflow-hidden rounded-sm bg-stone-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className="text-xs text-stone-400 uppercase tracking-wider mb-1"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem' }}
                        >
                          {item.category}
                        </p>
                        <Link to={`/product/${item.id}`}>
                          <h3
                            className="text-stone-800 font-medium hover:text-amber-600 transition-colors"
                            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        {item.selectedColor && (
                          <p className="text-xs text-stone-400 mt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Color: {item.selectedColor}
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-stone-300 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-stone-200 rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-stone-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="px-4 text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-stone-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-lg font-semibold gold-text"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            ${item.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors mt-2"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 sticky top-24">
                <h2
                  className="text-2xl font-light text-stone-800 mb-6 pb-4 border-b border-stone-100"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label
                    className="block text-xs text-stone-500 tracking-wider uppercase mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      placeholder="CURTAINS10"
                      disabled={couponApplied}
                      className="flex-1 px-3 py-2.5 border border-stone-200 text-sm rounded-sm outline-none focus:border-amber-400 transition-colors disabled:bg-stone-50 disabled:text-stone-400"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                    <button
                      onClick={handleCoupon}
                      disabled={couponApplied || !coupon}
                      className={`px-4 py-2.5 text-xs tracking-wider uppercase rounded-sm transition-all disabled:opacity-50 ${
                        couponApplied ? 'bg-green-500 text-white' : 'btn-outline-gold'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {couponApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <Tag size={11} /> 10% discount applied!
                    </p>
                  )}
                  {!couponApplied && (
                    <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Try: CURTAINS10 or WELCOME
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-800">${cartTotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span>Discount (10%)</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-stone-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500' : 'text-stone-800'}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span className="text-stone-500">Tax (8%)</span>
                    <span className="text-stone-800">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-stone-200">
                    <span
                      className="font-semibold text-stone-800"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}
                    >
                      Total
                    </span>
                    <span
                      className="font-bold gold-text"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {shipping > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-sm border border-amber-100">
                    <p className="text-xs text-amber-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Add ${(200 - cartTotal).toFixed(2)} more for <strong>FREE shipping</strong>!
                    </p>
                    <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min((cartTotal / 200) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="btn-gold w-full py-4 text-sm tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 mb-3 disabled:opacity-80"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
                >
                  {checkingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Trust */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-stone-50">
                  <div className="flex items-center gap-1 text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <Shield size={12} className="text-green-400" /> Secure Checkout
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <Truck size={12} className="text-blue-400" /> Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
