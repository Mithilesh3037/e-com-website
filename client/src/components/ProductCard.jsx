import { ShoppingCart, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card group animate-fade-in">
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-52">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge bg-primary-500/20 text-primary-300 backdrop-blur-sm border border-primary-500/20">
              {product.category}
            </span>
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-orange-500/20 text-orange-300 backdrop-blur-sm border border-orange-500/20">
                Only {product.stock} left
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-red-500/20 text-red-300 backdrop-blur-sm border border-red-500/20">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-white text-sm leading-tight hover:text-primary-300 transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-bold text-white">${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300 active:scale-95
              ${product.stock === 0
                ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-900/30'
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
