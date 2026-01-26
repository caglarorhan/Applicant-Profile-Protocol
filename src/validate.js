import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJSON(p) {
  const abs = path.resolve(p);
  return JSON.parse(fs.readFileSync(abs, 'utf-8'));
}

function validateFile(instancePath) {
  // Load schema from package directory, not cwd
  const schemaPath = path.join(__dirname, '..', 'schema', 'app.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const instance = loadJSON(instancePath);

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const ok = validate(instance);
  if (ok) {
    console.log(`valid: ${instancePath}`);
    process.exit(0);
  } else {
    console.error(`invalid: ${instancePath}`);
    console.error(validate.errors);
    process.exit(1);
  }
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/validate.js <path/to/app.json>');
  process.exit(2);
}

validateFile(arg);
