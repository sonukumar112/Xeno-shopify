import { executeQuery } from '../config/database.js';

export class Customer {
  constructor(data) {
    this.id = data.id;
    this.tenant_id = data.tenant_id;
    this.name = data.name;
    this.email = data.email;
    this.total_spent = data.total_spent;
    this.order_count = data.order_count;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Get customers by tenant
  static async getByTenant(tenantId) {
    const query = `
      SELECT * FROM customers 
      WHERE tenant_id = ? 
      ORDER BY total_spent DESC
    `;
    const rows = await executeQuery(query, [tenantId]);
    return rows.map(row => new Customer(row));
  }

  // Get top customers by tenant
  static async getTopByTenant(tenantId, limit = 5) {
    const query = `
      SELECT * FROM customers 
      WHERE tenant_id = ? 
      ORDER BY total_spent DESC 
      LIMIT ?
    `;
    const rows = await executeQuery(query, [tenantId, parseInt(limit)]);
    return rows.map(row => new Customer(row));
  }

  // Get customer by ID
  static async getById(id) {
    const query = 'SELECT * FROM customers WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Customer(rows[0]) : null;
  }

  // Create new customer
  static async create(data) {
    const query = `
      INSERT INTO customers (tenant_id, name, email, total_spent, order_count) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.tenant_id,
      data.name,
      data.email,
      data.total_spent || 0,
      data.order_count || 0
    ]);
    return await this.getById(result.insertId);
  }

  // Update customer
  async update(data) {
    const query = `
      UPDATE customers 
      SET name = ?, email = ?, total_spent = ?, order_count = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await executeQuery(query, [
      data.name,
      data.email,
      data.total_spent,
      data.order_count,
      this.id
    ]);
    return await Customer.getById(this.id);
  }

  // Delete customer
  async delete() {
    const query = 'DELETE FROM customers WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Update customer stats when order is created/updated
  static async updateStats(customerId) {
    const query = `
      UPDATE customers 
      SET 
        order_count = (SELECT COUNT(*) FROM orders WHERE customer_id = ?),
        total_spent = (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = ?),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await executeQuery(query, [customerId, customerId, customerId]);
  }
}
