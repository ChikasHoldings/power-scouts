import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Zap, TrendingUp, Home, Clock, Save, CheckCircle, Upload, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Usage data state
  const [avgMonthlyKwh, setAvgMonthlyKwh] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [homeType, setHomeType] = useState("");
  const [usagePattern, setUsagePattern] = useState("");
  const [monthlyBreakdown, setMonthlyBreakdown] = useState(Array(12).fill(""));

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load existing usage data if available
      if (currentUser.usageData) {
        setAvgMonthlyKwh(currentUser.usageData.avgMonthlyKwh || "");
        setHouseholdSize(currentUser.usageData.householdSize || "");
        setHomeType(currentUser.usageData.homeType || "");
        setUsagePattern(currentUser.usageData.usagePattern || "");
        setMonthlyBreakdown(currentUser.usageData.monthlyBreakdown || Array(12).fill(""));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Calculate average from monthly breakdown if provided
      const filledMonths = monthlyBreakdown.filter(m => m && m !== "");
      const calculatedAvg = filledMonths.length > 0 
        ? Math.round(filledMonths.reduce((sum, val) => sum + parseFloat(val || 0), 0) / filledMonths.length)
        : parseFloat(avgMonthlyKwh) || 1000;

      const usageData = {
        avgMonthlyKwh: calculatedAvg,
        householdSize,
        homeType,
        usagePattern,
        monthlyBreakdown,
        lastUpdated: new Date().toISOString()
      };

      await base44.auth.updateMe({ usageData });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const getUsageCategory = (kwh) => {
    if (!kwh || kwh === "") return null;
    const value = parseFloat(kwh);
    if (value < 800) return { label: "Low", color: "text-green-600", tip: "Your usage is below average. Keep up the great energy efficiency!" };
    if (value < 1200) return { label: "Average", color: "text-blue-600", tip: "Your usage is typical for most households." };
    return { label: "High", color: "text-orange-600", tip: "Your usage is above average. Consider energy-saving measures to reduce costs." };
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A5C8C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const usageCategory = getUsageCategory(avgMonthlyKwh);
  const filledMonths = monthlyBreakdown.filter(m => m && m !== "");
  const avgFromBreakdown = filledMonths.length > 0 
    ? Math.round(filledMonths.reduce((sum, val) => sum + parseFloat(val || 0), 0) / filledMonths.length)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">User Settings</h1>
          <p className="text-blue-100">Manage your profile and electricity usage preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {saveSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              Settings saved successfully! Your plan recommendations will now be personalized.
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={user?.full_name || "Not set"} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={user?.role || "user"} disabled className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Usage Setup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Usage Setup
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Help us personalize your electricity plan recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="avgKwh">Average Monthly Usage (kWh)</Label>
              <Input
                id="avgKwh"
                type="number"
                placeholder="1000"
                value={avgMonthlyKwh}
                onChange={(e) => setAvgMonthlyKwh(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this on your electricity bill. Average U.S. household uses ~900 kWh/month
              </p>
              {usageCategory && (
                <div className={`mt-2 text-sm font-medium ${usageCategory.color}`}>
                  Usage Level: {usageCategory.label} - {usageCategory.tip}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="household">Household Size</Label>
                <Select value={householdSize} onValueChange={setHouseholdSize}>
                  <SelectTrigger id="household" className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 person</SelectItem>
                    <SelectItem value="2-3">2-3 people</SelectItem>
                    <SelectItem value="4-5">4-5 people</SelectItem>
                    <SelectItem value="6+">6+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="homeType">Home Type</Label>
                <Select value={homeType} onValueChange={setHomeType}>
                  <SelectTrigger id="homeType" className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="single-family">Single Family Home</SelectItem>
                    <SelectItem value="large-home">Large Home (3000+ sq ft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pattern">Usage Pattern</Label>
              <Select value={usagePattern} onValueChange={setUsagePattern}>
                <SelectTrigger id="pattern" className="mt-1">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="average">Average (consistent throughout day)</SelectItem>
                  <SelectItem value="high-daytime">High Daytime Usage (home during day)</SelectItem>
                  <SelectItem value="high-evening">High Evening Usage (peak 5-9pm)</SelectItem>
                  <SelectItem value="high-weekend">High Weekend Usage</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                This helps us recommend plans with free nights/weekends if applicable
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Usage Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Usage Details (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Enter your past 12 months usage for more accurate estimates
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {monthNames.map((month, index) => (
                <div key={index}>
                  <Label htmlFor={`month-${index}`} className="text-xs">{month}</Label>
                  <Input
                    id={`month-${index}`}
                    type="number"
                    placeholder="kWh"
                    value={monthlyBreakdown[index]}
                    onChange={(e) => {
                      const newBreakdown = [...monthlyBreakdown];
                      newBreakdown[index] = e.target.value;
                      setMonthlyBreakdown(newBreakdown);
                    }}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
            {avgFromBreakdown && (
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Calculated Average:</strong> {avgFromBreakdown} kWh/month
                  {filledMonths.length < 12 && ` (based on ${filledMonths.length} months)`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Upload Bill Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Electricity Bill
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Coming soon: Automatically extract usage data from your bill
            </p>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Bill upload feature coming soon</p>
              <p className="text-sm text-gray-500">
                We'll automatically read your usage history from your PDF bill
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-8 py-6 text-lg font-bold"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}