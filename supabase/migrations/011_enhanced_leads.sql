-- ═══════════════════════════════════════════════════════════
-- 011: Enhanced Leads — Add city, state, source_page, search preferences
-- ═══════════════════════════════════════════════════════════

-- Add city and state columns for admin panel display
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS state TEXT;

-- Add source_page to distinguish where the lead was captured
-- Values: 'residential_results', 'business_results', 'renewable_results', 
--         'newsletter_footer', 'newsletter_sidebar', 'homepage', 'exit_intent'
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page TEXT DEFAULT 'website';

-- Add search_preferences to store what the user was looking for
-- Stores: { planType, contractLength, renewableMin, monthlyUsage, topPlans }
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_preferences JSONB DEFAULT '{}';

-- Add follow_up tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for admin panel queries
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_source_page ON leads(source_page);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(follow_up_sent_at);

-- Allow anon users to insert leads (for the public-facing forms)
CREATE POLICY IF NOT EXISTS "Anon insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Allow anon users to update their own lead (for upsert on email)
CREATE POLICY IF NOT EXISTS "Anon update leads by email"
  ON leads FOR UPDATE
  USING (true)
  WITH CHECK (true);
