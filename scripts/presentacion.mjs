import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const frontendDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backendDir = resolve(frontendDir, '..', 'DSW-Backend');
const viteCli = resolve(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
const tsxCli = resolve(backendDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const frontendPort = 5174;
const backendPort = 3000;
const node = process.execPath;
const isWindows = process.platform === 'win32';

let backend;
let vite;
let tunnel;
let shuttingDown = false;
let restartingVite = false;

function hasEmptyFrontendApiUrl() {
  const env = readFileSync(resolve(frontendDir, '.env.local'), 'utf8');
  return /^\s*VITE_API_URL\s*=\s*["']?\s*["']?\s*$/m.test(env);
}

function hasNeonDatabaseUrl() {
  const env = readFileSync(resolve(backendDir, '.env'), 'utf8');
  const line = env.split(/\r?\n/).find((entry) => /^\s*DATABASE_URL\s*=/.test(entry));
  return Boolean(line && /neon\.tech/i.test(line));
}

function portInUse(port) {
  return new Promise((resolvePromise) => {
    const server = createServer();
    server.once('error', () => resolvePromise(true));
    server.listen(port, '127.0.0.1', () => server.close(() => resolvePromise(false)));
  });
}

async function waitForPortFree(port, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!(await portInUse(port))) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 200));
  }
  throw new Error(`El puerto ${port} sigue ocupado después de detener Vite.`);
}

async function waitForHttp(url, label, child, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`${label} terminó antes de quedar disponible.`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {
      // El servidor todavía está iniciando.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
  throw new Error(`${label} no respondió en ${timeoutMs / 1000} segundos.`);
}

function spawnNode(args, cwd, env = process.env, options = {}) {
  const child = spawn(node, args, {
    cwd,
    env,
    stdio: 'inherit',
    windowsHide: false,
    ...options,
  });
  child.once('error', (error) => {
    console.error(`No se pudo iniciar ${args[0]}: ${error.message}`);
    void shutdown(1);
  });
  return child;
}

function killTree(child) {
  if (!child || child.exitCode !== null) return Promise.resolve();
  return new Promise((resolvePromise) => {
    const finish = () => resolvePromise();
    child.once('exit', finish);
    if (isWindows) {
      const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      killer.once('error', () => child.kill());
    } else {
      child.kill('SIGTERM');
    }
    setTimeout(finish, 5000).unref();
  });
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  await Promise.all([killTree(tunnel), killTree(vite), killTree(backend)]);
  process.exit(exitCode);
}

function watchUnexpectedExit(child, label) {
  child.once('exit', (code) => {
    if (!shuttingDown && !restartingVite) {
      console.error(`${label} se detuvo (código ${code ?? 'desconocido'}).`);
      void shutdown(code ?? 1);
    }
  });
}

async function startVite(allowedHost) {
  const env = { ...process.env };
  if (allowedHost) env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS = allowedHost;
  vite = spawnNode(
    [viteCli, '--host', '0.0.0.0', '--port', String(frontendPort), '--strictPort'],
    frontendDir,
    env,
  );
  watchUnexpectedExit(vite, 'Vite');
  await waitForHttp(`http://127.0.0.1:${frontendPort}/`, 'Frontend', vite);
}

async function restartViteForTunnelHost(host) {
  if (restartingVite || shuttingDown) return;
  restartingVite = true;
  console.log(`\nPermitiendo solo el host del túnel: ${host}`);
  try {
    await killTree(vite);
    await waitForPortFree(frontendPort);
    await startVite(host);
    restartingVite = false;
    console.log(`\nListo para presentar: https://${host}`);
    console.log('Dejá esta terminal abierta. Presioná Ctrl+C al terminar.\n');
  } catch (error) {
    restartingVite = false;
    console.error(`No se pudo reiniciar Vite para el túnel: ${error.message}`);
    await shutdown(1);
  }
}

async function main() {
  if (!hasEmptyFrontendApiUrl()) {
    throw new Error('En DSW-Frontend/.env.local, VITE_API_URL debe estar vacío para usar el proxy local.');
  }
  if (!hasNeonDatabaseUrl()) {
    throw new Error('DATABASE_URL en DSW-Backend/.env no parece apuntar a Neon. Revisá la configuración antes de presentar.');
  }

  const busyPorts = [];
  for (const port of [backendPort, frontendPort]) {
    if (await portInUse(port)) busyPorts.push(port);
  }
  if (busyPorts.length) {
    throw new Error(`Los puertos ${busyPorts.join(', ')} ya están ocupados. Cerrá los servidores anteriores y volvé a ejecutar el comando.`);
  }

  console.log('Iniciando backend con Neon…');
  backend = spawnNode([tsxCli, 'watch', 'src/index.ts'], backendDir);
  watchUnexpectedExit(backend, 'Backend');
  await waitForHttp(`http://127.0.0.1:${backendPort}/`, 'Backend', backend);

  console.log('\nIniciando frontend con proxy a la API…');
  await startVite();
  await waitForHttp(`http://127.0.0.1:${frontendPort}/localities`, 'Proxy de la API', vite);

  console.log('\nSolicitando URL pública a Tunnelmole…');
  const command = isWindows ? 'cmd.exe' : 'npx';
  const args = isWindows
    ? ['/d', '/s', '/c', 'npx --yes tunnelmole 5174']
    : ['--yes', 'tunnelmole', '5174'];
  tunnel = spawn(command, args, {
    cwd: frontendDir,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
    windowsHide: false,
  });
  watchUnexpectedExit(tunnel, 'Tunnelmole');

  let output = '';
  let hostFound = false;
  const inspectOutput = (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    output = (output + text).slice(-20_000);
    if (hostFound) return;
    const match = output.match(/https?:\/\/([a-z0-9-]+\.tunnelmole\.net)/i);
    if (match) {
      hostFound = true;
      void restartViteForTunnelHost(match[1]);
    }
  };
  tunnel.stdout.on('data', inspectOutput);
  tunnel.stderr.on('data', inspectOutput);
  setTimeout(() => {
    if (!hostFound && !shuttingDown) {
      console.error('Tunnelmole no mostró una URL en 60 segundos.');
      void shutdown(1);
    }
  }, 60_000).unref();
}

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));

main().catch((error) => {
  console.error(`\nNo se pudo preparar la presentación: ${error.message}`);
  void shutdown(1);
});
