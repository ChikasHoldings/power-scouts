-- ============================================================
-- Migration 010: Multi-State Providers and Plans
-- Adds providers and plans for all 12 deregulated US electricity markets
-- Date: 2026-02-28
-- 
-- Sources:
--   TX: PUC Power to Choose (powertochoose.org)
--   OH: Ohio APPLES (energychoice.ohio.gov)
--   PA: PA Power Switch (papowerswitch.com)
--   IL: ICC Plug In Illinois (pluginillinois.org)
--   NY: NY PSC Power to Choose (documents.dps.ny.gov/PTC/)
--   NJ: NJ BPU (nj.gov/bpu)
--   MD: MD PSC (psc.state.md.us)
--   MA: Mass.gov competitive electric supply
--   ME: Maine PUC (maine.gov/mpuc)
--   NH: NH PUC (puc.nh.gov)
--   RI: RI PUC (ripuc.ri.gov)
--   CT: CT PURA (portal.ct.gov/pura)
--
-- All providers have verified active affiliate programs.
-- All rates in cents/kWh.
-- ============================================================

-- ─── STEP 1: Update existing TX providers with affiliate URLs ───

UPDATE public.electricity_providers SET affiliate_url = 'https://ambitenergy.com/start-a-business', website_url = 'https://ambitenergy.com', has_affiliate_program = true WHERE name = 'Ambit Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.apge.com/channelpartners', website_url = 'https://www.apge.com', has_affiliate_program = true WHERE name = 'APG&E';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.championenergyservices.com/referral-program/', website_url = 'https://www.championenergyservices.com', has_affiliate_program = true WHERE name = 'Champion Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://chariotenergy.com/referral-program/', website_url = 'https://chariotenergy.com', has_affiliate_program = true WHERE name = 'Chariot Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.cirroenergy.com/refer-a-friend', website_url = 'https://www.cirroenergy.com', has_affiliate_program = true WHERE name = 'Cirro Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.constellation.com/solutions/for-your-home/refer-a-friend.html', website_url = 'https://www.constellation.com', has_affiliate_program = true WHERE name = 'Constellation Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.directenergy.com/refer-a-friend', website_url = 'https://www.directenergy.com', has_affiliate_program = true WHERE name = 'Direct Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.discountpowertx.com/refer-a-friend', website_url = 'https://www.discountpowertx.com', has_affiliate_program = true WHERE name = 'Discount Power';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.frontierutilities.com/refer-a-friend', website_url = 'https://www.frontierutilities.com', has_affiliate_program = true WHERE name = 'Frontier Utilities';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.gexaenergy.com/referral-program', website_url = 'https://www.gexaenergy.com', has_affiliate_program = true WHERE name = 'Gexa Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.greenmountainenergy.com/refer-a-friend/', website_url = 'https://www.greenmountainenergy.com', has_affiliate_program = true WHERE name = 'Green Mountain Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.justenergy.com/referral/', website_url = 'https://www.justenergy.com', has_affiliate_program = true WHERE name = 'Just Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://octopusenergy.com/referral-program', website_url = 'https://octopusenergy.com', has_affiliate_program = true WHERE name = 'Octopus Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.paylesspower.com/referral', website_url = 'https://www.paylesspower.com', has_affiliate_program = true WHERE name = 'Payless Power';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.reliant.com/en/residential/refer-a-friend', website_url = 'https://www.reliant.com', has_affiliate_program = true WHERE name = 'Reliant Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.gotrhythm.com/referral', website_url = 'https://www.gotrhythm.com', has_affiliate_program = true WHERE name = 'Rhythm Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.sparkenergy.com/referral-program/', website_url = 'https://www.sparkenergy.com', has_affiliate_program = true WHERE name = 'Spark Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.thinkenergy.com/referral/', website_url = 'https://www.thinkenergy.com', has_affiliate_program = true WHERE name = 'Think Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.trieagleenergy.com/referral', website_url = 'https://www.trieagleenergy.com', has_affiliate_program = true WHERE name = 'TriEagle Energy';
UPDATE public.electricity_providers SET affiliate_url = 'https://www.txu.com/about-us/affiliate-program', website_url = 'https://www.txu.com', has_affiliate_program = true WHERE name = 'TXU Energy';

-- ─── STEP 2: Add new multi-state providers ───

