-- ============================================================
-- Migration 006: Home Concierge System
-- Creates the concierge_requests table for managing home
-- utility setup requests and tracking revenue from partner
-- service referrals.
-- ============================================================

-- Concierge request statuses:
--   new        → Just submitted
--   contacted  → Admin has reached out to the customer
--   in_progress → Working on utility setup
--   completed  → All services set up
--   cancelled  → Customer cancelled

CREATE TABLE IF NOT EXISTS concierge_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Customer info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Move details
  move_in_date DATE,
  new_address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT NOT NULL,
  property_type TEXT DEFAULT 'house', -- house, apartment, condo, townhouse
  
  -- Services requested (stored as JSONB array)
  services_requested JSONB DEFAULT '["electricity"]'::jsonb,
  -- e.g. ["electricity", "internet", "water_gas", "phone_tv", "home_security", "home_insurance"]
  
  -- Partner upsells (revenue generators)
  wants_home_security BOOLEAN DEFAULT false,
  wants_home_insurance BOOLEAN DEFAULT false,
  wants_moving_service BOOLEAN DEFAULT false,
  wants_home_warranty BOOLEAN DEFAULT false,
  
  -- Preferences
  electricity_preference TEXT, -- lowest_rate, fixed_rate, renewable, no_preference
  internet_speed TEXT, -- basic, standard, fast, fastest
  monthly_budget TEXT, -- under_100, 100_200, 200_300, over_300
  special_instructions TEXT,
  
  -- Admin tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  
  -- Revenue tracking
  estimated_revenue DECIMAL(10,2) DEFAULT 0,
  actual_revenue DECIMAL(10,2) DEFAULT 0,
  revenue_source TEXT, -- affiliate, referral_fee, partner_commission
  
  -- Metadata
  source TEXT DEFAULT 'website', -- website, referral, social, ad
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_concierge_status ON concierge_requests(status);
CREATE INDEX IF NOT EXISTS idx_concierge_email ON concierge_requests(email);
CREATE INDEX IF NOT EXISTS idx_concierge_zip ON concierge_requests(zip_code);
CREATE INDEX IF NOT EXISTS idx_concierge_created ON concierge_requests(created_at DESC);

-- RLS policies
ALTER TABLE concierge_requests ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage concierge requests"
  ON concierge_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Anyone can insert (public form submission)
CREATE POLICY "Anyone can submit concierge requests"
  ON concierge_requests
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own requests by email
CREATE POLICY "Users can view own requests"
  ON concierge_requests
  FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_concierge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER concierge_updated_at
  BEFORE UPDATE ON concierge_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_concierge_updated_at();
