# Data Accuracy & Consistency Guide

## Overview
This folder contains utilities to ensure accurate electricity rate comparisons across the ElectricScouts platform.

## Key Files

### `providerAvailability.js`
- **Purpose**: Maps ZIP codes to available electricity providers
- **Contains**: Provider logos, websites, service area ZIP codes
- **Functions**:
  - `getProvidersForZipCode(zip)` - Returns providers serving a ZIP
  - `providerServesZip(providerName, zip)` - Checks if provider serves ZIP
  - `getCityFromZip(zip)` - Returns city name for ZIP
  - `getProviderDetails(providerName)` - Returns provider info

### `stateData.js`
- **Purpose**: Validates ZIP codes against deregulated states
- **Contains**: State-level deregulation status, ZIP prefix mappings
- **Functions**:
  - `validateZipCode(zip)` - Checks if ZIP is in deregulated market
  - `getStateByZip(zip)` - Returns state code for ZIP
  - `getAllDeregulatedStates()` - Lists all deregulated states

### `dataValidation.js`
- **Purpose**: Ensures data consistency and accuracy
- **Contains**: Validation logic, filtering utilities
- **Functions**:
  - `validatePlanForZip(plan, zip)` - Checks plan availability
  - `filterPlansByZip(plans, zip)` - Filters plans by ZIP availability
  - `calculateMonthlyBill(plan, usage)` - Standardized bill calculation
  - `validateZipForComparison(zip)` - Comprehensive ZIP validation
  - `getRecommendedPlans(plans, zip, criteria)` - Smart plan recommendations

## Data Flow

```
User enters ZIP → validateZipCode() → getProvidersForZipCode()
                        ↓
                Database Plans → filterPlansByZip()
                        ↓
                Display only valid plans with accurate provider info
```

## Important Rules

1. **Always filter plans by ZIP code** before displaying
2. **Use centralized calculation functions** for consistency
3. **Validate provider names** against known provider list
4. **Show disclaimers** on all results pages
5. **Cross-reference** ZIP → City → State → Providers

## Updating Provider Data

To add a new provider to `providerAvailability.js`:
```javascript
"Provider Name": {
  name: "Provider Name",
  states: ["TX", "PA"], // States they operate in
  logo: "https://...", // Real logo URL
  website: "https://...", // Real website
  zipCodes: ["75201", "75202", ...] // All ZIPs they serve
}
```

## Database Plan Requirements

Plans in the ElectricityPlan entity should have:
- `provider_name` matching exactly with providerAvailability.js
- `zip_codes` array for ZIP-specific availability
- `cities` array for city-level filtering
- Accurate `rate_per_kwh`, `contract_length`, `plan_type`
- `renewable_percentage` for green energy filtering

## Compliance

All pages using this data should:
- Show data disclaimers
- State that rates are subject to change
- Encourage users to verify with providers
- Include "for comparison purposes" language