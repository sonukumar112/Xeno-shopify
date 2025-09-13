import express from 'express';
import { Order } from '../models/Order.js';
import { validate, orderSchema } from '../middleware/validation.js';

const router = express.Router();

// GET /api/orders/tenant/:tenantId - Get orders by tenant
router.get('/tenant/:tenantId', async (req, res, next) => {
  try {
    const orders = await Order.getByTenant(req.params.tenantId);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/tenant/:tenantId/recent - Get recent orders by tenant
router.get('/tenant/:tenantId/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.getRecentByTenant(req.params.tenantId, limit);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/tenant/:tenantId/chart - Get chart data for tenant
router.get('/tenant/:tenantId/chart', async (req, res, next) => {
  try {
    const chartData = await Order.getChartData(req.params.tenantId);
    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/customer/:customerId - Get orders by customer
router.get('/customer/:customerId', async (req, res, next) => {
  try {
    const orders = await Order.getByCustomer(req.params.customerId);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create new order
router.post('/', validate(orderSchema), async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', validate(orderSchema), async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const updatedOrder = await order.update(req.body);
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res, next) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    await order.delete();
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
