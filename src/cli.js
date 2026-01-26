#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VERSION = '1.0.0';
const BANNER = `Applicant Profile Protocol (APP) v${VERSION}\nhttps://app-protocol.org\n`;

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(BANNER);
  process.exit(0);
}

function run(script, args) {
  const scriptPath = join(__dirname, script);
  const res = spawnSync(process.execPath, [scriptPath, ...args], { stdio: 'inherit' });
  process.exitCode = res.status;
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case 'validate':
    run('validate.js', rest);
    break;
  case 'export:jsonresume':
    run('exporters/jsonresume.js', rest);
    break;
  case 'export:europass':
    run('exporters/europass.js', rest);
    break;
  case 'export:hrxml':
    run('exporters/hrxml.js', rest);
    break;
  case 'export:jsonld':
    run('exporters/jsonld.js', rest);
    break;
  default:
    console.log(BANNER);
    console.error('Usage: app <validate|export:jsonresume|export:europass|export:hrxml|export:jsonld> <input.json>');
    process.exit(2);
}
