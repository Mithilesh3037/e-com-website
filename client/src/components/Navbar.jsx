import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:shadow-primary-500/40 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NexShop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm">
              Store
            </Link>

            {user && (
              <Link to="/orders" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium text-sm">
                My Orders
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium text-sm flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-dark-600 border border-white/5 hover:border-primary-500/40 transition-all duration-300 group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-dark-600 border border-white/5 hover:border-primary-500/40 transition-all duration-300 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block text-sm text-gray-300 font-medium max-w-[100px] truncate">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-700 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span className={`badge mt-1 ${user.role === 'admin' ? 'bg-primary-500/20 text-primary-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Sign up</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-xl bg-dark-600 border border-white/5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-2 animate-fade-in">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Store</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">My Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-primary-400 hover:bg-white/5 rounded-xl transition-colors">Admin Dashboard</Link>}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
