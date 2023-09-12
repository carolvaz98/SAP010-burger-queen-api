const path = require('path');
const childProcess = require("child_process");
const kill = require('tree-kill');

const config = require('../config');

const port = process.env.PORT || 8888;
const baseUrl = process.env.REMOTE_URL || `http://127.0.0.1:${port}`;

const __e2e = {
  port,
  baseUrl,
  adminUserCredentials: {
    email: config.adminEmail,
    password: config.adminPassword,
  },
  adminToken: null,
  testUserCredentials: {
    email: 'test4@test.test',
    password: '123456',
    role: 'admin'
  },
  testUserToken: null,
  childProcessPid: null,
  // in `testObjects` we keep track of objects created during the test run so
  // that we can clean up before exiting.
  // For example: ['users/foo@bar.baz', 'products/xxx', 'orders/yyy']
  // testObjects: [],
};

console.log('Credenciais de administrador:', __e2e.adminUserCredentials);

const fetch = (url, opts = {}) => { // import('node-fetch')
  // .then(({ default: fetch }) 
  // console.log(`${baseUrl}${url}`);

    console.log('token', __e2e.adminToken);
    return global.fetch(`${baseUrl}${url}`, {
    ...opts,
    headers: {
      'content-type': 'application/json',
      ...opts.headers,
    },
    ...(
      opts.body && typeof opts.body !== 'string'
        ? { body: JSON.stringify(opts.body) }
        : {}
    ),
  });
}

const fetchWithAuth = (token) => (url, opts = {}) => fetch(url, {
  ...opts,
  headers: {
    ...opts.headers,
    authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImNhcm9sdmFzQGhvdG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0NTQ1NTQxLCJleHAiOjE2OTQ1NTI3NDF9.dcX0YsLbnQXP1fVIpc6YPjkzBhQADpmswVoeJydYDVc`,
  },
});

const fetchAsAdmin = (url, opts) => fetchWithAuth(__e2e.adminToken)(url, opts);
const fetchAsTestUser = (url, opts) => fetchWithAuth(__e2e.testUserToken)(url, opts);

const createTestUser = () => fetchAsAdmin('/users/create', {
  method: 'POST',
  body: __e2e.testUserCredentials,
})
  .then((resp) => {
    console.log(resp)
      if (resp.status !== 201) {
      throw new Error('Could not create test user');
    }
    return fetch('/login', { method: 'POST', body: __e2e.testUserCredentials });
  })
  .then((resp) => {
    if (resp.status !== 200) {
      throw new Error('Could not authenticate test user');
    }
    return resp.json();
  })
  .then(({ token }) => Object.assign(__e2e, { testUserToken: token }));

const checkAdminCredentials = () => fetch('/login', {
  method: 'POST',
  body: __e2e.adminUserCredentials,
})
  .then((resp) => {
    if (resp.status !== 200) {
      throw new Error('Could not authenticate as admin user');
    }

    return resp.json();
  })
  .then(({ acessToken }) => Object.assign(__e2e, { adminToken: acessToken }));

const waitForServerToBeReady = (retries = 10) => new Promise((resolve, reject) => {
  if (!retries) {
    return reject(new Error('Server took to long to start'));
  }

  setTimeout(() => {
    fetch('/')
      .then((resp) => (
        (resp.status !== 200)
          ? reject(new Error(`GET / responded with ${resp.status}`))
          : resolve()
      ))
      .catch(() => waitForServerToBeReady(retries - 1).then(resolve, reject));
  }, 1000);
});

module.exports = () => new Promise((resolve, reject) => {
  if (process.env.REMOTE_URL) {
    console.info(`Running tests on remote server ${process.env.REMOTE_URL}`);
    return resolve();
  }

  // TODO: Configurar DB de tests

  console.info('Staring local server...');
  const child = childProcess.spawn('npm.cmd', ['start', process.env.PORT || 8888], {
    cwd: path.resolve(__dirname, '../'),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  Object.assign(__e2e, { childProcessPid: child.pid });

  child.stdout.on('data', (chunk) => {
    console.info(`\x1b[34m${chunk.toString()}\x1b[0m`);
  });

  child.stderr.on('data', (chunk) => {
    const str = chunk.toString();
    if (/DeprecationWarning/.test(str)) {
      return;
    }
    console.error('child::stderr', str);
  });

  process.on('uncaughtException', (err) => {
    console.error('UncaughtException!');
    console.error(err);
    kill(child.pid, 'SIGKILL', () => process.exit(1));
  });

  waitForServerToBeReady()
    .then(checkAdminCredentials)
    .then(createTestUser)
    .then(resolve)
    .catch((err) => {
      kill(child.pid, 'SIGKILL', () => reject(err));
    });
});

// Export globals - ugly... :-(
global.__e2e = __e2e;

// Export stuff to be used in tests!
process.baseUrl = baseUrl;
process.fetch = fetch;
process.fetchWithAuth = fetchWithAuth;
process.fetchAsAdmin = fetchAsAdmin;
process.fetchAsTestUser = fetchAsTestUser;
