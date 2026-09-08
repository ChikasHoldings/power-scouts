/**
 * Pricing readiness — the admin dashboard's account of whether the catalog can
 * be priced at all.
 *
 * The number this reports went to zero in production without anything saying
 * so. Every active plan carried a delivery charge of 0, which the engine reads
 * as "not configured", so no plan could publish a monthly bill, no savings
 * comparison could be made against a customer's own bill, and every match score
 * was capped at 79 — while the dashboard's providers, plans, leads and revenue
 * tiles all read as healthy.
 *
 * The distinction these tests exist to pin is `blockedOnTerritories`. Unpriced
 * plans with no territory configured anywhere is one job the whole catalog is
 * waiting on; unpriced plans in a market that already has tariffs is a handful
 * of per-plan edits. Sending an operator to the plans screen in the first case
 * sends them to copy a number onto every plan by hand, which is precisely the
 * work migration 016 removed by moving delivery onto the territory.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { pricingReadiness } from '../src/lib/planValidation.js';

/** An active plan with a delivery charge, so it prices completely. */
const priced = (over = {}) => ({ is_active: true, tdsp_charges: 4.2, rate_per_kwh: 12, ...over });
/** An active plan with delivery unknown — null, not zero. */
const unpriced = (over = {}) => ({ is_active: true, tdsp_charges: null, rate_per_kwh: 12, ...over });

describe('pricing readiness', () => {
  test('counts only active plans', () => {
    const readiness = pricingReadiness(
      [priced(), priced(), priced({ is_active: false }), unpriced({ is_active: false })],
      [{ is_active: true }],
    );
    assert.equal(readiness.active, 2, 'inactive plans are not part of the published catalog');
    assert.equal(readiness.complete, 2);
    assert.equal(readiness.incomplete, 0);
    assert.equal(readiness.percent, 100);
  });

  test('an unpriced catalog with no territories is blocked on territories', () => {
    // The live shape at the time of writing: plans present, delivery unknown,
    // utility_territories empty.
    const readiness = pricingReadiness([unpriced(), unpriced(), unpriced()], []);
    assert.equal(readiness.complete, 0);
    assert.equal(readiness.incomplete, 3);
    assert.equal(readiness.percent, 0);
    assert.equal(readiness.territories, 0);
    assert.equal(
      readiness.blockedOnTerritories,
      true,
      'with no tariff anywhere, the fix is one territory job rather than three plan edits',
    );
  });

  test('unpriced plans in a configured market are not blocked on territories', () => {
    const readiness = pricingReadiness([priced(), unpriced()], [{ is_active: true }]);
    assert.equal(readiness.incomplete, 1);
    assert.equal(
      readiness.blockedOnTerritories,
      false,
      'a market with tariffs already configured is a per-plan work queue',
    );
  });

  test('an inactive territory does not count as configured', () => {
    // A superseded tariff row still exists but prices nothing, so leaving it
    // active-looking would hide the blockage it was meant to reveal.
    const readiness = pricingReadiness([unpriced()], [{ is_active: false }]);
    assert.equal(readiness.activeTerritories, 0);
    assert.equal(readiness.territories, 1, 'the row is still there');
    assert.equal(readiness.blockedOnTerritories, true);
  });

  test('a fully priced catalog is never reported as blocked', () => {
    const readiness = pricingReadiness([priced(), priced()], []);
    assert.equal(readiness.incomplete, 0);
    assert.equal(
      readiness.blockedOnTerritories,
      false,
      'nothing is blocked when nothing is unpriced, whatever the territory count',
    );
  });

  test('an empty catalog reports 0% rather than dividing by zero', () => {
    const readiness = pricingReadiness([], []);
    assert.equal(readiness.active, 0);
    assert.equal(readiness.percent, 0);
    assert.equal(readiness.blockedOnTerritories, false);
  });

  test('missing or malformed inputs do not throw', () => {
    // The dashboard renders before its queries resolve, so both arrive
    // undefined on first paint.
    for (const args of [[undefined, undefined], [null, null], ['nope', 'nope']]) {
      const readiness = pricingReadiness(...args);
      assert.equal(readiness.active, 0);
      assert.equal(readiness.territories, 0);
      assert.equal(readiness.blockedOnTerritories, false);
    }
  });
});
