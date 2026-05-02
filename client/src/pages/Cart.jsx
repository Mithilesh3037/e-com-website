import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-dark-700 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
            <ShoppingCart className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some products to get started!</p>
          <Link to="/" className="btn-primary flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <button onClick={clearCart} className="btn-danger text-sm">Clear Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card !p-4 flex items-center gap-4 animate-slide-up">
              <Link to={`/products/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 hover:opacity-80 transition-opacity"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200'; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`}>
                  <h3 className="font-semibold text-white text-sm line-clamp-2 hover:text-primary-300 transition-colors">{item.title}</h3>
                </Link>
                <p className="text-primary-400 font-bold mt-1">${parseFloat(item.price).toFixed(2)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 bg-dark-600 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-dark-500 hover:bg-dark-400 text-white transition-colors flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-white font-semibold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-7 h-7 rounded-lg bg-dark-500 hover:bg-dark-400 text-white transition-colors flex items-center justify-center disabled:opacity-40"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right hidden sm:block min-w-[80px]">
                <p className="text-white font-bold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-bold text-white text-lg mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400 truncate mr-2">{item.title} × {item.quantity}</span>
                  <span className="text-white font-medium flex-shrink-0">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Subtotal</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Shipping</span>
                <span className="text-green-400">{cartTotal > 50 ? 'Free' : '$4.99'}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-lg mt-3 pt-3 border-t border-white/5">
                <span>Total</span>
                <span>${(cartTotal + (cartTotal > 50 ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                Login to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link to="/" className="btn-secondary w-full flex items-center justify-center gap-2 mt-3">
              Continue Shopping
            </Link>

            {cartTotal <= 50 && (
              <p className="text-center text-xs text-gray-500 mt-4">
                Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
