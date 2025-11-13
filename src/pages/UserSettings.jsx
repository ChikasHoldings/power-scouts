import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  User, Zap, TrendingUp, Calendar, Save, Upload, 
  AlertCircle, CheckCircle, Settings, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Usage data state
  const [usageData, setUsageData] = useState({
    avgMonthlyKwh: 1000,
    peakMonths: [],
    usagePattern: 'average', // average, high-daytime, high-evening, high-weekend
    householdSize: '2-3',
    homeType: 'apartment'
  });

  const [monthlyUsage, setMonthlyUsage] = useState({
    january: '',
    february: '',
    march: '',
    april: '',
    may: '',
    june: '',
    july: '',
    august: '',
    september: '',
    october: '',
    november: '',
    december: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load saved usage data if exists
      if (currentUser.usageData) {
        setUsageData(currentUser.usageData);
      }
      if (currentUser.monthlyUsage) {
        setMonthlyUsage(currentUser.monthlyUsage);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageFromMonthly = () => {
    const values = Object.values(monthlyUsage).filter(v => v !== '').map(Number);
    if (values.length === 0) return usageData.avgMonthlyKwh;
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return avg;
  };

  const identifyPeakMonths = () => {
    const entries = Object.entries(monthlyUsage)
      .filter(([_, value]) => value !== '')
      .map(([month, value]) => ({ month, value: Number(value) }));
    
    if (entries.length < 3) return [];
    
    const avg = entries.reduce((sum, e) => sum + e.value, 0) / entries.length;
    const peaks = entries
      .filter(e => e.value > avg * 1.2)
      .map(e => e.month);
    
    return peaks;
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      // Calculate average if monthly data provided
      const calculatedAvg = calculateAverageFromMonthly();
      const peaks = identifyPeakMonths();
      
      const updatedUsageData = {
        ...usageData,
        avgMonthlyKwh: calculatedAvg,
        peakMonths: peaks.length > 0 ? peaks : usageData.peakMonths
      };
      
      await base44.auth.updateMe({
        usageData: updatedUsageData,
        monthlyUsage
      });
      
      setUsageData(updatedUsageData);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadBill = () => {
    // Placeholder for future bill upload feature
    alert('Bill upload feature coming soon! For now, please enter your usage manually.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A5C8C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-[#0A5C8C]" />
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          </div>
          <p className="text-gray-600">
            Personalize your electricity comparison experience with your usage data
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Full Name</Label>
                <p className="font-semibold text-gray-900">{user?.full_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Email</Label>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Usage Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5" />
              Quick Usage Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="avgUsage" className="text-sm font-semibold text-gray-700">
                Average Monthly Usage (kWh)
              </Label>
              <Input
                id="avgUsage"
                type="number"
                value={usageData.avgMonthlyKwh}
                onChange={(e) => setUsageData({ ...usageData, avgMonthlyKwh: Number(e.target.value) })}
                className="mt-1"
                placeholder="1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this on your electricity bill. Average US home: 900-1200 kWh
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Household Size</Label>
                <select
                  value={usageData.householdSize}
                  onChange={(e) => setUsageData({ ...usageData, householdSize: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A5C8C] focus:border-transparent"
                >
                  <option value="1">1 person</option>
                  <option value="2-3">2-3 people</option>
                  <option value="4-5">4-5 people</option>
                  <option value="6+">6+ people</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">Home Type</Label>
                <select
                  value={usageData.homeType}
                  onChange={(e) => setUsageData({ ...usageData, homeType: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A5C8C] focus:border-transparent"
                >
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="single-family">Single Family Home</option>
                  <option value="large-home">Large Home (3000+ sq ft)</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Usage Pattern</Label>
              <select
                value={usageData.usagePattern}
                onChange={(e) => setUsageData({ ...usageData, usagePattern: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A5C8C] focus:border-transparent"
              >
                <option value="average">Average throughout day</option>
                <option value="high-daytime">High daytime usage (work from home)</option>
                <option value="high-evening">High evening usage (after 6pm)</option>
                <option value="high-weekend">High weekend usage</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Helps recommend plans with free nights/weekends if beneficial
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleUploadBill}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Bill (Coming Soon)
              </Button>
              <span className="text-xs text-gray-500">
                Automatically extract usage data from your bill
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Monthly Usage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Monthly Usage Details (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enter your actual usage by month for more accurate recommendations
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.keys(monthlyUsage).map((month) => (
                <div key={month}>
                  <Label className="text-sm font-medium text-gray-700 capitalize">
                    {month}
                  </Label>
                  <Input
                    type="number"
                    value={monthlyUsage[month]}
                    onChange={(e) => setMonthlyUsage({ ...monthlyUsage, [month]: e.target.value })}
                    placeholder="kWh"
                    className="mt-1"
                  />
                </div>
              ))}
            </div>

            {Object.values(monthlyUsage).some(v => v !== '') && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Usage Analysis</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Calculated Average: {calculateAverageFromMonthly()} kWh/month
                    </p>
                    {identifyPeakMonths().length > 0 && (
                      <p className="text-sm text-blue-700">
                        Peak months detected: {identifyPeakMonths().map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Insights */}
        {usageData.avgMonthlyKwh && (
          <Card className="mb-6 border-[#0A5C8C] border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Your Usage Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {usageData.avgMonthlyKwh < 800 ? 'Low Energy User' : 
                     usageData.avgMonthlyKwh < 1200 ? 'Average Energy User' : 
                     'High Energy User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your {usageData.avgMonthlyKwh} kWh/month usage is {
                      usageData.avgMonthlyKwh < 800 ? 'below' : 
                      usageData.avgMonthlyKwh < 1200 ? 'in line with' : 'above'
                    } the national average
                  </p>
                </div>
              </div>

              {usageData.usagePattern === 'high-evening' && (
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Evening Usage Pattern</p>
                    <p className="text-sm text-gray-600">
                      We'll recommend plans with free nights or lower evening rates
                    </p>
                  </div>
                </div>
              )}

              {usageData.usagePattern === 'high-weekend' && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Weekend Usage Pattern</p>
                    <p className="text-sm text-gray-600">
                      Consider plans with free weekends to maximize savings
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <Link to={createPageUrl("CompareRates")}>
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white">
                    View Personalized Recommendations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Link to={createPageUrl("Home")}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#0A5C8C] hover:bg-[#084a6f] text-white flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}