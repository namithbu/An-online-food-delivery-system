import axios from 'axios';

const url = process.env.URL || 'http://localhost:4000';

(async () => {
  try {
    const email = `test_user_${Date.now()}@example.com`;
    const password = 'TestPass123';

    console.log('Registering user:', email);
    const register = await axios.post(`${url}/api/user/register`, {
      name: 'Functional Test',
      email,
      password,
      role: 'customer'
    });

    if (!register.data || !register.data.token) {
      console.error('Register failed:', register.data);
      process.exit(1);
    }

    console.log('Register succeeded. Logging in...');
    const login = await axios.post(`${url}/api/user/login`, {
      email,
      password,
      role: 'customer'
    });

    if (!login.data || !login.data.token) {
      console.error('Login failed:', login.data);
      process.exit(1);
    }

    console.log('Login succeeded, token:', login.data.token.slice(0, 20) + '...');
    console.log('Signup/Login functional test: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Error in signup_login.test.js', err.message || err);
    process.exit(1);
  }
})();
