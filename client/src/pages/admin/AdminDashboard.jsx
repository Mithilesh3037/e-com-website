import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Users, TrendingUp,
  ArrowRight, Clock, CheckCircle, Truck, XCircle
} from 'lucide-react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products?limit=100'),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data.products;

        const totalRevenue = orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

        const uniqueUsers = new Set(orders.map(o => o.userId)).size;

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          totalUsers: uniqueUsers,
          pending: orders.filter(o => o.status === 'pending').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  const statusColor = {
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    shipped: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'from-primary-600 to-primary-500', sub: 'All time' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-blue-600 to-blue-500', sub: `${stats.pending} pending` },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'from-green-600 to-green-500', sub: 'In catalog' },
    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'from-orange-600 to-orange-500', sub: 'Unique buyers' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your store performance</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary flex items-center gap-2 text-sm">
            <Package className="w-4 h-4" /> Products
          </Link>
          <Link to="/admin/orders" className="btn-primary flex items-center gap-2 text-sm">
            <ShoppingBag className="w-4 h-4" /> Orders
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card hover:scale-105 transition-transform duration-300">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <p className="text-3xl font-black text-white mt-1">{value}</p>
            <p className="text-gray-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { status: 'pending', icon: Clock, count: stats.pending, label: 'Pending' },
          { status: 'delivered', icon: CheckCircle, count: stats.delivered, label: 'Delivered' },
        ].map(({ status, icon: Icon, count, label }) => (
          <Link key={status} to="/admin/orders"
            className={`p-4 rounded-2xl border flex items-center gap-3 hover:scale-105 transition-transform ${statusColor[status]}`}>
            <Icon className="w-6 h-6" />
            <div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs opacity-70">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="text-left pb-3 font-medium">Order</th>
                <th className="text-left pb-3 font-medium">Customer</th>
                <th className="text-left pb-3 font-medium">Date</th>
                <th className="text-left pb-3 font-medium">Total</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 text-white font-medium">#{order.id}</td>
                  <td className="py-3 text-gray-300">{order.User?.name || 'N/A'}</td>
                  <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 text-white font-semibold">${parseFloat(order.totalPrice).toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`badge border ${statusColor[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
