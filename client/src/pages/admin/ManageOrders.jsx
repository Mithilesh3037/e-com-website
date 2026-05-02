import { useState, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor = {
  pending:    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  shipped:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
  delivered:  'text-green-400 bg-green-500/10 border-green-500/20',
  cancelled:  'text-red-400 bg-red-500/10 border-red-500/20',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order #${orderId} → ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <Spinner text="Loading orders..." />;

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => setFilter('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-dark-600 text-gray-400 border border-white/5 hover:border-primary-500/30'}`}>
          All ({orders.length})
        </button>
        {statuses.map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                ${filter === s ? 'bg-primary-600 text-white' : 'bg-dark-600 text-gray-400 border border-white/5 hover:border-primary-500/30'}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">No orders with this status</div>
        )}
        {filtered.map((order) => {
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="card !p-0 overflow-hidden">
              <div
                className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-white">Order #{order.id}</span>
                    <span className="text-gray-400 text-sm">{order.User?.name} · {order.User?.email}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">${parseFloat(order.totalPrice).toFixed(2)}</span>

                  {/* Status dropdown */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-sm font-medium cursor-pointer focus:outline-none transition-colors ${statusColor[order.status]} bg-transparent`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s} className="bg-dark-700 text-white capitalize">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                  </div>

                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-white/5 p-5 animate-fade-in">
                  {order.shippingAddress && (
                    <div className="mb-4 p-3 rounded-xl bg-dark-600/50 border border-white/5 text-sm">
                      <span className="text-gray-400 font-medium">Ship to: </span>
                      <span className="text-gray-300">{order.shippingAddress}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {order.OrderItems?.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-600/30">
                        <img src={item.Product?.image} alt={item.Product?.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.Product?.title}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <span className="text-white font-semibold text-sm">
                          ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </span>
                      </div>
                    ))}
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

export default ManageOrders;