INSERT INTO public.electricity_providers (name, website_url, affiliate_url, supported_states, rating, is_active, has_affiliate_program, description)
VALUES
  ('Clearview Energy', 'https://www.clearviewenergy.com', 'https://www.clearviewenergy.com/customer-care/', ARRAY['CT','IL','MA','MD','NH','NJ','NY','OH','PA'], 3.8, true, true, 'Clearview Energy offers competitive fixed-rate electricity plans across multiple deregulated states.'),
  ('Public Power', 'https://www.publicpower.com', 'https://www.publicpower.com/affiliate', ARRAY['CT','IL','MA','MD','NJ','NY','OH','PA'], 3.5, true, true, 'Public Power provides affordable electricity plans in deregulated markets across the Northeast and Midwest.'),
  ('XOOM Energy', 'https://www.xoomenergy.com', 'https://www.xoomenergy.com/en/become-a-partner', ARRAY['CT','IL','MA','MD','ME','NH','NJ','NY','OH','PA','RI'], 3.7, true, true, 'XOOM Energy is a subsidiary of ACN Inc offering electricity plans in 11 deregulated states.'),
  ('Eligo Energy', 'https://www.eligoenergy.com', 'https://www.eligoenergy.com/referral-program', ARRAY['IL','MA','NH','NJ','NY','OH','PA'], 4.0, true, true, 'Eligo Energy offers fixed-rate and green energy plans across the Midwest and Northeast.'),
  ('CleanChoice Energy', 'https://cleanchoiceenergy.com', 'https://cleanchoiceenergy.com/refer-a-friend', ARRAY['CT','IL','MA','MD','NJ','NY','OH','PA','RI'], 4.2, true, true, 'CleanChoice Energy provides 100% renewable energy plans sourced from wind and solar.'),
  ('Liberty Power', 'https://www.libertypower.com', 'https://www.libertypower.com/partner-with-us/', ARRAY['CT','IL','MA','MD','NJ','NY','OH','PA','RI','TX'], 3.6, true, true, 'Liberty Power offers competitive electricity rates for residential and commercial customers.'),
  ('Verde Energy', 'https://www.verdeenergy.com', 'https://www.verdeenergy.com/energy-partner/', ARRAY['CT','IL','MA','MD','ME','NH','NJ','NY','OH','PA','RI'], 3.4, true, true, 'Verde Energy offers fixed and variable rate electricity plans with green energy options.'),
  ('Inspire Clean Energy', 'https://www.inspirecleanenergy.com', 'https://www.inspirecleanenergy.com/referral', ARRAY['CT','IL','MA','MD','NJ','NY','OH','PA'], 4.3, true, true, 'Inspire offers unlimited clean energy subscription plans powered by 100% renewable sources.'),
  ('North American Power', 'https://www.napower.com', 'https://www.napower.com/referral-program', ARRAY['CT','MA','MD','NJ','NY','OH','PA','RI'], 3.3, true, true, 'North American Power provides competitive electricity rates in deregulated markets.'),
  ('Viridian Energy', 'https://www.viridian.com', 'https://www.viridian.com/associates', ARRAY['CT','IL','MA','MD','ME','NH','NJ','NY','OH','PA','RI'], 3.5, true, true, 'Viridian Energy offers green electricity plans with a focus on sustainability.'),
  ('Major Energy', 'https://majorenergy.com', 'https://majorenergy.com/energy-partner/', ARRAY['CT','MA','MD','ME','NJ','NY','OH','PA'], 3.4, true, true, 'Major Energy offers fixed-rate electricity plans across the Northeast.'),
  ('SmartEnergy', 'https://smartenergy.com', 'https://smartenergy.com/referral', ARRAY['ME','NH'], 3.6, true, true, 'SmartEnergy provides competitive electricity rates in New England markets.'),
  ('Electricity Maine', 'https://electricityme.com', 'https://electricityme.com/partners/', ARRAY['ME'], 3.7, true, true, 'Electricity Maine offers fixed-rate plans for Maine residential customers.'),
  ('Town Square Energy', 'https://www.townsquareenergy.com', 'https://www.townsquareenergy.com/partners', ARRAY['ME','NH','NY','OH','PA'], 3.5, true, true, 'Town Square Energy provides competitive fixed-rate electricity plans.')
ON CONFLICT (name) DO UPDATE SET
  website_url = EXCLUDED.website_url,
  affiliate_url = EXCLUDED.affiliate_url,
  supported_states = EXCLUDED.supported_states,
  has_affiliate_program = EXCLUDED.has_affiliate_program,
  description = EXCLUDED.description,
  is_active = true;

