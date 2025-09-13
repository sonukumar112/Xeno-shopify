import express from 'express';
import { Tenant } from '../models/Tenant.js';
import { validate, tenantSchema } from '../middleware/validation.js';

const router = express.Router();

// GET /api/tenants - Get all tenants
router.get('/', async (req, res, next) => {
  try {
    const tenants = await Tenant.getAll();
    res.json({
      success: true,
      data: tenants
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tenants/:id - Get tenant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const tenant = await Tenant.getById(req.params.id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tenants/domain/:domain - Get tenant by domain
router.get('/domain/:domain', async (req, res, next) => {
  try {
    const tenant = await Tenant.getByDomain(req.params.domain);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tenants/:id/metrics - Get tenant metrics
router.get('/:id/metrics', async (req, res, next) => {
  try {
    const tenant = await Tenant.getById(req.params.id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    
    const metrics = await tenant.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tenants - Create new tenant
router.post('/', validate(tenantSchema), async (req, res, next) => {
  try {
    const tenant = await Tenant.create(req.body);
    res.status(201).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tenants/:id - Update tenant
router.put('/:id', validate(tenantSchema), async (req, res, next) => {
  try {
    const tenant = await Tenant.getById(req.params.id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    
    const updatedTenant = await tenant.update(req.body);
    res.json({
      success: true,
      data: updatedTenant
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tenants/:id - Delete tenant
router.delete('/:id', async (req, res, next) => {
  try {
    const tenant = await Tenant.getById(req.params.id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }
    
    await tenant.delete();
    res.json({
      success: true,
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
