import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { graphHoverReadout, sameGraphHover } from '../src/helpers.js';
import type { GraphSeriesKey } from '../src/types.js';

const series: GraphSeriesKey[] = ['temp', 'humid'];

describe('graphHoverReadout', () => {
  test('maps a hovered point onto the matching stat', () => {
    const got = graphHoverReadout(
      { entity: 0, value: 67.34, time: ['20:14', '20:44'] },
      series,
    );
    assert.deepEqual(got, { key: 'temp', value: 67.34, time: '20:14 - 20:44' });
  });

  test('maps the second series onto humidity', () => {
    const got = graphHoverReadout(
      { entity: 1, value: 44.09, time: ['20:14', '20:44'] },
      series,
    );
    assert.deepEqual(got, { key: 'humid', value: 44.09, time: '20:14 - 20:44' });
  });

  test('follows the series order when temperature is not graphed', () => {
    const got = graphHoverReadout(
      { entity: 0, value: 44.09, time: ['20:14', '20:44'] },
      ['humid'],
    );
    assert.deepEqual(got, { key: 'humid', value: 44.09, time: '20:14 - 20:44' });
  });

  test('prefers the tooltip label over the time range', () => {
    const got = graphHoverReadout(
      { entity: 0, value: 70.9, time: ['20:14', '20:44'], label: 'Current' },
      series,
    );
    assert.deepEqual(got, { key: 'temp', value: 70.9, time: 'Current' });
  });

  test('parses a string value', () => {
    const got = graphHoverReadout({ entity: 1, value: '44.09', time: ['20:14', '20:44'] }, series);
    assert.deepEqual(got, { key: 'humid', value: 44.09, time: '20:14 - 20:44' });
  });

  test('tolerates a missing time range', () => {
    const got = graphHoverReadout({ entity: 0, value: 67.34 }, series);
    assert.deepEqual(got, { key: 'temp', value: 67.34, time: '' });
  });

  test('returns null when nothing is hovered', () => {
    assert.equal(graphHoverReadout(undefined, series), null);
    assert.equal(graphHoverReadout({}, series), null);
  });

  test('returns null when the value is missing or not a number', () => {
    assert.equal(graphHoverReadout({ entity: 0, time: ['20:14', '20:44'] }, series), null);
    assert.equal(graphHoverReadout({ entity: 0, value: 'unavailable' }, series), null);
  });

  test('returns null when the series index is out of range', () => {
    assert.equal(graphHoverReadout({ entity: 1, value: 44.09 }, ['temp']), null);
    assert.equal(graphHoverReadout({ entity: -1, value: 70.9 }, series), null);
  });

  test('returns null when the tooltip shape is unrecognised', () => {
    // mini-graph-card internals are not public API; an unexpected shape must
    // fall back to the live values rather than render garbage.
    assert.equal(graphHoverReadout({ value: 67.34 }, series), null);
    assert.equal(graphHoverReadout({ entity: '0' } as never, series), null);
  });

  test('returns null when no series are graphed', () => {
    assert.equal(graphHoverReadout({ entity: 0, value: 67.34 }, []), null);
  });
});

describe('sameGraphHover', () => {
  const readout = { key: 'temp' as const, value: 67.34, time: '20:14 - 20:44' };

  test('two nulls are the same', () => {
    assert.equal(sameGraphHover(null, null), true);
  });

  test('null and a readout differ', () => {
    assert.equal(sameGraphHover(readout, null), false);
    assert.equal(sameGraphHover(null, readout), false);
  });

  test('distinct objects with equal fields are the same', () => {
    assert.equal(sameGraphHover(readout, { ...readout }), true);
  });

  test('any differing field counts as a change', () => {
    assert.equal(sameGraphHover(readout, { ...readout, key: 'humid' }), false);
    assert.equal(sameGraphHover(readout, { ...readout, value: 67.35 }), false);
    assert.equal(sameGraphHover(readout, { ...readout, time: '20:44 - 21:14' }), false);
  });
});
