const { Order, OrderItem, Product, User } = require('../models');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalPrice += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      await product.update({ stock: product.stock - item.quantity });
    }

    const order = await Order.create({
      userId: req.user.id,
      totalPrice: totalPrice.toFixed(2),
      shippingAddress,
    });

    for (const itemData of orderItemsData) {
      await OrderItem.create({ ...itemData, orderId: order.id });
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'title', 'image', 'price'] }],
        },
      ],
    });

    res.status(201).json({ message: 'Order placed successfully', order: fullOrder });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders/user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'title', 'image', 'price'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'title', 'price'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/orders/:id (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status });
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
