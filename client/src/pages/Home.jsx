import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [search, category, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-800 via-dark-900 to-primary-950/30 border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-700/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Premium Shopping Experience
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Shop the Future,
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Delivered Today
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Discover curated products from top brands. Fast delivery, secure checkout, premium quality.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-dark-700/80 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-base"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-400">
            {[
              { icon: TrendingUp, label: '1000+ Products' },
              { icon: ShieldCheck, label: 'Secure Payments' },
              { icon: Sparkles, label: 'Premium Quality' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Category filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${(category === '' && cat === 'All') || category === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'bg-dark-600 text-gray-400 hover:text-white border border-white/5 hover:border-primary-500/30'
                }`}
            >
              {cat}
            </button>
          ))}
          {total > 0 && (
            <span className="ml-auto flex-shrink-0 text-gray-500 text-sm">{total} products</span>
          )}
        </div>

        {/* Product grid */}
        {loading ? (
          <Spinner text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-dark-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No products found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-dark-600 border border-white/5 disabled:opacity-40 hover:border-primary-500/40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200
                  ${p === page
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                    : 'bg-dark-600 text-gray-400 hover:text-white border border-white/5'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-dark-600 border border-white/5 disabled:opacity-40 hover:border-primary-500/40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
