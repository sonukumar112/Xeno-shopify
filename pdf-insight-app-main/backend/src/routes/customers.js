import express from 'express';
import { Customer } from '../models/Customer.js';
import { validate, customerSchema } from '../middleware/validation.js';

const router = express.Router();

// GET /api/customers/tenant/:tenantId - Get customers by tenant
router.get('/tenant/:tenantId', async (req, res, next) => {
  try {
    const customers = await Customer.getByTenant(req.params.tenantId);
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/tenant/:tenantId/top - Get top customers by tenant
router.get('/tenant/:tenantId/top', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const customers = await Customer.getTopByTenant(req.params.tenantId, limit);
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id - Get customer by ID
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/customers - Create new customer
router.post('/', validate(customerSchema), async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', validate(customerSchema), async (req, res, next) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const updatedCustomer = await customer.update(req.body);
    res.json({
      success: true,
      data: updatedCustomer
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    await customer.delete();
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
