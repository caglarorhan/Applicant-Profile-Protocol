#!/usr/bin/env node
import { spawnSync } from 'child_process';

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
  default:
    console.error('Usage: app <validate|export:jsonresume|export:europass|export:hrxml> <input.json>');
    process.exit(2);
}
