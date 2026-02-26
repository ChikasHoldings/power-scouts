-- ============================================
-- Migration 002: Affiliate Links & Click Tracking
-- ============================================

-- 0. Create is_admin() security definer function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. affiliate_links table
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  provider_id UUID REFERENCES public.electricity_providers(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.electricity_plans(id) ON DELETE SET NULL,
  target_url TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. click_tracking table
CREATE TABLE IF NOT EXISTS public.click_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug ON public.affiliate_links(slug);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_provider ON public.affiliate_links(provider_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_offer ON public.affiliate_links(offer_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_slug ON public.click_tracking(slug);
CREATE INDEX IF NOT EXISTS idx_click_tracking_created ON public.click_tracking(created_at);

-- 4. Auto-update trigger for affiliate_links
CREATE OR REPLACE TRIGGER update_affiliate_links_updated_at
  BEFORE UPDATE ON public.affiliate_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_tracking ENABLE ROW LEVEL SECURITY;

-- affiliate_links: public read for active links, admin write (uses is_admin() to avoid recursion)
CREATE POLICY "Anyone can read active affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can read all affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert affiliate links"
  ON public.affiliate_links FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update affiliate links"
  ON public.affiliate_links FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete affiliate links"
  ON public.affiliate_links FOR DELETE
  USING (public.is_admin());

-- click_tracking: insert allowed by anyone (for the redirect API), read by admins only
CREATE POLICY "Anyone can insert click tracking"
  ON public.click_tracking FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read click tracking"
  ON public.click_tracking FOR SELECT
  USING (public.is_admin());
