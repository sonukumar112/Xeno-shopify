# PDF Insight App - Full Stack Setup Guide

This guide will help you set up the complete PDF Insight App with React frontend, Node.js backend, and MySQL database.

## Project Structure

```
pdf-insight-app/
├── src/                    # React frontend
├── backend/               # Node.js backend
├── supabase/              # Database migrations (reference)
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE pdf_insight_app;
USE pdf_insight_app;
```

#### Run Database Schema
Execute the following MySQL schema in your database:

```sql
-- Create tenants table
CREATE TABLE tenants (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  order_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_tenant_email (tenant_id, email),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE orders (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  tenant_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  order_number VARCHAR(255) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  item_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_tenant_order (tenant_id, order_number),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Insert sample tenants
INSERT INTO tenants (name, domain) VALUES 
('Fashion Store Pro', 'fashion-store-pro.com'),
('Tech Gadgets Inc', 'tech-gadgets-inc.com'),
('Home & Garden Co', 'home-garden-co.com');

-- Insert sample customers for Fashion Store Pro
INSERT INTO customers (tenant_id, name, email, total_spent, order_count)
SELECT 
  t.id,
  customer_data.name,
  customer_data.email,
  customer_data.total_spent,
  customer_data.order_count
FROM tenants t
CROSS JOIN (
  SELECT 'Alice Johnson' as name, 'alice@example.com' as email, 2850.00 as total_spent, 8 as order_count
  UNION ALL SELECT 'Bob Smith', 'bob@example.com', 1920.50, 5
  UNION ALL SELECT 'Carol Davis', 'carol@example.com', 3200.75, 12
  UNION ALL SELECT 'David Wilson', 'david@example.com', 1150.25, 3
  UNION ALL SELECT 'Emma Brown', 'emma@example.com', 2780.90, 9
) AS customer_data
WHERE t.domain = 'fashion-store-pro.com';

-- Insert sample orders for Fashion Store Pro
INSERT INTO orders (tenant_id, customer_id, order_number, status, total_amount, item_count, created_at)
SELECT 
  t.id,
  c.id,
  order_data.order_number,
  order_data.status,
  order_data.total_amount,
  order_data.item_count,
  order_data.created_at
FROM tenants t
JOIN customers c ON c.tenant_id = t.id
CROSS JOIN (
  SELECT 'Alice Johnson' as customer_name, 'ORD-001' as order_number, 'delivered' as status, 299.99 as total_amount, 2 as item_count, DATE_SUB(NOW(), INTERVAL 1 DAY) as created_at
  UNION ALL SELECT 'Bob Smith', 'ORD-002', 'processing', 159.50, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)
  UNION ALL SELECT 'Carol Davis', 'ORD-003', 'shipped', 459.75, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)
  UNION ALL SELECT 'David Wilson', 'ORD-004', 'pending', 89.99, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)
  UNION ALL SELECT 'Emma Brown', 'ORD-005', 'delivered', 329.99, 2, DATE_SUB(NOW(), INTERVAL 5 DAY)
) AS order_data
WHERE t.domain = 'fashion-store-pro.com' 
  AND c.name = order_data.customer_name;

-- Create indexes for better performance
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
1. Copy the environment example:
```bash
cp env.example .env
```

2. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pdf_insight_app

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:3001`

### 3. Frontend Setup

#### Navigate to Root Directory
```bash
cd ..
```

#### Install Frontend Dependencies
```bash
npm install
```

#### Configure Environment
1. Copy the environment example:
```bash
cp env.example .env
```

2. Update `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Running the Application

### Start Both Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## API Endpoints

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/domain/:domain` - Get tenant by domain
- `GET /api/tenants/:id/metrics` - Get tenant metrics

### Customers
- `GET /api/customers/tenant/:tenantId` - Get customers by tenant
- `GET /api/customers/tenant/:tenantId/top` - Get top customers

### Orders
- `GET /api/orders/tenant/:tenantId` - Get orders by tenant
- `GET /api/orders/tenant/:tenantId/recent` - Get recent orders
- `GET /api/orders/tenant/:tenantId/chart` - Get chart data

## Features

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- Responsive dashboard
- Real-time data visualization
- Multi-tenant support

### Backend
- Node.js with Express
- MySQL database integration
- RESTful API design
- Input validation
- Security middleware
- Error handling
- Connection pooling

### Database
- Multi-tenant architecture
- Foreign key constraints
- Automatic timestamp updates
- Performance indexes
- Sample data included

## Troubleshooting

### Common Issues

#### Database Connection Failed
- Verify MySQL is running
- Check database credentials
- Ensure database exists
- Test connection manually

#### Backend Won't Start
- Check if port 3001 is available
- Verify all dependencies are installed
- Check environment variables

#### Frontend Can't Connect to Backend
- Verify backend is running
- Check CORS configuration
- Verify API URL in frontend .env

#### CORS Errors
- Update `FRONTEND_URL` in backend .env
- Check frontend URL configuration
- Verify both servers are running

### Port Conflicts
If you encounter port conflicts:

1. **Backend Port**: Change `PORT` in `backend/.env`
2. **Frontend Port**: Use `npm run dev -- --port 3000` (or any available port)

### Database Issues
1. **Reset Database**: Drop and recreate the database
2. **Check Permissions**: Ensure MySQL user has proper permissions
3. **Connection Pool**: Adjust pool settings in `backend/src/config/database.js`

## Development Tips

### Adding New Features
1. **Backend**: Add models, routes, and validation
2. **Frontend**: Update data service and components
3. **Database**: Add new tables/migrations

### Testing API
Use tools like Postman or curl to test API endpoints:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test tenants endpoint
curl http://localhost:3001/api/tenants
```

### Monitoring
- Check browser console for frontend errors
- Monitor backend console for server logs
- Use MySQL logs for database issues

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files with nginx
3. Configure environment variables

### Database
1. Optimize MySQL configuration
2. Set up regular backups
3. Monitor performance
4. Configure replication if needed

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Check console logs for errors
4. Ensure all services are running
5. Verify environment configuration