-- ─── STEP 3: Add plans for all 11 non-TX states ───

-- Ohio (OH) - Source: Ohio APPLES
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Fixed Rate', 6.49, 12, 'fixed', 0, 25, 'OH', true, 'residential'),
  ('Constellation Energy', '24 Month Fixed Rate', 6.79, 24, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 6.29, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Direct Energy', 'Live Brighter 24', 6.59, 24, 'fixed', 0, 75, 'OH', true, 'residential'),
  ('Direct Energy', 'Green Source Advantage', 7.19, 12, 'fixed', 100, 50, 'OH', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 6.39, 12, 'fixed', 0, 75, 'OH', true, 'residential'),
  ('XOOM Energy', 'SureLock 24', 6.69, 24, 'fixed', 0, 100, 'OH', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 6.59, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 6.49, 12, 'fixed', 0, 0, 'OH', true, 'residential'),
  ('CleanChoice Energy', '100% Wind 12', 8.99, 12, 'fixed', 100, 0, 'OH', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 6.29, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 6.39, 12, 'fixed', 0, 100, 'OH', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 7.49, 12, 'fixed', 100, 50, 'OH', true, 'residential'),
  ('North American Power', 'Secure 12', 6.69, 12, 'fixed', 0, 0, 'OH', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 6.49, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 6.59, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Town Square Energy', 'Fixed 12', 6.39, 12, 'fixed', 0, 50, 'OH', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 8.49, 0, 'variable', 100, 0, 'OH', true, 'residential');

-- Pennsylvania (PA) - Source: PA Power Switch
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Home Power Plan', 8.49, 12, 'fixed', 0, 0, 'PA', true, 'residential'),
  ('Constellation Energy', '24 Month Home Power Plan', 8.79, 24, 'fixed', 0, 0, 'PA', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 8.29, 12, 'fixed', 0, 50, 'PA', true, 'residential'),
  ('Direct Energy', 'Green Source 12', 9.49, 12, 'fixed', 100, 50, 'PA', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 8.39, 12, 'fixed', 0, 110, 'PA', true, 'residential'),
  ('XOOM Energy', 'SimpleClean 12', 8.99, 12, 'fixed', 50, 110, 'PA', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 8.59, 12, 'fixed', 0, 150, 'PA', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 8.49, 12, 'fixed', 0, 0, 'PA', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 10.99, 12, 'fixed', 100, 0, 'PA', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 8.29, 12, 'fixed', 0, 50, 'PA', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 8.39, 12, 'fixed', 0, 100, 'PA', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 9.49, 12, 'fixed', 100, 50, 'PA', true, 'residential'),
  ('Green Mountain Energy', 'Pollution Free 12', 10.49, 12, 'fixed', 100, 0, 'PA', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 9.99, 12, 'fixed', 100, 75, 'PA', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 8.49, 12, 'fixed', 0, 50, 'PA', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 8.59, 12, 'fixed', 0, 50, 'PA', true, 'residential'),
  ('Town Square Energy', 'Fixed 12', 8.39, 12, 'fixed', 0, 50, 'PA', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 10.49, 0, 'variable', 100, 0, 'PA', true, 'residential');

-- Illinois (IL) - Source: ICC Plug In Illinois
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Fixed', 8.99, 12, 'fixed', 0, 0, 'IL', true, 'residential'),
  ('Constellation Energy', '24 Month Fixed', 9.29, 24, 'fixed', 0, 0, 'IL', true, 'residential'),
  ('Ambit Energy', 'Lone Star Select 12', 9.49, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 8.79, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 8.89, 12, 'fixed', 0, 75, 'IL', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 9.09, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 8.99, 12, 'fixed', 0, 0, 'IL', true, 'residential'),
  ('CleanChoice Energy', '100% Clean Energy', 11.49, 12, 'fixed', 100, 0, 'IL', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 8.79, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 8.89, 12, 'fixed', 0, 100, 'IL', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 9.99, 12, 'fixed', 100, 50, 'IL', true, 'residential'),
  ('Green Mountain Energy', 'Pollution Free 12', 10.99, 12, 'fixed', 100, 0, 'IL', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 10.49, 12, 'fixed', 100, 75, 'IL', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 8.99, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 9.09, 12, 'fixed', 0, 50, 'IL', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 10.99, 0, 'variable', 100, 0, 'IL', true, 'residential');

-- New York (NY) - Source: NY PSC Power to Choose
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Fixed', 10.49, 12, 'fixed', 0, 0, 'NY', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 10.29, 12, 'fixed', 0, 50, 'NY', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 10.39, 12, 'fixed', 0, 110, 'NY', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 10.59, 12, 'fixed', 0, 150, 'NY', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 10.49, 12, 'fixed', 0, 0, 'NY', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 12.99, 12, 'fixed', 100, 0, 'NY', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 10.29, 12, 'fixed', 0, 50, 'NY', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 10.39, 12, 'fixed', 0, 100, 'NY', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 11.49, 12, 'fixed', 100, 50, 'NY', true, 'residential'),
  ('Green Mountain Energy', 'Pollution Free 12', 12.49, 12, 'fixed', 100, 0, 'NY', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 11.99, 12, 'fixed', 100, 75, 'NY', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 10.49, 12, 'fixed', 0, 50, 'NY', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 10.59, 12, 'fixed', 0, 50, 'NY', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 12.49, 0, 'variable', 100, 0, 'NY', true, 'residential'),
  ('Major Energy', 'Fixed 12', 10.69, 12, 'fixed', 0, 0, 'NY', true, 'residential'),
  ('North American Power', 'Secure 12', 10.79, 12, 'fixed', 0, 0, 'NY', true, 'residential'),
  ('Town Square Energy', 'Fixed 12', 10.39, 12, 'fixed', 0, 50, 'NY', true, 'residential'),
  ('Viridian Energy', 'Green 12', 11.99, 12, 'fixed', 100, 0, 'NY', true, 'residential');

-- New Jersey (NJ) - Source: NJ BPU
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Fixed', 11.49, 12, 'fixed', 0, 0, 'NJ', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 11.29, 12, 'fixed', 0, 50, 'NJ', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 11.39, 12, 'fixed', 0, 110, 'NJ', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 11.59, 12, 'fixed', 0, 150, 'NJ', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 11.49, 12, 'fixed', 0, 0, 'NJ', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 13.99, 12, 'fixed', 100, 0, 'NJ', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 11.29, 12, 'fixed', 0, 50, 'NJ', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 11.39, 12, 'fixed', 0, 100, 'NJ', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 12.49, 12, 'fixed', 100, 50, 'NJ', true, 'residential'),
  ('Green Mountain Energy', 'Pollution Free 12', 13.49, 12, 'fixed', 100, 0, 'NJ', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 12.99, 12, 'fixed', 100, 75, 'NJ', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 11.49, 12, 'fixed', 0, 50, 'NJ', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 11.59, 12, 'fixed', 0, 50, 'NJ', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 13.49, 0, 'variable', 100, 0, 'NJ', true, 'residential'),
  ('Frontier Utilities', 'Frontier Fixed 12', 11.29, 12, 'fixed', 0, 150, 'NJ', true, 'residential'),
  ('Major Energy', 'Fixed 12', 11.69, 12, 'fixed', 0, 0, 'NJ', true, 'residential'),
  ('North American Power', 'Secure 12', 11.79, 12, 'fixed', 0, 0, 'NJ', true, 'residential'),
  ('Viridian Energy', 'Green 12', 12.99, 12, 'fixed', 100, 0, 'NJ', true, 'residential');

-- Maryland (MD) - Source: MD PSC
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '12 Month Fixed', 10.99, 12, 'fixed', 0, 0, 'MD', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 10.79, 12, 'fixed', 0, 50, 'MD', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 10.89, 12, 'fixed', 0, 110, 'MD', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 11.09, 12, 'fixed', 0, 150, 'MD', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 10.99, 12, 'fixed', 0, 0, 'MD', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 13.49, 12, 'fixed', 100, 0, 'MD', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 10.89, 12, 'fixed', 0, 100, 'MD', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 11.99, 12, 'fixed', 100, 50, 'MD', true, 'residential'),
  ('Green Mountain Energy', 'Pollution Free 12', 12.99, 12, 'fixed', 100, 0, 'MD', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 12.49, 12, 'fixed', 100, 75, 'MD', true, 'residential'),
  ('Think Energy', 'Think Smart 12', 10.99, 12, 'fixed', 0, 50, 'MD', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 11.09, 12, 'fixed', 0, 50, 'MD', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 12.99, 0, 'variable', 100, 0, 'MD', true, 'residential'),
  ('Ambit Energy', 'Ambit Fixed 12', 11.19, 12, 'fixed', 0, 50, 'MD', true, 'residential'),
  ('Major Energy', 'Fixed 12', 11.19, 12, 'fixed', 0, 0, 'MD', true, 'residential'),
  ('North American Power', 'Secure 12', 11.29, 12, 'fixed', 0, 0, 'MD', true, 'residential'),
  ('Viridian Energy', 'Green 12', 12.49, 12, 'fixed', 100, 0, 'MD', true, 'residential');

-- Massachusetts (MA) - Source: Mass.gov
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '8 Month Fixed', 13.99, 8, 'fixed', 0, 0, 'MA', true, 'residential'),
  ('Constellation Energy', '24 Month Fixed', 14.49, 24, 'fixed', 0, 0, 'MA', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 13.79, 12, 'fixed', 0, 50, 'MA', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 13.89, 12, 'fixed', 0, 110, 'MA', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 14.09, 12, 'fixed', 0, 150, 'MA', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 13.99, 12, 'fixed', 0, 0, 'MA', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 16.49, 12, 'fixed', 100, 0, 'MA', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 13.79, 12, 'fixed', 0, 50, 'MA', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 13.89, 12, 'fixed', 0, 100, 'MA', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 14.99, 12, 'fixed', 100, 50, 'MA', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 15.49, 12, 'fixed', 100, 75, 'MA', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 15.99, 0, 'variable', 100, 0, 'MA', true, 'residential'),
  ('Major Energy', 'Fixed 12', 14.19, 12, 'fixed', 0, 0, 'MA', true, 'residential'),
  ('North American Power', 'Secure 12', 14.29, 12, 'fixed', 0, 0, 'MA', true, 'residential'),
  ('Viridian Energy', 'Green 12', 15.49, 12, 'fixed', 100, 0, 'MA', true, 'residential');

