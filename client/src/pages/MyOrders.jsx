import { useState, useEffect } from 'react';
import { Package, ChevronDown, Clock, Truck, CheckCircle, XCircle, Loader } from 'lucide-react';
import API from '../api/axios';
import Spinner from '../components/Spinner';

const statusConfig = {
  pending:    { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  processing: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Loader },
  shipped:    { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: Truck },
  delivered:  { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle },
  cancelled:  { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/user');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner text="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-dark-700 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
            <Package className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-gray-400">Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = cfg.icon;
          const isOpen = expanded === order.id;

          return (
            <div key={order.id} className="card !p-0 overflow-hidden animate-slide-up">
              {/* Order header */}
              <button
                className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-500/20">
                    <Package className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-white font-semibold">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <span className={`badge border ${cfg.color} flex items-center gap-1.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-white font-bold hidden sm:block">
                    ${parseFloat(order.totalPrice).toFixed(2)}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Order items */}
              {isOpen && (
                <div className="border-t border-white/5 p-5 animate-fade-in">
                  {order.shippingAddress && (
                    <div className="mb-4 p-3 rounded-xl bg-dark-600/50 border border-white/5">
                      <p className="text-xs font-medium text-gray-400 mb-1">Shipped to:</p>
                      <p className="text-sm text-gray-300">{order.shippingAddress}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {order.OrderItems?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.Product?.image}
                          alt={item.Product?.title}
                          className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.Product?.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-white font-semibold text-sm">
                          ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Order Total</span>
                    <span className="text-white font-bold text-lg">${parseFloat(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
