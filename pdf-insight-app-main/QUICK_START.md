# 🚀 Quick Start Guide - PDF Insight App

This guide will help you get the full-stack application running quickly.

## ⚡ Quick Setup (5 minutes)

### 1. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE pdf_insight_app;
USE pdf_insight_app;

# Run the schema (copy from SETUP.md)
# Then run the dummy data script
```

### 2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your MySQL credentials:
# DB_PASSWORD=your_mysql_password

# Start backend server
npm run dev
```

### 3. **Frontend Setup**
```bash
# In root directory
npm install

# Create environment file
cp env.example .env
# VITE_API_URL=http://localhost:3001/api

# Start frontend
npm run dev
```

### 4. **Test the Application**
1. Open http://localhost:5173
2. Click "Fashion Store Pro" demo button
3. You should see the dashboard with data!

## 🔧 Troubleshooting

### Backend Issues
- **Database Connection Failed**: Check MySQL is running and credentials in `backend/.env`
- **Port 3001 in use**: Change `PORT=3002` in `backend/.env`

### Frontend Issues
- **No data loading**: Check browser console for API errors
- **CORS errors**: Verify `FRONTEND_URL` in `backend/.env`

### Database Issues
- **No data**: Run the dummy data SQL script
- **Connection errors**: Check MySQL service is running

## 📊 Expected Data

After setup, you should see:
- **8 Tenants** (Fashion Store Pro, Tech Gadgets Inc, etc.)
- **40+ Customers** across all tenants
- **100+ Orders** with realistic data
- **Dashboard metrics** showing revenue, customers, orders

## 🎯 Demo Accounts

Use these demo buttons on login:
- **Fashion Store Pro** - Shows fashion store data
- **Tech Gadgets Inc** - Shows tech store data  
- **Home & Garden Co** - Shows home & garden data

## 🐛 Debug Mode

The app now includes extensive logging:
- Check browser console for API requests/responses
- Backend logs show database queries
- All errors are logged with details

## 📱 Features Working

✅ **Multi-tenant login system**
✅ **Dashboard with metrics**
✅ **Customer analytics**
✅ **Order tracking**
✅ **Chart visualizations**
✅ **Real-time data updates**

## 🆘 Still Having Issues?

1. **Check all services are running**:
   - MySQL: `mysql -u root -p`
   - Backend: `http://localhost:3001/health`
   - Frontend: `http://localhost:5173`

2. **Check environment files**:
   - `backend/.env` - Database config
   - `.env` - API URL config

3. **Check browser console** for detailed error messages

4. **Verify database has data**:
   ```sql
   USE pdf_insight_app;
   SELECT COUNT(*) FROM tenants;
   SELECT COUNT(*) FROM customers;
   SELECT COUNT(*) FROM orders;
   ```

The application should now work end-to-end! 🎉
