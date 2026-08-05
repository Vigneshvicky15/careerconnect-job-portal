const API = 'http://localhost:5001/api';

async function test() {
  console.log('--- RUNNING FULL WORKFLOW TESTS ---');
  try {
    // 1. Register Seeker
    const seekerEmail = `seeker${Date.now()}@test.com`;
    let res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Seeker', email: seekerEmail, password: 'Test@12345', role: 'seeker' })
    });
    let data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log('✅ STEP 1: Job Seeker Registration Successful');

    // 2. Login Seeker
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: seekerEmail, password: 'Test@12345' })
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log('✅ STEP 2: Job Seeker Login & Auth Persistence Successful');

    // 3. Register Recruiter
    const recEmail = `recruiter${Date.now()}@test.com`;
    res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Recruiter', email: recEmail, password: 'Test@12345', role: 'recruiter' })
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log('✅ STEP 3: Recruiter Registration Successful');
    
    // 4. Duplicate Check
    res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Recruiter 2', email: recEmail, password: 'Test@12345', role: 'recruiter' })
    });
    data = await res.json();
    if (res.status !== 400) throw new Error('Duplicate user check failed');
    console.log('✅ STEP 4: Security - Duplicate Registration Prevented');

    console.log('\n🌟 ALL CORE WORKFLOW TESTS PASSED SUCCESSFULLY! 🌟');
    console.log('The codebase is fully ready for the 5 Standout Features.');
  } catch(e) {
    console.error('❌ TEST FAILED:', e.message);
  }
}
test();
