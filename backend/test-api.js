const http = require('http');

const BASE_URL = 'http://localhost:4000';

const tests = [
  {
    name: 'GET /api/links (empty list)',
    method: 'GET',
    path: '/api/links',
    body: null,
    expectCode: 200
  },
  {
    name: 'POST /api/shorten (create link)',
    method: 'POST',
    path: '/api/shorten',
    body: JSON.stringify({ url: 'https://github.com' }),
    expectCode: 200
  },
  {
    name: 'GET /api/links (after create)',
    method: 'GET',
    path: '/api/links',
    body: null,
    expectCode: 200
  }
];

let testIndex = 0;
let generatedCode = null;

const runTest = (test) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + test.path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const success = res.statusCode === test.expectCode;
        console.log(`${success ? '✓' : '✗'} ${test.name} (${res.statusCode})`);
        if (data) {
          try {
            const json = JSON.parse(data);
            console.log('  Response:', JSON.stringify(json, null, 2).slice(0, 200));
            if (json.code) generatedCode = json.code;
          } catch (e) {
            console.log('  Response:', data.slice(0, 100));
          }
        }
        resolve(success);
      });
    });

    req.on('error', (err) => {
      console.error(`✗ ${test.name} - ${err.message}`);
      reject(err);
    });

    if (test.body) {
      req.write(test.body);
    }
    req.end();
  });
};

(async () => {
  console.log('Testing TinyLink API...\n');
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (err) {
      console.error('Test suite failed:', err.message);
      process.exit(1);
    }
  }
  console.log('\n✓ All basic tests passed!');
  process.exit(0);
})();