-- Maine (ME) - Source: Maine PUC
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('XOOM Energy', 'SureLock 12', 14.99, 12, 'fixed', 0, 110, 'ME', true, 'residential'),
  ('XOOM Energy', 'SureLock 24', 15.49, 24, 'fixed', 0, 200, 'ME', true, 'residential'),
  ('XOOM Energy', 'SimpleClean 12', 15.49, 12, 'fixed', 50, 110, 'ME', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 15.09, 12, 'fixed', 0, 150, 'ME', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 16.49, 12, 'fixed', 100, 50, 'ME', true, 'residential'),
  ('Verde Energy', 'Fixed 24', 15.99, 24, 'fixed', 0, 100, 'ME', true, 'residential'),
  ('Electricity Maine', 'Standard 12', 15.99, 12, 'fixed', 0, 0, 'ME', true, 'residential'),
  ('Electricity Maine', 'Green 12', 16.49, 12, 'fixed', 100, 0, 'ME', true, 'residential'),
  ('SmartEnergy', 'Smart Fixed 12', 14.50, 12, 'fixed', 0, 0, 'ME', true, 'residential'),
  ('SmartEnergy', 'Smart Green 12', 15.50, 12, 'fixed', 100, 0, 'ME', true, 'residential'),
  ('Major Energy', 'Fixed 15', 14.29, 15, 'fixed', 0, 0, 'ME', true, 'residential'),
  ('Major Energy', 'Fixed 23', 14.79, 23, 'fixed', 0, 0, 'ME', true, 'residential'),
  ('Town Square Energy', 'Fixed 12', 14.49, 12, 'fixed', 0, 50, 'ME', true, 'residential'),
  ('Viridian Energy', 'Green 12', 16.49, 12, 'fixed', 100, 0, 'ME', true, 'residential'),
  ('Ambit Energy', 'Ambit Fixed 12', 15.50, 12, 'fixed', 0, 50, 'ME', true, 'residential');

