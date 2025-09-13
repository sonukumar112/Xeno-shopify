# PDF Insight App - Backend

This is the backend API server for the PDF Insight App, built with Node.js, Express, and MySQL.

## Features

- RESTful API endpoints for tenants, customers, and orders
- MySQL database integration with connection pooling
- Input validation using Joi
- Security middleware (Helmet, CORS, Rate Limiting)
- Error handling and logging
- Automatic customer statistics updates

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE pdf_insight_app;
```

2. Run the MySQL schema from the main project:
```sql
-- Copy and run the MySQL schema provided in the main README
```

### 3. Environment Configuration

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pdf_insight_app

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get tenant by ID
- `GET /api/tenants/domain/:domain` - Get tenant by domain
- `GET /api/tenants/:id/metrics` - Get tenant metrics
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Customers
- `GET /api/customers/tenant/:tenantId` - Get customers by tenant
- `GET /api/customers/tenant/:tenantId/top` - Get top customers by tenant
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `GET /api/orders/tenant/:tenantId` - Get orders by tenant
- `GET /api/orders/tenant/:tenantId/recent` - Get recent orders by tenant
- `GET /api/orders/tenant/:tenantId/chart` - Get chart data for tenant
- `GET /api/orders/customer/:customerId` - Get orders by customer
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Database Models

### Tenant
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Tenant name
- `domain` (VARCHAR) - Unique domain
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Customer
- `id` (UUID) - Primary key
- `tenant_id` (UUID) - Foreign key to tenants
- `name` (VARCHAR) - Customer name
- `email` (VARCHAR) - Customer email
- `total_spent` (DECIMAL) - Total amount spent
- `order_count` (INT) - Number of orders
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Order
- `id` (UUID) - Primary key
- `tenant_id` (UUID) - Foreign key to tenants
- `customer_id` (UUID) - Foreign key to customers
- `order_number` (VARCHAR) - Unique order number
- `status` (ENUM) - Order status
- `total_amount` (DECIMAL) - Order total
- `item_count` (INT) - Number of items
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── middleware/
│   │   └── validation.js    # Validation middleware
│   ├── models/
│   │   ├── Tenant.js        # Tenant model
│   │   ├── Customer.js      # Customer model
│   │   └── Order.js         # Order model
│   ├── routes/
│   │   ├── tenants.js       # Tenant routes
│   │   ├── customers.js     # Customer routes
│   │   └── orders.js        # Order routes
│   └── server.js            # Main server file
├── package.json
└── README.md
```

### Adding New Features

1. Create model in `src/models/`
2. Create routes in `src/routes/`
3. Add validation schemas in `src/middleware/validation.js`
4. Register routes in `src/server.js`

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check network connectivity

### Port Conflicts
- Change `PORT` in `.env` file
- Ensure no other services are using the port

### CORS Issues
- Update `FRONTEND_URL` in `.env`
- Check frontend URL configuration
