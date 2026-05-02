require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const sequelize = require('../config/db');
const { Product, User } = require('../models');
const bcrypt = require('bcryptjs');

const products = [
  {
    title: 'Apple MacBook Pro 14"',
    price: 1999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    description: 'Powerful laptop with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for developers and creative professionals.',
    stock: 25,
    category: 'Electronics',
  },
  {
    title: 'Sony WH-1000XM5 Headphones',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    description: 'Industry-leading noise cancellation with crystal clear audio and 30-hour battery life.',
    stock: 40,
    category: 'Electronics',
  },
  {
    title: 'Nike Air Max 2024',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Iconic comfort meets modern style. Air cushioning technology for all-day wear.',
    stock: 80,
    category: 'Fashion',
  },
  {
    title: 'Samsung 4K OLED Smart TV 55"',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
    description: 'Brilliant 4K OLED display with Tizen OS, Dolby Atmos, and smart home integration.',
    stock: 15,
    category: 'Electronics',
  },
  {
    title: 'Leather Crossbody Bag',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    description: 'Genuine leather crossbody bag with multiple compartments. Elegant and practical.',
    stock: 55,
    category: 'Fashion',
  },
  {
    title: 'Instant Pot Duo 7-in-1',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    stock: 60,
    category: 'Home & Kitchen',
  },
  {
    title: 'iPhone 15 Pro Max',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500',
    description: 'The most powerful iPhone ever. Titanium design, A17 Pro chip, 48MP camera system.',
    stock: 30,
    category: 'Electronics',
  },
  {
    title: 'Yoga Mat Premium',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly and durable.',
    stock: 100,
    category: 'Sports',
  },
  {
    title: 'Wooden Bookshelf 5-Tier',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    description: 'Solid wood bookshelf with 5 spacious tiers. Modern design fits any home decor.',
    stock: 20,
    category: 'Home & Kitchen',
  },
  {
    title: 'Sunglasses Aviator Classic',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    description: 'UV400 polarized aviator sunglasses with stainless steel frame. Timeless style.',
    stock: 75,
    category: 'Fashion',
  },
  {
    title: 'Gaming Chair Ergonomic',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500',
    description: 'Racing-style gaming chair with lumbar support, adjustable armrests, and reclining back.',
    stock: 18,
    category: 'Electronics',
  },
  {
    title: 'Stainless Steel Water Bottle',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    description: 'Double-walled insulated bottle keeps drinks cold for 24h and hot for 12h. 32oz.',
    stock: 120,
    category: 'Sports',
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ force: true });
    console.log('✅ Tables created');

    const adminHash = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin User', email: 'admin@shop.com', password: adminHash, role: 'admin' });

    const userHash = await bcrypt.hash('user123', 10);
    await User.create({ name: 'John Doe', email: 'john@example.com', password: userHash, role: 'user' });

    await Product.bulkCreate(products);

    console.log('✅ Seeded 12 products and 2 users');
    console.log('');
    console.log('  Admin → admin@shop.com  / admin123');
    console.log('  User  → john@example.com / user123');
    console.log('');
    console.log('🚀 Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
