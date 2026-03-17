import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-600" />
            <h2
              className="text-lg font-medium text-stone-800"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Your Cart
            </h2>
            {cartItems.length > 0 && (
              <span className="text-xs text-stone-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center">
                <ShoppingBag size={32} className="text-stone-300" />
              </div>
              <p
                className="text-stone-500 text-center"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem' }}
              >
                Your cart is empty
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-gold px-6 py-2.5 text-xs tracking-widest uppercase rounded-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 py-4 border-b border-stone-50">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-medium text-stone-800 truncate"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-xs text-stone-500 mt-0.5"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="px-3 text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-semibold gold-text"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100 bg-stone-50/50">
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm text-stone-600"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Subtotal
              </span>
              <span
                className="text-lg font-semibold text-stone-900"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <p
              className="text-xs text-stone-400 mb-4 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Shipping & taxes calculated at checkout
            </p>
            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="flex items-center justify-center gap-2 btn-gold w-full py-3.5 text-xs tracking-widest uppercase rounded-sm mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              View Cart & Checkout
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => { clearCart(); }}
              className="w-full py-2 text-xs text-stone-400 hover:text-stone-600 transition-colors text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
