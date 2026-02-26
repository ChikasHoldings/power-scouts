import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

/**
 * Reusable Email Results Component
 * 
 * Allows users to email themselves comparison results with affiliate links.
 * Works for Residential, Business, and Renewable comparison flows.
 * 
 * @param {Object} props
 * @param {Array} props.plans - Array of plan objects to include in the email
 * @param {string} props.zipCode - User's ZIP code
 * @param {string} props.cityName - City name for the ZIP code
 * @param {string|number} props.monthlyUsage - Monthly usage in kWh
 * @param {string} props.comparisonType - 'residential' | 'business' | 'renewable'
 * @param {string} props.accentColor - Theme accent color (default: '#0A5C8C')
 * @param {Function} props.getAffiliateUrl - Function to get affiliate URL for a plan
 */
export default function EmailResults({ 
  plans = [], 
  zipCode, 
  cityName, 
  monthlyUsage, 
  comparisonType = 'residential',
  accentColor = '#0A5C8C',
  getAffiliateUrl
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendResults = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (plans.length === 0) {
      setError("No plans available to send");
      return;
    }

    setSending(true);
    setError("");

    try {
      // Prepare plans with affiliate URLs
      const plansWithLinks = plans.slice(0, 6).map(plan => ({
        ...plan,
        affiliateUrl: getAffiliateUrl ? getAffiliateUrl(plan) : undefined,
      }));

      const response = await fetch("/api/send-comparison-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plans: plansWithLinks,
          zipCode,
          cityName,
          monthlyUsage,
          comparisonType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSent(true);
      } else {
        setError(data.error || "Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const typeLabels = {
    residential: 'Residential',
    business: 'Business',
    renewable: 'Renewable Energy',
  };

  if (sent) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Results Sent!</h3>
          <p className="text-sm text-gray-600">
            Your {typeLabels[comparisonType] || 'comparison'} results with plan details and direct signup links have been sent to <strong>{email}</strong>.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Check your inbox (and spam folder) for your personalized plan recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
            <Mail className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Email Me These Results</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get your top {typeLabels[comparisonType] || ''} plan recommendations with direct signup links sent to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendResults()}
                className="flex-1 h-11"
                disabled={sending}
              />
              <Button
                onClick={handleSendResults}
                disabled={sending || !email}
                className="h-11 px-6 text-white whitespace-nowrap"
                style={{ backgroundColor: accentColor }}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Results
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">
              We'll send your results once. No spam, ever.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
