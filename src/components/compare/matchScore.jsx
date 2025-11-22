// Calculate how well a plan matches user preferences
export function calculateMatchScore(plan, preferences, propertyType, businessInfo = {}) {
  let score = 0;
  let maxScore = 0;
  const reasons = [];
  const usage = preferences.monthlyUsage || businessInfo.monthlyUsage || 1000;

  // Plan type preference (20 points)
  if (preferences.fixedRate || preferences.variableRate) {
    maxScore += 20;
    if (plan.plan_type === 'fixed' && preferences.fixedRate) {
      score += 20;
      reasons.push('Fixed rate as preferred');
    } else if (plan.plan_type === 'variable' && preferences.variableRate) {
      score += 20;
      reasons.push('Variable rate as preferred');
    }
  }

  // Contract length preference - more specific (25 points)
  if (preferences.contractLength) {
    maxScore += 25;
    const preferredLength = parseInt(preferences.contractLength);
    const planLength = plan.contract_length || 1;
    
    if (planLength === preferredLength) {
      score += 25;
      reasons.push(`${preferredLength}-month contract match`);
    } else if (Math.abs(planLength - preferredLength) <= 6) {
      score += 15;
      reasons.push(`Similar contract term`);
    }
  } else if (preferences.twelveMonth) {
    maxScore += 25;
    if (plan.contract_length === 12) {
      score += 25;
      reasons.push('12-month contract match');
    } else if (plan.contract_length && plan.contract_length <= 6) {
      score += 15;
    }
  }

  // Renewable energy preference - more specific (20 points)
  if (preferences.renewablePercentage !== undefined) {
    maxScore += 20;
    const preferredRenewable = parseInt(preferences.renewablePercentage);
    const planRenewable = plan.renewable_percentage || 0;
    
    if (planRenewable >= preferredRenewable) {
      score += 20;
      if (preferredRenewable === 100 && planRenewable === 100) {
        reasons.push('100% renewable match');
      } else {
        reasons.push(`${planRenewable}% renewable energy`);
      }
    } else if (planRenewable >= preferredRenewable * 0.5) {
      score += 10;
    }
  } else if (preferences.renewable) {
    maxScore += 20;
    if (plan.renewable_percentage >= 50) {
      score += 20;
      reasons.push('Green energy as preferred');
    }
  }

  // Early termination fee tolerance (15 points)
  if (preferences.etfTolerance !== undefined) {
    maxScore += 15;
    const planETF = plan.early_termination_fee || 0;
    const maxETF = parseInt(preferences.etfTolerance);
    
    if (planETF <= maxETF) {
      score += 15;
      if (planETF === 0) {
        reasons.push('No early termination fee');
      } else {
        reasons.push(`Low cancellation fee ($${planETF})`);
      }
    } else if (planETF <= maxETF * 1.5) {
      score += 8;
    }
  }

  // Usage-based value score (20 points) - dynamic based on actual monthly cost
  maxScore += 20;
  const monthlyBill = (plan.rate_per_kwh / 100) * usage + (plan.monthly_base_charge || 0);
  const marketAverage = (10.5 / 100) * usage + 10; // Adjust based on market
  const valueScore = Math.max(0, Math.min(20, ((marketAverage - monthlyBill) / marketAverage) * 40));
  score += Math.round(valueScore);
  if (valueScore >= 15) {
    reasons.push(`Excellent value at ${usage} kWh/month`);
  } else if (valueScore >= 10) {
    reasons.push(`Good value for your usage`);
  }

  // Property type alignment (20 points)
  maxScore += 20;
  if (propertyType === 'business' && plan.plan_name?.toLowerCase().includes('business')) {
    score += 20;
    reasons.push('Business-optimized plan');
  } else if (propertyType === 'apartment' && plan.contract_length && plan.contract_length <= 12) {
    score += 18;
    reasons.push('Flexible term for apartments');
  } else if (propertyType === 'home' && plan.contract_length >= 12) {
    score += 18;
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