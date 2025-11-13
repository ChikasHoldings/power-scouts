import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, Zap, Star, Calendar, Clock, 
  Leaf, AlertCircle, CheckCircle, Target
} from "lucide-react";

export default function PersonalizedRecommendations({ plans, usageData, usage }) {
  if (!usageData || !usageData.avgMonthlyKwh) {
    return null;
  }

  // Analyze plans and provide recommendations
  const analyzePlans = () => {
    return plans.map(plan => {
      let score = 0;
      let reasons = [];
      let warnings = [];

      // Calculate actual cost based on user's usage
      const estimatedCost = (plan.rate_per_kwh * usage / 100) + (plan.monthly_base_charge || 0);

      // Score based on rate
      if (plan.rate_per_kwh < 9) {
        score += 3;
        reasons.push('Excellent rate');
      } else if (plan.rate_per_kwh < 10) {
        score += 2;
        reasons.push('Good rate');
      } else if (plan.rate_per_kwh < 11) {
        score += 1;
        reasons.push('Fair rate');
      }

      // Score based on contract length vs stability preference
      if (plan.contract_length >= 12 && plan.contract_length <= 24) {
        score += 2;
        reasons.push('Optimal contract length');
      }

      // Usage pattern matching
      if (usageData.usagePattern === 'high-evening' && plan.features?.some(f => 
        f.toLowerCase().includes('free nights') || f.toLowerCase().includes('evening')
      )) {
        score += 3;
        reasons.push('Matches your evening usage pattern');
      }

      if (usageData.usagePattern === 'high-weekend' && plan.features?.some(f => 
        f.toLowerCase().includes('free weekend')
      )) {
        score += 3;
        reasons.push('Matches your weekend usage pattern');
      }

      // Renewable energy preference for environmentally conscious users
      if (plan.renewable_percentage >= 50) {
        score += 1;
        reasons.push('Renewable energy option');
      }

      // Plan type preference
      if (plan.plan_type === 'fixed') {
        score += 1;
        reasons.push('Fixed rate stability');
      }

      // Early termination fee warning
      if (plan.early_termination_fee > 150) {
        warnings.push(`High early termination fee: $${plan.early_termination_fee}`);
      }

      // Usage-based warnings
      if (usageData.avgMonthlyKwh > 1500 && plan.monthly_base_charge > 10) {
        warnings.push('High base charge for your usage level');
      }

      return {
        ...plan,
        recommendationScore: score,
        reasons,
        warnings,
        estimatedMonthlyCost: estimatedCost
      };
    });
  };

  const analyzedPlans = analyzePlans();
  const topPicks = analyzedPlans
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 3);

  const bestValue = analyzedPlans
    .sort((a, b) => a.estimatedMonthlyCost - b.estimatedMonthlyCost)[0];

  return (
    <div className="mb-8 space-y-4">
      {/* Personalized Header */}
      <Card className="border-2 border-[#0A5C8C] bg-gradient-to-br from-blue-50 to-green-50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-[#0A5C8C] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Personalized for Your Usage
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Based on your {usageData.avgMonthlyKwh} kWh/month average usage and {usageData.usagePattern.replace('-', ' ')} pattern
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white text-gray-700 border border-gray-300">
                  {usageData.householdSize} household
                </Badge>
                <Badge className="bg-white text-gray-700 border border-gray-300 capitalize">
                  {usageData.homeType.replace('-', ' ')}
                </Badge>
                {usageData.peakMonths && usageData.peakMonths.length > 0 && (
                  <Badge className="bg-orange-100 text-orange-800 border border-orange-300">
                    Peak: {usageData.peakMonths.slice(0, 2).join(', ')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Value Highlight */}
      {bestValue && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">Lowest Cost for Your Usage</h4>
                  <Badge className="bg-green-600 text-white">Best Value</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">{bestValue.provider_name}</span> - {bestValue.plan_name}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold text-green-700">
                    ${bestValue.estimatedMonthlyCost.toFixed(2)}/month
                  </span>
                  <span className="text-gray-600">
                    {bestValue.rate_per_kwh}¢/kWh
                  </span>
                  <span className="text-gray-600">
                    {bestValue.contract_length} months
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Picks */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-[#FF6B35]" />
          Top Picks for You
        </h3>
        <div className="space-y-3">
          {topPicks.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`border ${
                index === 0 ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900">{plan.provider_name}</p>
                        <p className="text-sm text-gray-600">{plan.plan_name}</p>
                      </div>
                    </div>
                    
                    {/* Reasons */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {plan.reasons.slice(0, 3).map((reason, i) => (
                        <Badge 
                          key={i} 
                          className="bg-blue-100 text-blue-800 text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    {/* Warnings */}
                    {plan.warnings.length > 0 && (
                      <div className="flex items-start gap-1.5 text-xs text-orange-700 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{plan.warnings[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-[#0A5C8C]">
                      ${plan.estimatedMonthlyCost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">est. monthly</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {plan.rate_per_kwh}¢/kWh
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pattern-Specific Recommendations */}
      {usageData.usagePattern === 'high-evening' && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Evening Usage Tip</h4>
                <p className="text-sm text-gray-700">
                  Look for plans with "Free Nights" or lower evening rates to maximize savings on your after-6pm usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {usageData.usagePattern === 'high-weekend' && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Weekend Usage Tip</h4>
                <p className="text-sm text-gray-700">
                  Consider plans offering free weekend electricity to take advantage of your Saturday/Sunday usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}