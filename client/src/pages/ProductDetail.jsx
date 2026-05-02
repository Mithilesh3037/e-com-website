import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, CheckCircle, XCircle, Star } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Spinner size="lg" text="Loading product..." />;
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="page-container animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden bg-dark-700 border border-white/5 aspect-square">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600'; }}
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/20 mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-white">${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <p className="text-gray-400 leading-relaxed">{product.description}</p>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Quantity:</span>
              <div className="flex items-center gap-2 bg-dark-600 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-dark-500 hover:bg-dark-400 text-white font-bold transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-8 text-center text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-dark-500 hover:bg-dark-400 text-white font-bold transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300
              ${product.stock === 0
                ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                : 'btn-primary !py-4 !text-base'
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
            {[
              { icon: Package, label: 'Free Shipping', sub: 'On orders over $50' },
              { icon: CheckCircle, label: 'Easy Returns', sub: '30-day return policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-dark-600/50">
                <Icon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
