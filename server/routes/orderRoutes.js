const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/user', authMiddleware, getUserOrders);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
