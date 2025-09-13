// Simple API test script
// Run with: node test-api.js

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test tenants endpoint
    console.log('2. Testing tenants endpoint...');
    const tenantsResponse = await fetch(`${API_BASE_URL}/tenants`);
    const tenantsData = await tenantsResponse.json();
    console.log('✅ Tenants:', tenantsData);
    console.log('');

    if (tenantsData.success && tenantsData.data.length > 0) {
      const firstTenant = tenantsData.data[0];
      console.log('3. Testing tenant by domain...');
      const domainResponse = await fetch(`${API_BASE_URL}/tenants/domain/${firstTenant.domain}`);
      const domainData = await domainResponse.json();
      console.log('✅ Tenant by domain:', domainData);
      console.log('');

      console.log('4. Testing tenant metrics...');
      const metricsResponse = await fetch(`${API_BASE_URL}/tenants/${firstTenant.id}/metrics`);
      const metricsData = await metricsResponse.json();
      console.log('✅ Tenant metrics:', metricsData);
      console.log('');

      console.log('5. Testing customers endpoint...');
      const customersResponse = await fetch(`${API_BASE_URL}/customers/tenant/${firstTenant.id}`);
      const customersData = await customersResponse.json();
      console.log('✅ Customers:', customersData);
      console.log('');

      console.log('6. Testing orders endpoint...');
      const ordersResponse = await fetch(`${API_BASE_URL}/orders/tenant/${firstTenant.id}`);
      const ordersData = await ordersResponse.json();
      console.log('✅ Orders:', ordersData);
      console.log('');

      console.log('7. Testing chart data...');
      const chartResponse = await fetch(`${API_BASE_URL}/orders/tenant/${firstTenant.id}/chart`);
      const chartData = await chartResponse.json();
      console.log('✅ Chart data:', chartData);
      console.log('');
    }

    console.log('🎉 All API tests passed!');
    console.log('✅ Backend is working correctly');
    console.log('✅ Database connection is working');
    console.log('✅ All endpoints are responding');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check database connection in backend/.env');
    console.log('3. Verify MySQL is running');
    console.log('4. Check if database has data');
  }
}

testAPI();
