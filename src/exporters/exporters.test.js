import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const exporterDirectory = path.dirname(fileURLToPath(import.meta.url));
const profilePath = path.resolve(exporterDirectory, '../../examples/full.json');

function runExporter(name) {
  return execFileSync(process.execPath, [path.join(exporterDirectory, name), profilePath], {
    encoding: 'utf8'
  });
}

test('JSON Resume normalizes education dates and matches experience technologies to skills', () => {
  const jsonResume = JSON.parse(runExporter('jsonresume.js'));

  assert.equal(jsonResume.education[0].startDate, '2010-01-01');
  assert.equal(jsonResume.education[0].endDate, '2014-01-01');
  assert.deepEqual(jsonResume.skills[0].keywords, ['TS', 'TypeScript']);
  assert.deepEqual(jsonResume.skills[1].keywords, ['Next.js']);
});

test('Europass exports skills and their levels', () => {
  const europass = runExporter('europass.js');

  assert.match(europass, /<Skills>[\s\S]*<Skill>[\s\S]*<Name>TypeScript<\/Name>[\s\S]*<Level>Expert<\/Level>/);
  assert.match(europass, /<Skill>[\s\S]*<Name>Next\.js<\/Name>[\s\S]*<Level>Advanced<\/Level>/);
});
