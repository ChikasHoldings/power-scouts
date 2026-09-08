/**
 * The Supabase client must not be able to take the site down at boot.
 *
 * src/lib/supabaseClient.js checked for its two environment variables, logged
 * when they were missing, and then called createClient with the undefined
 * values regardless. createClient throws on that — "supabaseUrl is required" —
 * and it throws during module evaluation, before React mounts. The check read
 * like a guard and prevented nothing.
 *
 * What made it serious was the blast radius. Only a handful of the 335
 * indexable pages read from Supabase; the state, city, provider, comparison,
 * utility and article pages are prerendered from the market snapshot and never
 * touch it. One missing variable in one environment rendered every one of them
 * blank, and a blank page is the shape that gets a URL dropped from the index.
 *
 * Verified in a browser against a build with no credentials: before the fix
 * every route reported an unmounted #root and "Error: supabaseUrl is required";
 * after it, every route mounts with no page errors at all.
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('the Supabase client survives a missing configuration', () => {
  let server;
  let mod;
  let loadError = null;

  before(async () => {
    // Loaded through Vite because the module reads import.meta.env, which is
    // Vite's and not Node's. Credentials are absent here and in CI, so this is
    // the unconfigured path by default — the one that used to throw.
    const { createServer } = await import('vite');
    server = await createServer({
      root: ROOT,
      server: { middlewareMode: true },
      appType: 'custom',
      logLevel: 'error',
    });
    try {
      mod = await server.ssrLoadModule('/src/lib/supabaseClient.js');
    } catch (error) {
      loadError = error;
    }
  });

  after(async () => { await server?.close(); });

  test('importing it does not throw', () => {
    assert.equal(
      loadError,
      null,
      `importing the client threw during module evaluation (${loadError?.message}) — `
        + 'every page on the site is blank when that happens, including the ones that never query',
    );
  });

  test('it still exports a usable client', () => {
    assert.ok(mod?.supabase, 'no client was exported');
    assert.equal(typeof mod.supabase.from, 'function', 'the client cannot build a query');
    assert.ok(mod.supabase.auth, 'the client has no auth surface');
  });

  test('it reports whether it was actually configured', () => {
    // The flag tracks the environment rather than a fixed answer, so this holds
    // both in CI (no credentials) and on a machine that has a .env.
    const configured = Boolean(
      process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY,
    );
    assert.equal(typeof mod.isSupabaseConfigured, 'boolean');
    if (!configured) {
      assert.equal(
        mod.isSupabaseConfigured,
        false,
        'no credentials are present, so the client must not claim to be configured',
      );
    }
  });

  test('an unconfigured client points at a host that cannot resolve', () => {
    // RFC 2606 reserves .invalid, so a request from an unconfigured build fails
    // as a network error instead of reaching somewhere real. That is what moves
    // the failure to request time, where react-query already handles it.
    if (mod.isSupabaseConfigured) return;
    const url = String(mod.supabase.supabaseUrl || '');
    assert.match(url, /\.invalid$/, `unconfigured client points at "${url}"`);
  });
});
