/**
 * The admin gate's states.
 *
 * The bug this pins: AdminRoute decided whether to hold the panel on its
 * full-viewport boot screen with `isLoadingProfile || (!profile &&
 * isAuthenticated)`. That is true of a profile which has not arrived yet, and
 * equally true of one that is never going to arrive. When the profile fetch
 * failed, AuthContext logged the error to the console, set isLoadingProfile
 * false in its finally, and left profile null — so the condition stayed true
 * with nothing left to change it and the admin panel showed a loading spinner
 * for ever. No error, no retry, no way out, and nothing in the UI to suggest
 * anything had gone wrong.
 *
 * The distinction that fixes it is between waiting and having waited.
 * `profileError` is set once the fetch has concluded without a profile, and it
 * is what ends the wait. PGRST116 — authenticated, but no profile row — reaches
 * the same dead end by a different route and has to end the wait too.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { adminGateState } from '../src/lib/adminNav.js';

const signedIn = { isAuthenticated: true, user: { id: 'u1' } };

describe('the admin gate', () => {
  test('waits while auth is still resolving', () => {
    assert.equal(adminGateState({ isLoadingAuth: true }), 'boot');
  });

  test('sends an anonymous visitor to the login screen', () => {
    assert.equal(adminGateState({ isAuthenticated: false }), 'login');
    assert.equal(adminGateState({ isAuthenticated: true, user: null }), 'login');
  });

  test('waits while the profile is in flight', () => {
    assert.equal(adminGateState({ ...signedIn, isLoadingProfile: true }), 'boot');
  });

  test('waits before the profile fetch has started', () => {
    // profile null, no error yet: the fetch is queued but has not run, so this
    // is a genuine wait and must not be reported as a failure.
    assert.equal(adminGateState({ ...signedIn }), 'boot');
  });

  test('stops waiting once the fetch has failed', () => {
    // The regression. Anything but 'boot' would do; 'profile-error' is what
    // renders the message and the retry.
    const state = adminGateState({ ...signedIn, profileError: 'network down' });
    assert.notEqual(state, 'boot', 'a failed profile fetch must never leave the panel booting');
    assert.equal(state, 'profile-error');
  });

  test('stops waiting when the account simply has no profile row', () => {
    // PGRST116: the query succeeded and matched nothing. Not a transport
    // failure, but still no role, so it is the same dead end.
    const state = adminGateState({ ...signedIn, profileError: 'This account has no profile record' });
    assert.equal(state, 'profile-error');
  });

  test('a finished fetch is never reported as loading, whatever the flags say', () => {
    // isLoadingProfile true alongside an error should not resurrect the wait.
    assert.equal(
      adminGateState({ ...signedIn, isLoadingProfile: false, profile: null, profileError: 'boom' }),
      'profile-error',
    );
  });

  test('denies a signed-in user without an admin role', () => {
    assert.equal(adminGateState({ ...signedIn, profile: { role: 'user' } }), 'denied');
    assert.equal(adminGateState({ ...signedIn, profile: {} }), 'denied');
  });

  test('admits every admin role', () => {
    for (const role of ['admin', 'editor', 'viewer']) {
      assert.equal(
        adminGateState({ ...signedIn, profile: { role } }),
        'ready',
        `${role} should reach the panel`,
      );
    }
  });

  test('no snapshot falls through without a state', () => {
    const states = new Set(['boot', 'login', 'profile-error', 'denied', 'ready']);
    for (const isLoadingAuth of [true, false])
      for (const isAuthenticated of [true, false])
        for (const user of [null, { id: 'u1' }])
          for (const isLoadingProfile of [true, false])
            for (const profile of [null, { role: 'admin' }, { role: 'user' }])
              for (const profileError of [null, 'boom']) {
                const s = adminGateState({
                  isLoadingAuth, isAuthenticated, user, isLoadingProfile, profile, profileError,
                });
                assert.ok(states.has(s), `unhandled snapshot produced ${s}`);
              }
  });

  test('called with nothing, it boots rather than throwing', () => {
    assert.equal(adminGateState(), 'login');
  });
});
