import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection({ zipCode, setZipCode, onCompare }) {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-900 font-semibold">4.8</span>
              <span className="text-gray-600">• 1,200+ Reviews</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Compare the Best{" "}
                <span className="text-teal-500">Electricity Rates</span>
              </h1>
              <p className="text-xl text-gray-600">
                Finding the right electricity plan that fits your lifestyle has never been easier.
              </p>
            </div>

            {/* ZIP Code Input */}
            <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  maxLength={5}
                />
              </div>
              <Button
                onClick={onCompare}
                className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Compare Rates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Secondary CTA */}
            <div>
              <Link
                to={createPageUrl("BusinessRates")}
                className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-2 group"
              >
                Shop Business Electricity Rates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative lg:pl-12">
            <div className="relative">
              {/* House Illustration (simplified SVG representation) */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-12 relative overflow-hidden">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* House */}
                  <rect x="100" y="120" width="200" height="140" fill="#00A9CE" opacity="0.2" rx="8" />
                  <rect x="100" y="120" width="200" height="140" fill="none" stroke="#00A9CE" strokeWidth="3" rx="8" />
                  
                  {/* Roof */}
                  <polygon points="90,120 200,60 310,120" fill="#00A9CE" opacity="0.3" />
                  <polygon points="90,120 200,60 310,120" fill="none" stroke="#00A9CE" strokeWidth="3" />
                  
                  {/* Windows */}
                  <rect x="130" y="150" width="50" height="50" fill="#FFB347" opacity="0.5" rx="4" />
                  <rect x="220" y="150" width="50" height="50" fill="#FFB347" opacity="0.5" rx="4" />
                  
                  {/* Door */}
                  <rect x="170" y="200" width="60" height="60" fill="#00A9CE" rx="4" />
                  
                  {/* Car */}
                  <ellipse cx="330" cy="250" rx="40" ry="20" fill="#00BFE7" opacity="0.3" />
                  <rect x="310" y="240" width="40" height="15" fill="#00BFE7" rx="4" />
                  
                  {/* Trees */}
                  <circle cx="50" cy="200" r="25" fill="#86EFAC" opacity="0.5" />
                  <circle cx="350" cy="220" r="30" fill="#86EFAC" opacity="0.5" />
                  
                  {/* Stats Bubble */}
                  <rect x="280" y="40" width="100" height="60" fill="white" rx="8" stroke="#00A9CE" strokeWidth="2" />
                  <text x="330" y="60" fontSize="14" fill="#00A9CE" textAnchor="middle" fontWeight="bold">Savings</text>
                  <text x="330" y="80" fontSize="20" fill="#00A9CE" textAnchor="middle" fontWeight="bold">$475</text>
                </svg>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">Live Rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .bg-coral-500 { background-color: #FF6B5B; }
        .hover\\:bg-coral-600:hover { background-color: #E95A4A; }
      `}</style>
    </section>
  );
}