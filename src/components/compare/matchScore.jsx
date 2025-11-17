// Calculate how well a plan matches user preferences
export function calculateMatchScore(plan, preferences, propertyType, businessInfo) {
  let score = 0;
  let maxScore = 0;
  const reasons = [];

  // Base preferences (worth 25 points each)
  if (preferences.fixedRate !== undefined) {
    maxScore += 25;
    if (plan.plan_type === 'fixed' && preferences.fixedRate) {
      score += 25;
      reasons.push('Fixed rate as preferred');
    } else if (plan.plan_type === 'variable' && preferences.variableRate) {
      score += 25;
      reasons.push('Variable rate as preferred');
    }
  }

  // Contract length preference (25 points)
  if (preferences.twelveMonth !== undefined) {
    maxScore += 25;
    if (preferences.twelveMonth && plan.contract_length === 12) {
      score += 25;
      reasons.push('12-month contract match');
    } else if (!preferences.twelveMonth && plan.contract_length && plan.contract_length <= 6) {
      score += 20;
      reasons.push('Short-term contract');
    }
  }

  // Renewable energy preference (25 points)
  if (preferences.renewable !== undefined) {
    maxScore += 25;
    if (preferences.renewable && plan.renewable_percentage >= 50) {
      score += 25;
      reasons.push('Green energy as preferred');
    } else if (!preferences.renewable && (!plan.renewable_percentage || plan.renewable_percentage < 25)) {
      score += 15;
    }
  }

  // Property type alignment (25 points)
  maxScore += 25;
  if (propertyType === 'business' && plan.plan_name?.toLowerCase().includes('business')) {
    score += 25;
    reasons.push('Business-optimized plan');
  } else if (propertyType === 'apartment' && plan.contract_length && plan.contract_length <= 12) {
    score += 20;
    reasons.push('Flexible term for apartments');
  } else if (propertyType === 'home' && plan.contract_length >= 12) {
    score += 22;
    reasons.push('Stable long-term plan');
  } else {
    score += 10;
  }

  // Calculate percentage score
  const percentageScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 75;

  return {
    score: percentageScore,
    reasons: reasons.slice(0, 3),
    tier: percentageScore >= 90 ? 'excellent' : percentageScore >= 75 ? 'great' : percentageScore >= 60 ? 'good' : 'fair'
  };
}

// Calculate annual savings compared to average
export function calculateSavings(plan, usage, averageRate = 10.5) {
  const planMonthlyBill = (plan.rate_per_kwh / 100) * usage + (plan.monthly_base_charge || 0);
  const averageMonthlyBill = (averageRate / 100) * usage + 10;
  const monthlySavings = averageMonthlyBill - planMonthlyBill;
  const annualSavings = monthlySavings * 12;
  
  return {
    monthly: Math.round(monthlySavings),
    annual: Math.round(annualSavings),
    isSaving: annualSavings > 0
  };
}

// Generate plan summary
export function generatePlanSummary(plan, usage) {
  const monthlyBill = (plan.rate_per_kwh / 100) * usage + (plan.monthly_base_charge || 0);
  const savings = calculateSavings(plan, usage);
  
  return {
    monthlyBill: Math.round(monthlyBill),
    baseCharge: plan.monthly_base_charge || 0,
    earlyTermFee: plan.early_termination_fee || 0,
    contractTerm: plan.contract_length || 'No contract',
    renewablePercent: plan.renewable_percentage || 0,
    totalFirstYear: Math.round(monthlyBill * 12),
    potentialSavings: savings.annual,
    features: plan.features || []
  };
}