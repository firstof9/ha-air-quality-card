import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { entitiesWithHistory } from '../src/helpers.js';

describe('entitiesWithHistory', () => {
  const ids = ['sensor.temp', 'sensor.humid'];

  test('keeps entities with at least one data point', () => {
    const resp = { 'sensor.temp': [{ s: '70' }], 'sensor.humid': [{ s: '50' }] };
    const got = entitiesWithHistory(resp, ids);
    assert.deepEqual([...got].sort(), ['sensor.humid', 'sensor.temp']);
  });

  test('drops entities with an empty series', () => {
    const resp = { 'sensor.temp': [{ s: '70' }], 'sensor.humid': [] };
    const got = entitiesWithHistory(resp, ids);
    assert.deepEqual([...got], ['sensor.temp']);
  });

  test('drops entities missing from the response', () => {
    const resp = { 'sensor.temp': [{ s: '70' }] };
    const got = entitiesWithHistory(resp, ids);
    assert.deepEqual([...got], ['sensor.temp']);
  });

  test('empty / undefined response yields an empty set', () => {
    assert.equal(entitiesWithHistory(undefined, ids).size, 0);
    assert.equal(entitiesWithHistory({}, ids).size, 0);
  });
});
