const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = 'C:\\Users\\devfs\\Desktop\\ConfyTickets';
const customerConfig = path.join(rootDir, 'ngrok-customer.yml');
const adminConfig = path.join(rootDir, 'ngrok-admin.yml');

// Kill any existing Confy ngrok processes specifically (ports 3010 / 3020)
try {
  const stdout = execSync(
    'powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name = \'ngrok.exe\'\\" | Select-Object ProcessId, CommandLine | ConvertTo-Json"',
    { encoding: 'utf8' }
  );
  if (stdout && stdout.trim()) {
    const list = JSON.parse(stdout);
    const procs = Array.isArray(list) ? list : [list];
    for (const p of procs) {
      if (p.CommandLine && (p.CommandLine.includes('3010') || p.CommandLine.includes('3020') || p.CommandLine.includes('sandlot') || p.CommandLine.includes('basket'))) {
        console.log(`Killing old Confy ngrok PID ${p.ProcessId}`);
        try { process.kill(p.ProcessId); } catch {}
      }
    }
  }
} catch (e) {
  // ignore
}

function launchNgrok(name, port, url, configFile) {
  const args = [
    'http',
    String(port),
    '--url',
    url,
    '--pooling-enabled',
    '--config',
    configFile,
    '--log',
    'stdout',
    '--log-level',
    'info'
  ];

  console.log(`[${name}] Spawning: ngrok ${args.join(' ')}`);
  const proc = spawn('ngrok', args, {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  proc.stdout.on('data', (d) => {
    const lines = d.toString().split('\n');
    for (const line of lines) {
      if (line.includes('started tunnel') || line.includes('join connections') || line.includes('client session established')) {
        console.log(`[${name}] ${line.trim()}`);
      }
    }
  });

  proc.stderr.on('data', (d) => {
    console.error(`[${name} ERR] ${d.toString().trim()}`);
  });

  proc.on('exit', (code, sig) => {
    console.log(`[${name}] Exited with code ${code}, signal ${sig}. Restarting in 3s...`);
    setTimeout(() => launchNgrok(name, port, url, configFile), 3000);
  });

  return proc;
}

console.log('Starting ConfyTickets Ngrok Supervisor...');
launchNgrok('CUSTOMER', 3010, 'https://sandlot-phrase-daybreak.ngrok-free.dev', customerConfig);
launchNgrok('ADMIN', 3020, 'https://basket-scallop-consensus.ngrok-free.dev', adminConfig);

// Keep event loop alive
setInterval(() => {}, 10000);
