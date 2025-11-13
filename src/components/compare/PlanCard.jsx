import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Leaf, DollarSign, ExternalLink, Heart } from "lucide-react";

export default function PlanCard({ plan, usage, isSaved, onToggleSave }) {
  const estimatedCost = (plan.rate_per_kwh * usage / 100 + (plan.monthly_base_charge || 0)).toFixed(2);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
      {/* Save Button */}
      <button
        onClick={onToggleSave}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={isSaved ? "Remove from saved plans" : "Save plan"}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>

      <div className="grid md:grid-cols-4 gap-6 items-center">
        {/* Provider & Plan Info */}
        <div className="md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-teal-600">
                {plan.provider_name.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {plan.plan_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{plan.provider_name}</p>
              <div className="flex flex-wrap gap-2">
                {plan.plan_type && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {plan.plan_type}
                  </Badge>
                )}
                {plan.renewable_percentage >= 50 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Leaf className="w-3 h-3 mr-1" />
                    {plan.renewable_percentage}% Renewable
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rate Info */}
        <div className="text-center md:text-left">
          <div className="mb-2">
            <div className="text-3xl font-bold text-teal-600">
              {plan.rate_per_kwh.toFixed(1)}¢
            </div>
            <div className="text-sm text-gray-600">per kWh</div>
          </div>
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            {plan.contract_length} months
          </div>
        </div>

        {/* Estimated Cost & CTA */}
        <div className="text-center md:text-right">
          <div className="mb-3">
            <div className="text-2xl font-bold text-gray-900">
              ${estimatedCost}
            </div>
            <div className="text-sm text-gray-600">est. monthly at {usage} kWh</div>
          </div>
          <Button className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white">
            View Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      {plan.features && plan.features.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {plan.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-sm text-gray-600 flex items-center gap-1">
                <Zap className="w-3 h-3 text-teal-500" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}