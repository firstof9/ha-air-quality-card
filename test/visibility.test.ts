import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { hasEntity } from '../src/helpers.js';

describe('hasEntity', () => {
  test('true for a non-empty entity id', () => {
    assert.equal(hasEntity('sensor.temp'), true);
  });
  test('false for undefined', () => {
    assert.equal(hasEntity(undefined), false);
  });
  test('false for empty string', () => {
    assert.equal(hasEntity(''), false);
  });
  test('false for whitespace-only string', () => {
    assert.equal(hasEntity('   '), false);
  });
  test('true for an entity id with surrounding whitespace', () => {
    assert.equal(hasEntity('  sensor.temp  '), true);
  });
});
