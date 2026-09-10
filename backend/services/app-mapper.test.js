import assert from 'node:assert/strict';
import test from 'node:test';
import { mapToAPP, validateAPP } from './app-mapper.service.js';

test('maps AI extraction data into a valid APP profile', () => {
  const profile = mapToAPP({
    contactInformation: {
      name: 'Ada Lovelace',
      email: 'ada@example.com'
    },
    workExperience: [{
      title: 'Engineer',
      company: 'Example Corp',
      startDate: '2020-01',
      current: true,
      highlights: ['Built systems']
    }],
    education: [{
      institution: 'University of Example',
      degree: 'BSc',
      field: 'Mathematics',
      startDate: '2010',
      endDate: '2014'
    }],
    skills: { languages: ['JavaScript'] },
    languages: [{ name: 'English', proficiency: 'Native' }]
  });

  const validation = validateAPP(profile);

  assert.equal(validation.valid, true);
  assert.deepEqual(profile.basics.name, { given: 'Ada', family: 'Lovelace' });
  assert.equal(profile.experience[0].organization.name, 'Example Corp');
  assert.equal(profile.experience[0].start, '2020-01');
  assert.equal(profile.education[0].start, '2010');
  assert.equal(profile.languages[0].proficiency, 'Native');
});