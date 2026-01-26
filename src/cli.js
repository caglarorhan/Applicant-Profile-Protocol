#!/usr/bin/env node
import { spawnSync } from 'child_process';

const VERSION = '1.0.0';
const BANNER = `Applicant Profile Protocol (APP) v${VERSION}\nhttps://app-protocol.org\n`;

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(BANNER);
  process.exit(0);
}

function run(cmd, args) {
  const res = spawnSync(process.execPath, [cmd, ...args], { stdio: 'inherit' });
  process.exitCode = res.status;
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case 'validate':
    run('src/validate.js', rest);
    break;
  case 'export:jsonresume':
    run('src/exporters/jsonresume.js', rest);
    break;
  case 'export:europass':
    run('src/exporters/europass.js', rest);
    break;
  case 'export:hrxml':
    run('src/exporters/hrxml.js', rest);
    break;
  case 'export:jsonld':
    run('src/exporters/jsonld.js', rest);
    break;
  default:
    console.log(BANNER);
    console.error('Usage: app <validate|export:jsonresume|export:europass|export:hrxml|export:jsonld> <input.json>');
    process.exit(2);
}
