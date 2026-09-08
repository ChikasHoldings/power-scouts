/**
 * Launch readiness — the three things that have to be true before this site can
 * do its job, none of which anything was watching.
 *
 * All three are configuration rather than code, which is why they went
 * unnoticed: every screen reads as healthy because every screen is working.
 * The catalog page lists providers, the leads page lists leads, the revenue
 * page adds up. What none of them says is that the answers are empty.
 *
 * Measured against production while writing this: 0 utility territories, 0 lead
 * buyers, 15 active plans against the 372 the public pages advertise from an
 * Aug-14 snapshot.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { launchReadiness } from '../src/lib/planValidation.js';

const priced = () => ({ is_active: true, tdsp_charges: 4.2, rate_per_kwh: 12 });
const unpriced = () => ({ is_active: true, tdsp_charges: null, rate_per_kwh: 12 });
const ready = (over = {}) => ({
  plans: [priced(), priced()],
  territories: [{ is_active: true }],
  buyers: [{ is_active: true }],
  leads: 0,
  snapshotPlans: 2,
  ...over,
});

describe('launch readiness', () => {
  test('a fully configured site reports no blockers', () => {
    const r = launchReadiness(ready());
    assert.deepEqual(r.blockers, []);
    assert.equal(r.launchReady, true);
  });

  test('the live shape reports all three blockers', () => {
    const r = launchReadiness({
      plans: Array.from({ length: 15 }, unpriced),
      territories: [],
      buyers: [],
      leads: 13,
      snapshotPlans: 372,
    });
    assert.deepEqual(r.blockers, ['delivery', 'buyers', 'catalog']);
    assert.equal(r.launchReady, false);
  });

  test('no lead buyer is a blocker on its own', () => {
    // Everything priceable, catalog in step, and still nothing can be earned:
    // a captured lead has nobody to go to.
    const r = launchReadiness(ready({ buyers: [] }));
    assert.deepEqual(r.blockers, ['buyers']);
    assert.equal(r.buyersConfigured, false);
  });

  test('an inactive buyer does not count as configured', () => {
    const r = launchReadiness(ready({ buyers: [{ is_active: false }] }));
    assert.equal(r.activeBuyers, 0);
    assert.equal(r.buyers, 1, 'the row is still there');
    assert.deepEqual(r.blockers, ['buyers']);
  });

  test('catalog drift is flagged only once it is wide enough to mislead', () => {
    // Small drift between deploys is normal: the snapshot is rebuilt on deploy
    // and the catalog moves in between.
    assert.equal(launchReadiness(ready({ snapshotPlans: 2 })).catalogFresh, true);
    // 2 live against 100 published is the site advertising what it cannot serve.
    const wide = launchReadiness(ready({ snapshotPlans: 100 }));
    assert.equal(wide.catalogFresh, false);
    assert.ok(wide.blockers.includes('catalog'));
  });

  test('drift is symmetric — a catalog that grew is reported too', () => {
    // Published 2, live 40: the pages understate what is available, which is a
    // different problem with the same cause and the same fix.
    const r = launchReadiness({
      ...ready(),
      plans: Array.from({ length: 40 }, priced),
      snapshotPlans: 2,
    });
    assert.equal(r.catalogFresh, false);
  });

  test('no snapshot figure means no drift claim', () => {
    // Never assert drift from a number we do not have.
    const r = launchReadiness(ready({ snapshotPlans: 0 }));
    assert.equal(r.catalogDrift, 0);
    assert.equal(r.catalogFresh, true);
  });

  test('delivery is not a blocker when every plan is already priced', () => {
    // No territories, but nothing needs one: the plans carry their own
    // override, so there is nothing to fix.
    const r = launchReadiness(ready({ territories: [] }));
    assert.equal(r.deliveryConfigured, false);
    assert.ok(!r.blockers.includes('delivery'), 'a priced catalog is not blocked on tariffs');
  });

  test('called with nothing, it does not throw', () => {
    const r = launchReadiness();
    assert.equal(r.active, 0);
    assert.equal(r.buyers, 0);
    assert.equal(r.catalogDrift, 0);
    assert.deepEqual(r.blockers, ['buyers']);
  });
});
