import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, Building2, Zap, Leaf, Clock, CheckCircle } from "lucide-react";
import { validateZipCode } from "../components/compare/stateData";

export default function CompareRates() {
  const [step, setStep] = useState(1);
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [preferences, setPreferences] = useState({
    fixedRate: false,
    variableRate: false,
    renewable: false,
    twelveMonth: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load ZIP code from URL or localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const zipFromUrl = urlParams.get('zip');
    const savedZip = localStorage.getItem('compareRatesZip');
    
    if (zipFromUrl && zipFromUrl.length === 5) {
      const validation = validateZipCode(zipFromUrl);
      if (validation.valid) {
        setZipCode(zipFromUrl);
        localStorage.setItem('compareRatesZip', zipFromUrl);
        setStep(2); // Skip to step 2
      }
    } else if (savedZip && savedZip.length === 5) {
      setZipCode(savedZip);
      setStep(2); // Skip to step 2
    }
  }, []);

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => base44.entities.ElectricityPlan.list(),
    initialData: [],
  });

  const handleZipSubmit = () => {
    setZipError("");
    
    if (zipCode.length !== 5) {
      setZipError("Please enter a valid 5-digit ZIP code");
      return;
    }

    const validation = validateZipCode(zipCode);
    if (!validation.valid) {
      setZipError(validation.error || "This ZIP code is not in a deregulated electricity market");
      return;
    }

    localStorage.setItem('compareRatesZip', zipCode);
    setStep(2);
  };

  const handlePropertyTypeSubmit = () => {
    if (!propertyType) return;
    setStep(3);
  };

  const handlePreferencesSubmit = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter plans based on preferences
  const filteredPlans = plans.filter(plan => {
    if (preferences.fixedRate && plan.plan_type !== 'fixed') return false;
    if (preferences.variableRate && plan.plan_type !== 'variable') return false;
    if (preferences.renewable && (!plan.renewable_percentage || plan.renewable_percentage < 50)) return false;
    if (preferences.twelveMonth && plan.contract_length !== 12) return false;
    return true;
  });

  // Get top 3 recommended plans (lowest rates)
  const sortedPlans = [...filteredPlans].sort((a, b) => a.rate_per_kwh - b.rate_per_kwh);
  const topPlans = sortedPlans.slice(0, 3);
  const otherPlans = sortedPlans.slice(3);

  // Calculate estimated bill (assuming 1000 kWh usage)
  const calculateBill = (plan) => {
    return ((plan.rate_per_kwh / 100) * 1000 + (plan.monthly_base_charge || 0)).toFixed(2);
  };

  // Loading Animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#0A5C8C] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Finding Your Best Rates</h2>
          <p className="text-sm text-gray-600">Comparing plans from 40+ providers...</p>
        </div>
      </div>
    );
  }

  // Results Page
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header with Success Message */}
        <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h1 className="text-3xl lg:text-4xl font-bold">We Found Your Best Deals!</h1>
            </div>
            <p className="text-lg text-blue-100 mb-2">
              Comparing {filteredPlans.length} plans from 40+ providers in your area
            </p>
            <p className="text-sm text-blue-200">
              ZIP Code: {zipCode} • {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} • Based on 1,000 kWh usage
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top 3 Recommended Plans - Sleek Cards */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Best Deals for You</h2>
                <p className="text-sm text-gray-600">Lowest rates available in your area</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {topPlans.map((plan, index) => (
                <Card key={plan.id} className="relative overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-2xl group">
                  {/* Best Deal Badge */}
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-br from-[#FF6B35] to-[#e55a2b] text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-lg">
                      #{index + 1} BEST DEAL
                    </div>
                  </div>
                  
                  {/* Accent Border */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#FF6B35] to-[#e55a2b]"></div>
                  
                  <CardContent className="p-6 pl-8">
                    {/* Provider Logo/Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {plan.provider_name.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                      {plan.renewable_percentage >= 50 && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          <Leaf className="w-3 h-3" />
                          {plan.renewable_percentage}% Green
                        </div>
                      )}
                    </div>
                    
                    {/* Provider & Plan Name */}
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.provider_name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{plan.plan_name}</p>
                    
                    {/* Rate Highlight */}
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">Energy Rate</div>
                        <div className="text-4xl font-bold text-[#0A5C8C] mb-1">{plan.rate_per_kwh}¢</div>
                        <div className="text-xs text-gray-500">per kWh</div>
                      </div>
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Est. Monthly</div>
                        <div className="text-lg font-bold text-gray-900">${calculateBill(plan)}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Contract</div>
                        <div className="text-lg font-bold text-gray-900">{plan.contract_length || 'Variable'} mo</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#e55a2b] hover:from-[#e55a2b] hover:to-[#cc4a1f] text-white font-bold shadow-lg group-hover:shadow-xl transition-all">
                      Select This Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Other Plans - Table View */}
          {otherPlans.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">More Available Plans</h2>
                <p className="text-sm text-gray-600">Additional options in your area</p>
              </div>
              
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Provider & Plan</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Est. Monthly</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Contract</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {otherPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-[#0A5C8C]">
                                {plan.provider_name.substring(0, 3).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{plan.provider_name}</div>
                              <div className="text-xs text-gray-500">{plan.plan_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-xl font-bold text-[#0A5C8C]">{plan.rate_per_kwh}¢</div>
                          <div className="text-xs text-gray-500">per kWh</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-lg font-bold text-gray-900">${calculateBill(plan)}</div>
                          <div className="text-xs text-gray-500">@ 1000 kWh</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-gray-900">{plan.contract_length || 'Variable'} months</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                              {plan.plan_type}
                            </span>
                            {plan.renewable_percentage >= 50 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                <Leaf className="w-3 h-3 mr-1" />
                                Green
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button size="sm" variant="outline" className="hover:bg-[#0A5C8C] hover:text-white transition-colors">
                            View Plan
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {otherPlans.map((plan) => (
                  <Card key={plan.id} className="border-2 hover:border-[#0A5C8C] transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-[#0A5C8C]">
                              {plan.provider_name.substring(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{plan.provider_name}</div>
                            <div className="text-xs text-gray-500">{plan.plan_name}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                          {plan.plan_type}
                        </span>
                        {plan.renewable_percentage >= 50 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <Leaf className="w-3 h-3 mr-1" />
                            Green
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 rounded-lg p-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Rate</div>
                          <div className="text-base font-bold text-[#0A5C8C]">{plan.rate_per_kwh}¢</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Monthly</div>
                          <div className="text-base font-bold text-gray-900">${calculateBill(plan)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">Term</div>
                          <div className="text-sm font-semibold text-gray-900">{plan.contract_length || 'Var'} mo</div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full hover:bg-[#0A5C8C] hover:text-white transition-colors">
                        View Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No plans match your preferences. Try adjusting your filters.</p>
              <Button onClick={() => { setShowResults(false); setStep(3); }} variant="outline">
                Adjust Preferences
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 1: ZIP Code
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A5C8C] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Your ZIP Code</h1>
            <p className="text-sm text-gray-600">We'll find the best electricity rates in your area</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Enter 5-digit ZIP code"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value.replace(/\D/g, ''));
                    setZipError("");
                  }}
                  maxLength={5}
                  className="h-12 text-center text-lg font-semibold"
                  onKeyPress={(e) => e.key === 'Enter' && handleZipSubmit()}
                />
                {zipError && (
                  <p className="text-xs text-red-600 mt-2">{zipError}</p>
                )}
              </div>

              <Button 
                onClick={handleZipSubmit}
                className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white h-12"
                disabled={zipCode.length !== 5}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Property Type
  if (step === 2) {
    const propertyTypes = [
      { value: 'home', label: 'Home', icon: Home, desc: 'Single family house' },
      { value: 'apartment', label: 'Apartment', icon: Building2, desc: 'Apartment or condo' },
      { value: 'business', label: 'Business', icon: Building2, desc: 'Commercial property' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A5C8C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">What Type of Property?</h1>
            <p className="text-sm text-gray-600">This helps us show you the most relevant plans</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {propertyTypes.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  propertyType === type.value 
                    ? 'border-2 border-[#0A5C8C] bg-blue-50' 
                    : 'border-2 border-transparent hover:border-gray-300'
                }`}
                onClick={() => setPropertyType(type.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <type.icon className="w-6 h-6 text-[#0A5C8C]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{type.label}</h3>
                  <p className="text-xs text-gray-600">{type.desc}</p>
                  {propertyType === type.value && (
                    <CheckCircle className="w-5 h-5 text-[#0A5C8C] mx-auto mt-3" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handlePropertyTypeSubmit}
            className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white h-12"
            disabled={!propertyType}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Plan Preferences
  if (step === 3) {
    const preferenceOptions = [
      { key: 'fixedRate', label: 'Fixed Rate Plans', icon: Clock, desc: 'Locked-in rates for contract term' },
      { key: 'variableRate', label: 'Variable Rate Plans', icon: Zap, desc: 'Rates change monthly' },
      { key: 'renewable', label: 'Renewable Energy', icon: Leaf, desc: '50%+ green energy' },
      { key: 'twelveMonth', label: '12 Month Plans', icon: Clock, desc: 'One year contracts' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A5C8C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">What Are You Looking For?</h1>
            <p className="text-sm text-gray-600">Select all that apply (or skip to see all plans)</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-3">
                {preferenceOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      preferences[option.key]
                        ? 'border-[#0A5C8C] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => togglePreference(option.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        preferences[option.key]
                          ? 'bg-[#0A5C8C] border-[#0A5C8C]'
                          : 'border-gray-300'
                      }`}>
                        {preferences[option.key] && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <option.icon className="w-5 h-5 text-[#0A5C8C]" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handlePreferencesSubmit}
            className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white h-12"
          >
            Show My Rates
          </Button>
        </div>
      </div>
    );
  }

  return null;
}