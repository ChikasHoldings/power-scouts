-- ============================================================
-- Migration 009: Replace providers and plans with verified PTC data
-- Source: Power to Choose (PUC Texas) - February 2026
-- Only providers with confirmed affiliate programs are included.
-- ============================================================
BEGIN;

-- Step 1: Add unique constraint on provider name (needed for future upserts)
ALTER TABLE public.electricity_providers ADD CONSTRAINT electricity_providers_name_key UNIQUE (name);

-- Step 2: Delete ALL existing plans
DELETE FROM public.electricity_plans;

-- Step 3: Delete ALL existing providers
DELETE FROM public.electricity_providers;

-- Step 4: Insert verified providers with confirmed affiliate programs
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('APG&E', 'APG&E offers competitive fixed and variable rate electricity plans to residential and commercial customers across Texas.', 'https://www.apge.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Ambit Energy', 'Ambit Energy provides electricity and natural gas services through a network of independent consultants across multiple deregulated states.', 'https://www.ambitenergy.com', ARRAY['TX','IL','NY','PA','MD','NJ','CT'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Champion Energy', 'Champion Energy Services offers a variety of fixed-rate and renewable electricity plans for Texas homes and businesses.', 'https://www.championenergyservices.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Chariot Energy', 'Chariot Energy is a 100% solar-powered electricity provider offering affordable clean energy plans across Texas.', 'https://www.chariotenergy.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Cirro Energy', 'Cirro Energy provides simple, straightforward electricity plans with competitive rates for Texas residential customers.', 'https://www.cirroenergy.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Constellation Energy', 'Constellation is one of the largest competitive energy suppliers in the US, offering electricity and natural gas plans nationwide.', 'https://www.constellation.com', ARRAY['TX','IL','MD','NJ','NY','OH','PA'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Direct Energy', 'Direct Energy is a leading North American retail energy provider offering electricity, natural gas, and home services.', 'https://www.directenergy.com', ARRAY['TX','OH','PA','IL','MA','NH','NJ','NY'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Discount Power', 'Discount Power offers some of the lowest electricity rates in Texas with straightforward, no-gimmick pricing.', 'https://www.discountpowertx.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Frontier Utilities', 'Frontier Utilities provides affordable electricity plans with flexible terms and excellent customer service in Texas.', 'https://www.frontierutilities.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Gexa Energy', 'Gexa Energy offers competitive fixed-rate electricity plans with options for renewable energy across Texas.', 'https://www.gexaenergy.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Green Mountain Energy', 'Green Mountain Energy is America''s longest-serving 100% renewable energy retailer, offering clean electricity from wind and solar.', 'https://www.greenmountainenergy.com', ARRAY['TX','IL','PA','NY','MA','NJ','MD','OR'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Just Energy', 'Just Energy provides electricity and natural gas plans with fixed-rate options and green energy choices across North America.', 'https://www.justenergy.com', ARRAY['TX','IL','OH','PA','NY','NJ','MD','GA','AB','ON'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Octopus Energy', 'Octopus Energy offers 100% renewable electricity plans at affordable prices, backed by innovative technology and excellent service.', 'https://octopusenergy.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Payless Power', 'Payless Power offers prepaid and no-deposit electricity plans, making it easy for anyone to get power in Texas.', 'https://www.paylesspower.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Reliant Energy', 'Reliant is one of Texas''s largest and most trusted electricity providers, offering a wide range of plans for homes and businesses.', 'https://www.reliant.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Rhythm Energy', 'Rhythm Energy offers simple, transparent electricity plans powered by 100% renewable energy in Texas.', 'https://www.gotrhythm.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Spark Energy', 'Spark Energy provides electricity and natural gas services across 19 states with competitive rates and flexible plan options.', 'https://www.sparkenergy.com', ARRAY['TX','CT','IL','MA','MD','NJ','NY','OH','PA'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('TXU Energy', 'TXU Energy is one of the oldest and largest electricity providers in Texas, offering a wide variety of plans including solar and free nights options.', 'https://www.txu.com', ARRAY['TX'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('Think Energy', 'Think Energy offers competitive electricity rates with a unique Free Energy Club referral program across multiple states.', 'https://www.thinkenergy.com', ARRAY['TX','CT','IL','MD','NJ','NY','OH','PA'], 4.5, true, false);
INSERT INTO public.electricity_providers (name, description, website_url, supported_states, rating, is_active, is_recommended)
VALUES ('TriEagle Energy', 'TriEagle Energy offers straightforward, affordable electricity plans with no hidden fees for Texas customers.', 'https://www.trieagleenergy.com', ARRAY['TX'], 4.5, true, false);

-- Step 5: Insert verified plans from Power to Choose (PUC Texas)
-- Rates shown are for CenterPoint Energy (Houston) service area at 1000 kWh usage
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'TrueClassic 18', 14.2, 18, 'variable', 6, 250.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'TrueClassic 36', 14.4, 36, 'variable', 6, 350.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'TrueClassic 12', 13.8, 12, 'variable', 6, 150.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'TrueClassic 24', 14.2, 24, 'variable', 6, 250.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'TrueClassic 3', 11.4, 3, 'variable', 6, 150.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('APG&E', 'True Classic 18', 14.7, 18, 'variable', 6, 250.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Ambit Energy', 'Lone Star Classic 12', 19.7, 12, 'variable', 3, 199.0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Champion Energy', 'Champ Saver-16', 15.4, 16, 'variable', 26, 250.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Champion Energy', 'Champ Saver-12', 15.5, 12, 'variable', 26, 150.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Champion Energy', 'Champ Saver-24', 15.3, 24, 'variable', 26, 250.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Champion Energy', 'Free Weekends-24', 15.4, 24, 'variable', 26, 250.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'Chariot Freedom', 18.9, 0, 'variable', 100, 0.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'Bright Nights 12', 13.2, 12, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'Bright Nights 24', 13.9, 24, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'Bright Nights 36', 13.9, 36, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'Bright Nights 15', 12.9, 15, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Chariot Energy', 'GridPlus 12', 8.8, 12, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Cirro Energy', 'Smart Simple 36', 15.7, 36, 'variable', 24, 395.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Cirro Energy', 'Smart Simple 12', 15.6, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Cirro Energy', 'Smart Simple 24', 15.6, 24, 'variable', 24, 295.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', '12 Month Usage Bill Credit', 13.1, 12, 'variable', 26, 150.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', '12 Month', 14.8, 12, 'variable', 26, 150.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', 'Simple Switch 3', 10.0, 3, 'variable', 26, 50.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', '12 Month A/C Protect Plus for 2 Units', 16.1, 12, 'variable', 26, 150.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', 'Simple Switch 4', 11.6, 4, 'variable', 26, 50.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', '5 Month Usage Bill Credit', 11.5, 5, 'variable', 26, 50.0, ARRAY['26% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Constellation Energy', '12 Month GREEN Usage Bill Credit', 16.9, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Direct Energy', 'Autopay Texas 18', 15.8, 18, 'variable', 24, 180.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Direct Energy', 'Autopay Texas 24', 16.1, 24, 'variable', 24, 295.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Direct Energy', 'Autopay Texas 36', 16.3, 36, 'variable', 24, 395.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Direct Energy', 'Autopay Texas 12', 15.8, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Discount Power', 'Saver 12', 15.5, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Discount Power', 'Saver 24', 15.5, 24, 'variable', 24, 295.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Discount Power', 'Saver 36', 15.6, 36, 'variable', 24, 395.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Discount Power', 'Discount Nights 24', 16.2, 24, 'variable', 24, 295.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Discount Power', 'Discount Nights 12', 16.2, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Frontier Utilities', 'Frontier Power Saver 3', 10.0, 3, 'variable', 30, 150.0, ARRAY['30% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Frontier Utilities', 'Frontier Power Saver 12', 13.7, 12, 'variable', 30, 150.0, ARRAY['30% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Gexa Energy', 'Gexa Eco Choice 12', 13.8, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Gexa Energy', 'Gexa Eco Choice 3', 10.1, 3, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Green Mountain Energy', 'Pollution Free e-Plus 24 Choice', 17.4, 24, 'variable', 100, 295.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Green Mountain Energy', 'Pollution Free e-Plus 12 Choice', 17.4, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Green Mountain Energy', 'Pollution Free e-Plus 36 Choice', 17.4, 36, 'variable', 100, 395.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Green Mountain Energy', 'Pollution Free e-Plus Choice', 17.9, 0, 'variable', 100, 0.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Green Mountain Energy', 'Pollution Free e-Plus 18 Choice', 17.9, 18, 'variable', 100, 180.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Just Energy', 'Sustainable Living Bundle - 3', 10.1, 3, 'variable', 31, 175.0, ARRAY['31% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Just Energy', 'Sustainable Days Bundle - 3', 10.1, 3, 'variable', 31, 175.0, ARRAY['31% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Just Energy', 'Smart Choice - 12', 9.3, 12, 'variable', 31, 175.0, ARRAY['31% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Just Energy', 'Basics PTC - 60', 16.5, 60, 'variable', 31, 175.0, ARRAY['31% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Just Energy', 'Basics PTC - 24', 16.5, 24, 'variable', 31, 175.0, ARRAY['31% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'Octo Green 12', 13.3, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'OctopusFlex', 14.7, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'Octopus Lite 12', 9.2, 12, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'Octo Simple 18', 14.7, 18, 'variable', 100, 200.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'Octo Simple 3', 10.6, 3, 'variable', 100, 150.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Octopus Energy', 'Octo Simple 24', 14.7, 24, 'variable', 100, 250.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Payless Power', 'PTC 6 Month - Prepaid', 16.5, 6, 'prepaid', 26, 49.0, ARRAY['26% Renewable','Prepaid'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Payless Power', 'PTC 12 Month - Prepaid', 17.1, 12, 'prepaid', 26, 49.0, ARRAY['26% Renewable','Prepaid'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power On Flex plan', 19.4, 0, 'variable', 24, 0.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power On Flex Plan', 19.4, 0, 'variable', 24, 0.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power On 12 Plan', 16.5, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power on 36 Plan', 16.7, 36, 'variable', 24, 395.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power On 18', 16.3, 18, 'variable', 15, 180.0, ARRAY['15% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power on 24 Plan', 17.9, 24, 'variable', 24, 295.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Reliant Energy', 'Reliant Power On 12 plan', 17.5, 12, 'variable', 24, 150.0, ARRAY['24% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Digital Choice 12', 14.5, 12, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Rhythm Saver 12', 11.0, 12, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Digital Choice 36', 14.7, 36, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Digital Choice 4', 11.3, 4, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Digital Choice 3', 10.7, 3, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Rhythm Energy', 'Rhythm Saver 24', 12.0, 24, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Spark Energy', 'Choose 12', 14.8, 12, 'variable', 35, 100.0, ARRAY['35% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Spark Energy', 'Choose 15', 14.5, 15, 'variable', 35, 100.0, ARRAY['35% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Spark Energy', 'Choose 6', 14.8, 6, 'variable', 35, 100.0, ARRAY['35% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Spark Energy', 'Choose 5', 17.4, 5, 'variable', 6, 100.0, ARRAY['6% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Think Energy', 'Think Clean 12', 15.3, 12, 'variable', 100, 200.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Think Energy', 'Think Clean 36', 15.9, 36, 'variable', 100, 200.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('Think Energy', 'Think Clean 12 with Smart Thermostat Connected', 14.3, 12, 'variable', 100, 200.0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Sure Value 36', 14.5, 36, 'variable', 3, 0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Simple Savings 36', 16.2, 36, 'variable', 3, 0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Simple Savings 12', 15.8, 12, 'variable', 3, 0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Simple Green 36', 17.2, 36, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Simple Green 12', 16.2, 12, 'variable', 100, 0, ARRAY['100% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TriEagle Energy', 'Simple Savings 28', 15.1, 28, 'variable', 3, 0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TXU Energy', 'Value Edge 12', 14.7, 12, 'variable', 3, 150.0, ARRAY['3% Renewable'], true);
INSERT INTO public.electricity_plans (provider_name, plan_name, rate_per_kwh, contract_length, plan_type, renewable_percentage, early_termination_fee, features, is_active)
VALUES ('TXU Energy', 'Simple Value 12', 16.9, 12, 'variable', 3, 150.0, ARRAY['3% Renewable'], true);

COMMIT;
