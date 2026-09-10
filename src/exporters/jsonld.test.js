import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const exporterPath = fileURLToPath(new URL('./jsonld.js', import.meta.url));
const profilePath = path.resolve(path.dirname(exporterPath), '../../examples/full.json');

test('exports experience, education, and Schema.org credentials as JSON-LD', () => {
  const output = execFileSync(process.execPath, [exporterPath, profilePath], { encoding: 'utf8' });
  const jsonld = JSON.parse(output);

  assert.equal(jsonld.worksFor.length, 1);
  assert.equal(jsonld.worksFor[0].name, 'Example Corp');
  assert.equal(jsonld.worksFor[0].member.roleName, 'Senior Software Engineer');
  assert.equal(jsonld.worksFor[0].member.startDate, '2019-03');
  assert.equal(jsonld.worksFor[0].member.endDate, undefined);

  assert.deepEqual(jsonld.alumniOf, [{
    '@type': 'EducationalOrganization',
    name: 'University of Example'
  }]);

  assert.equal(jsonld.hasCredential.length, 2);
  assert.equal(jsonld.hasCredential[0].recognizedBy.name, 'Amazon Web Services');
  assert.equal(jsonld.hasCredential[0].issuer, undefined);
  assert.deepEqual(jsonld.hasCredential[1], {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Degree',
    name: 'BSc in Computer Science',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'University of Example'
    }
  });
});