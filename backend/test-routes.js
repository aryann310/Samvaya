async function runTests() {
  const base = 'http://127.0.0.1:5000';
  const endpoints = [
    { name: 'Health Check', url: `${base}/health`, method: 'GET' },
    { name: 'Team Collaborators', url: `${base}/api/team`, method: 'GET' },
    { name: 'Root Dashboard', url: `${base}/api/dashboard`, method: 'GET' },
    { name: 'Root Finances', url: `${base}/api/finances`, method: 'GET' },
    { name: 'Root Hyperlocal', url: `${base}/api/hyperlocal`, method: 'GET' },
    { name: 'Root Schemes', url: `${base}/api/schemes`, method: 'GET' },
    { name: 'V2 Business', url: `${base}/api/v2/business/biz-001`, method: 'GET' },
    { name: 'V2 Dashboard', url: `${base}/api/v2/dashboard/biz-001`, method: 'GET' },
    { name: 'V2 Finance', url: `${base}/api/v2/finance/biz-001`, method: 'GET' },
    { name: 'V2 Cashflow', url: `${base}/api/v2/cashflow/biz-001`, method: 'GET' },
    { name: 'V2 Inventory', url: `${base}/api/v2/inventory/biz-001`, method: 'GET' },
    { name: 'V2 Hyperlocal', url: `${base}/api/v2/hyperlocal/biz-001`, method: 'GET' },
    { name: 'V2 Schemes', url: `${base}/api/v2/schemes`, method: 'GET' },
    { name: 'V2 Reports', url: `${base}/api/v2/reports/biz-001`, method: 'GET' },
    { name: 'V2 Financing', url: `${base}/api/v2/financing/biz-001`, method: 'GET' },
    { 
      name: 'V2 AI Advisor', 
      url: `${base}/api/v2/ai/advisor`, 
      method: 'POST', 
      body: { message: 'diwali fertilizer stock', businessId: 'biz-001', lang: 'en' } 
    },
    { 
      name: 'DigiLocker Initiate', 
      url: `${base}/api/digilocker/initiate`, 
      method: 'POST', 
      body: { userId: 'usr-test-01', documentType: 'PAN', platform: 'web' } 
    }
  ];

  console.log('--- STARTING ROUTE VALIDATION ---');
  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const opts = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (ep.body) opts.body = JSON.stringify(ep.body);

      const res = await fetch(ep.url, opts);
      const data = await res.json();
      if (res.ok) {
        console.log(`[PASS] ${ep.name} (${res.status})`);
        passed++;
      } else {
        console.log(`[FAIL] ${ep.name} (${res.status}):`, data);
        failed++;
      }
    } catch (err) {
      console.log(`[ERROR] ${ep.name}:`, err.message);
      failed++;
    }
  }

  console.log(`--- SUMMARY: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