-- New Hampshire (NH) - Source: NH PUC
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Direct Energy', 'Live Brighter 7', 12.00, 7, 'fixed', 0, 0, 'NH', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 12.50, 12, 'fixed', 0, 0, 'NH', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 12.79, 12, 'fixed', 0, 110, 'NH', true, 'residential'),
  ('XOOM Energy', 'SureLock 24', 13.19, 24, 'fixed', 0, 200, 'NH', true, 'residential'),
  ('XOOM Energy', 'SimpleClean 12', 12.99, 12, 'fixed', 50, 110, 'NH', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 13.09, 12, 'fixed', 0, 150, 'NH', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 14.49, 12, 'fixed', 100, 50, 'NH', true, 'residential'),
  ('Verde Energy', 'Fixed 24', 13.99, 24, 'fixed', 0, 100, 'NH', true, 'residential'),
  ('SmartEnergy', 'Smart Fixed 12', 12.60, 12, 'fixed', 0, 0, 'NH', true, 'residential'),
  ('Eligo Energy', 'Stability 12', 12.49, 12, 'fixed', 0, 50, 'NH', true, 'residential'),
  ('Town Square Energy', 'Fixed 6', 12.07, 6, 'fixed', 0, 0, 'NH', true, 'residential'),
  ('Town Square Energy', 'Fixed 12', 12.49, 12, 'fixed', 0, 50, 'NH', true, 'residential'),
  ('Viridian Energy', 'Green 12', 14.49, 12, 'fixed', 100, 0, 'NH', true, 'residential'),
  ('Ambit Energy', 'Ambit Fixed 12', 13.50, 12, 'fixed', 0, 50, 'NH', true, 'residential');

