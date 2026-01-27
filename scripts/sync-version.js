#!/usr/bin/env node

/**
 * Version synchronization script
 * Reads version from package.json and updates all project files
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read version from package.json
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const version = pkg.version;

console.log(`📦 Syncing version to ${version}...`);

// Update src/version.js
const versionFile = join(rootDir, 'src', 'version.js');
const versionContent = `/**
 * Single source of truth for APP version
 * Update this file when releasing a new version
 */

export const APP_VERSION = '${version}';
export const SCHEMA_VERSION = '1.0';
export const SPEC_VERSION = '${version}';
`;
writeFileSync(versionFile, versionContent);
console.log(`✓ Updated src/version.js`);

// Update SPEC.md
const specFile = join(rootDir, 'SPEC.md');
let specContent = readFileSync(specFile, 'utf-8');
specContent = specContent.replace(/Version: \d+\.\d+\.\d+/, `Version: ${version}`);
writeFileSync(specFile, specContent);
console.log(`✓ Updated SPEC.md`);

// Update public/index.html
const indexFile = join(rootDir, 'public', 'index.html');
let indexContent = readFileSync(indexFile, 'utf-8');
indexContent = indexContent.replace(
  /<span class="version">v[\d.]+<\/span>/,
  `<span class="version">v${version}</span>`
);
indexContent = indexContent.replace(
  /"version": "\d+\.\d+\.\d+",/,
  `"version": "${version}",`
);
writeFileSync(indexFile, indexContent);
console.log(`✓ Updated public/index.html`);

console.log(`\n✅ All files synced to version ${version}`);
console.log(`\nNote: Examples (examples/*.json) still use protocol version 1.0.0`);
console.log(`This is intentional - they reference the data format version, not the package version.`);
