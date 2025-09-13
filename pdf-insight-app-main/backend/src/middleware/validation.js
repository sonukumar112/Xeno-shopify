import Joi from 'joi';

// Validation schemas
export const tenantSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  domain: Joi.string().min(1).max(255).required()
});

export const customerSchema = Joi.object({
  tenant_id: Joi.string().required(),
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  total_spent: Joi.number().min(0).default(0),
  order_count: Joi.number().integer().min(0).default(0)
});

export const orderSchema = Joi.object({
  tenant_id: Joi.string().required(),
  customer_id: Joi.string().required(),
  order_number: Joi.string().min(1).max(255).required(),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
  total_amount: Joi.number().min(0).required(),
  item_count: Joi.number().integer().min(1).default(1)
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      error: 'Resource already exists'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource not found',
      error: 'Invalid foreign key reference'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
