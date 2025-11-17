import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tests = [
  'signup_login.test.js',
  'add_food.test.js',
  'add_to_cart.test.js',
  'cart_operations.test.js',
  'place_order.test.js',
  'payment.test.js',
  'list_orders.test.js',
  'remove_order.test.js'
];

const env = {
  ...process.env,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/savi_cart_test',
  URL: process.env.URL || 'http://localhost:4000',
  JWT_SECRET: process.env.JWT_SECRET || 'testsecret'
};

let passed = 0;
let failed = 0;
const results = [];

const runTest = (testName) => {
  return new Promise((resolve) => {
    const testPath = path.join(__dirname, testName);
    const proc = spawn('node', [testPath], { env, cwd: __dirname });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${testName} PASSED`);
        results.push({ test: testName, status: 'PASSED' });
        passed++;
      } else {
        console.log(`✗ ${testName} FAILED (exit code ${code})`);
        if (stdout) console.log(`  stdout: ${stdout.trim()}`);
        if (stderr) console.log(`  stderr: ${stderr.trim()}`);
        results.push({ test: testName, status: 'FAILED', stdout, stderr });
        failed++;
      }
      resolve();
    });
  });
};

(async () => {
  console.log('Starting functional tests...\n');
  
  for (const test of tests) {
    await runTest(test);
  }

  console.log(`\n\n=== SUMMARY ===`);
  console.log(`Total: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n=== FAILED TESTS ===');
    results.filter(r => r.status === 'FAILED').forEach(r => {
      console.log(`\n${r.test}:`);
      if (r.stdout) console.log(`  Output: ${r.stdout.substring(0, 200)}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
})();
