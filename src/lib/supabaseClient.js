import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Whether real credentials were supplied. False means every request will fail. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

/**
 * Placeholders, so a missing variable cannot take the whole site down.
 *
 * This file used to check for the variables, log, and then call createClient
 * with the undefined values anyway. createClient throws on that — "supabaseUrl
 * is required" — and it throws while the module is being evaluated, before
 * React mounts. The check above read like a guard and prevented nothing.
 *
 * The blast radius was the entire site rather than the parts that need a
 * database. Of the 335 indexable pages, only a handful read from Supabase; the
 * state, city, provider, comparison, utility and article pages are prerendered
 * from the market snapshot and never touch it. One missing variable in one
 * environment blanked all of them, and a blank page is the shape that gets a
 * URL dropped from the index.
 *
 * A reserved .invalid host (RFC 2606) is guaranteed never to resolve, so
 * requests fail as network errors rather than reaching anything real. That is
 * the behaviour the callers were already written for: every entity method in
 * api/supabaseEntities.js throws inside an async function, and react-query
 * turns that into an error state on the one component that asked. The failure
 * lands where it can be handled instead of before anything can run.
 *
 * isSupabaseConfigured is exported so a caller can tell "not configured" from
 * "configured but empty" without inspecting the error.
 */
export const supabase = createClient(
  supabaseUrl || 'https://unconfigured.invalid',
  supabaseAnonKey || 'unconfigured-anon-key'
);
