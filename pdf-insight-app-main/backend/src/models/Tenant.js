import { executeQuery } from '../config/database.js';

export class Tenant {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.domain = data.domain;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Get all tenants
  static async getAll() {
    const query = 'SELECT * FROM tenants ORDER BY name';
    const rows = await executeQuery(query);
    return rows.map(row => new Tenant(row));
  }

  // Get tenant by ID
  static async getById(id) {
    const query = 'SELECT * FROM tenants WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Tenant(rows[0]) : null;
  }

  // Get tenant by domain
  static async getByDomain(domain) {
    const query = 'SELECT * FROM tenants WHERE domain = ?';
    const rows = await executeQuery(query, [domain]);
    return rows.length > 0 ? new Tenant(rows[0]) : null;
  }

  // Create new tenant
  static async create(data) {
    const query = `
      INSERT INTO tenants (name, domain) 
      VALUES (?, ?)
    `;
    const result = await executeQuery(query, [data.name, data.domain]);
    return await this.getById(result.insertId);
  }

  // Update tenant
  async update(data) {
    const query = `
      UPDATE tenants 
      SET name = ?, domain = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await executeQuery(query, [data.name, data.domain, this.id]);
    return await Tenant.getById(this.id);
  }

  // Delete tenant
  async delete() {
    const query = 'DELETE FROM tenants WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get tenant metrics
  async getMetrics() {
    const customerQuery = 'SELECT COUNT(*) as count FROM customers WHERE tenant_id = ?';
    const orderQuery = 'SELECT COUNT(*) as count FROM orders WHERE tenant_id = ?';
    const revenueQuery = 'SELECT SUM(total_amount) as total FROM orders WHERE tenant_id = ?';
    
    const [customers, orders, revenue] = await Promise.all([
      executeQuery(customerQuery, [this.id]),
      executeQuery(orderQuery, [this.id]),
      executeQuery(revenueQuery, [this.id])
    ]);

    const totalCustomers = parseInt(customers[0].count) || 0;
    const totalOrders = parseInt(orders[0].count) || 0;
    const totalRevenue = parseFloat(revenue[0].total) || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalCustomers,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2))
    };
  }
}
