import { executeQuery } from '../config/database.js';

export class Order {
  constructor(data) {
    this.id = data.id;
    this.tenant_id = data.tenant_id;
    this.customer_id = data.customer_id;
    this.order_number = data.order_number;
    this.status = data.status;
    this.total_amount = data.total_amount;
    this.item_count = data.item_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.customer_name = data.customer_name; // For joined queries
  }

  // Get orders by tenant
  static async getByTenant(tenantId) {
    const query = `
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.tenant_id = ? 
      ORDER BY o.created_at DESC
    `;
    const rows = await executeQuery(query, [tenantId]);
    return rows.map(row => new Order(row));
  }

  // Get recent orders by tenant
  static async getRecentByTenant(tenantId, limit = 5) {
    const query = `
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.tenant_id = ? 
      ORDER BY o.created_at DESC 
      LIMIT ?
    `;
    const rows = await executeQuery(query, [tenantId, parseInt(limit)]);
    return rows.map(row => new Order(row));
  }

  // Get orders by customer
  static async getByCustomer(customerId) {
    const query = `
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.customer_id = ? 
      ORDER BY o.created_at DESC
    `;
    const rows = await executeQuery(query, [customerId]);
    return rows.map(row => new Order(row));
  }

  // Get order by ID
  static async getById(id) {
    const query = `
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `;
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Order(rows[0]) : null;
  }

  // Create new order
  static async create(data) {
    const query = `
      INSERT INTO orders (tenant_id, customer_id, order_number, status, total_amount, item_count) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.tenant_id,
      data.customer_id,
      data.order_number,
      data.status,
      data.total_amount,
      data.item_count || 1
    ]);
    
    // Update customer stats
    const Customer = (await import('./Customer.js')).Customer;
    await Customer.updateStats(data.customer_id);
    
    return await this.getById(result.insertId);
  }

  // Update order
  async update(data) {
    const query = `
      UPDATE orders 
      SET status = ?, total_amount = ?, item_count = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await executeQuery(query, [
      data.status,
      data.total_amount,
      data.item_count,
      this.id
    ]);
    
    // Update customer stats
    const Customer = (await import('./Customer.js')).Customer;
    await Customer.updateStats(this.customer_id);
    
    return await Order.getById(this.id);
  }

  // Delete order
  async delete() {
    const query = 'DELETE FROM orders WHERE id = ?';
    await executeQuery(query, [this.id]);
    
    // Update customer stats
    const Customer = (await import('./Customer.js')).Customer;
    await Customer.updateStats(this.customer_id);
    
    return true;
  }

  // Get chart data for tenant (last 30 days)
  static async getChartData(tenantId) {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        COUNT(DISTINCT customer_id) as customers
      FROM orders 
      WHERE tenant_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const rows = await executeQuery(query, [tenantId]);
    
    // Fill in missing dates with zero values
    const chartData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = rows.find(row => row.date.toISOString().split('T')[0] === dateStr);
      
      chartData.push({
        date: dateStr,
        orders: dayData ? parseInt(dayData.orders) : 0,
        revenue: dayData ? Math.round(parseFloat(dayData.revenue)) : 0,
        customers: dayData ? parseInt(dayData.customers) : 0
      });
    }
    
    return chartData;
  }
}