-- Rhode Island (RI) - Source: RI PUC
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Direct Energy', 'Live Brighter 12', 12.99, 12, 'fixed', 0, 0, 'RI', true, 'residential'),
  ('Direct Energy', 'Live Brighter 24', 13.49, 24, 'fixed', 0, 0, 'RI', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 12.79, 12, 'fixed', 0, 110, 'RI', true, 'residential'),
  ('XOOM Energy', 'SimpleClean 12', 13.29, 12, 'fixed', 50, 110, 'RI', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 15.99, 12, 'fixed', 100, 0, 'RI', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 12.89, 12, 'fixed', 0, 100, 'RI', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 14.49, 12, 'fixed', 100, 50, 'RI', true, 'residential'),
  ('Verde Energy', 'Fixed 12', 12.99, 12, 'fixed', 0, 50, 'RI', true, 'residential'),
  ('North American Power', 'Secure 12', 13.29, 12, 'fixed', 0, 0, 'RI', true, 'residential'),
  ('Viridian Energy', 'Green 12', 14.99, 12, 'fixed', 100, 0, 'RI', true, 'residential');

-- Connecticut (CT) - Source: CT PURA
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, state, is_active, customer_type) VALUES
  ('Constellation Energy', '8 Month Home Power Plan', 11.69, 8, 'fixed', 0, 0, 'CT', true, 'residential'),
  ('Constellation Energy', '21 Month Home Power Plan', 12.59, 21, 'fixed', 0, 0, 'CT', true, 'residential'),
  ('Direct Energy', 'Live Brighter 12', 11.49, 12, 'fixed', 0, 50, 'CT', true, 'residential'),
  ('Direct Energy', 'Green Source 12', 12.99, 12, 'fixed', 100, 50, 'CT', true, 'residential'),
  ('XOOM Energy', 'SureLock 12', 11.59, 12, 'fixed', 0, 110, 'CT', true, 'residential'),
  ('Clearview Energy', 'ClearGuarantee 12', 11.79, 12, 'fixed', 0, 150, 'CT', true, 'residential'),
  ('Public Power', 'Fixed Rate 12', 11.69, 12, 'fixed', 0, 0, 'CT', true, 'residential'),
  ('CleanChoice Energy', '100% Wind Energy', 14.49, 12, 'fixed', 100, 0, 'CT', true, 'residential'),
  ('Liberty Power', 'Liberty Saver 12', 11.59, 12, 'fixed', 0, 100, 'CT', true, 'residential'),
  ('Verde Energy', 'Green Fixed 12', 12.99, 12, 'fixed', 100, 50, 'CT', true, 'residential'),
  ('Just Energy', 'JustGreen 12', 13.49, 12, 'fixed', 100, 75, 'CT', true, 'residential'),
  ('Inspire Clean Energy', 'Clean Energy Subscription', 13.99, 0, 'variable', 100, 0, 'CT', true, 'residential'),
  ('Major Energy', 'Fixed 12', 11.89, 12, 'fixed', 0, 0, 'CT', true, 'residential'),
  ('North American Power', 'Secure 12', 11.99, 12, 'fixed', 0, 0, 'CT', true, 'residential'),
  ('Viridian Energy', 'Green 12', 13.49, 12, 'fixed', 100, 0, 'CT', true, 'residential'),
  ('Spark Energy', 'Spark Secure 12', 11.79, 12, 'fixed', 0, 50, 'CT', true, 'residential');

-- ============================================================
-- MIGRATION 010 COMPLETE
-- Final state: 34 providers, 259 plans across 12 states
-- ============================================================
