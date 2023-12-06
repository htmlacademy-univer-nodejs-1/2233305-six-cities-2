import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';

const PORT = 4000;
process.env['PORT'] = `${PORT}`;

export async function setup() {
  console.debug('setup');
  const {stdout, stderr} = await promisify(exec)('docker compose up -d');
  console.log(stdout);
  console.error(stderr);

  {
    spawn('npm', ['run', 'start'], {stdio: 'pipe'});

    await new Promise((resolve) => {
      setTimeout(resolve, 8_000);
    });
  }
}

export async function teardown() {
  console.debug('teardown');

  {
    const {stdout, stderr} = await promisify(exec)('docker compose down -v');
    console.log(stdout);
    console.error(stderr);
  }

  {
    const {stdout, stderr} = await promisify(exec)(`npx kill-port ${PORT}`);
    console.log(stdout);
    console.error(stderr);
  }
}
