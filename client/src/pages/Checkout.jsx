import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', state: '', zip: '', country: '',
  });

  const shipping = cartTotal > 50 ? 0 : 4.99;
  const total = cartTotal + shipping;

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.street || !address.city) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const shippingAddress = `${address.fullName}, ${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;

      await API.post('/orders', { items, shippingAddress });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-container animate-fade-in max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Review' }].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${step >= n ? 'bg-primary-600 text-white' : 'bg-dark-600 text-gray-400'}`}>
              {step > n ? <CheckCircle className="w-4 h-4" /> : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            {n < 2 && <div className={`w-12 h-0.5 mx-1 ${step > n ? 'bg-primary-600' : 'bg-dark-600'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {step === 1 && (
            <div className="card animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-bold text-white">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                  <input className="input-field" placeholder="John Doe" value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Street Address *</label>
                  <input className="input-field" placeholder="123 Main Street" value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">City *</label>
                    <input className="input-field" placeholder="New York" value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">State</label>
                    <input className="input-field" placeholder="NY" value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">ZIP Code</label>
                    <input className="input-field" placeholder="10001" value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Country</label>
                    <input className="input-field" placeholder="United States" value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full !py-3.5 mt-2">
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-bold text-white">Payment</h2>
              </div>

              <div className="p-4 rounded-xl bg-dark-600/50 border border-white/5 mb-6">
                <p className="text-sm font-medium text-gray-300 mb-1">Shipping to:</p>
                <p className="text-gray-400 text-sm">{address.fullName}, {address.street}, {address.city}, {address.state} {address.zip}</p>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-400">💳 Demo Mode — No real payment required</p>
                <div className="input-field text-gray-500">4242 4242 4242 4242</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="input-field text-gray-500">12/26</div>
                  <div className="input-field text-gray-500">123</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Place Order`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card h-fit sticky top-24">
          <h3 className="font-bold text-white mb-4">Order Items ({cartItems.length})</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-white flex-shrink-0">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span><span className="text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-white/5">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
