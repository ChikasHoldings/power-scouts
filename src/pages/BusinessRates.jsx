import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, TrendingDown, Shield, Clock, MapPin } from "lucide-react";

export default function BusinessRates() {
  const [zipCode, setZipCode] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Business Electricity Rates
              </h1>
              <p className="text-2xl opacity-90 mb-8">
                Save on commercial electricity with competitive rates tailored to your business needs
              </p>

              {/* Search */}
              <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter business ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-gray-900"
                    maxLength={5}
                  />
                </div>
                <Button className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-6 whitespace-nowrap">
                  Get Quote
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Building2 className="w-20 h-20 text-white mb-4" />
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 text-lg opacity-90">
                <li className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5" />
                  Competitive commercial rates
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  No hidden fees
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  Fast, easy signup process
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tailored Solutions for Every Business
          </h2>
          <p className="text-xl text-gray-600">
            From small offices to large industrial facilities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Small Business",
              usage: "< 10,000 kWh/month",
              description: "Perfect for retail shops, offices, and small facilities"
            },
            {
              title: "Medium Business",
              usage: "10,000 - 50,000 kWh/month",
              description: "Ideal for warehouses, restaurants, and growing companies"
            },
            {
              title: "Large Enterprise",
              usage: "> 50,000 kWh/month",
              description: "Custom solutions for manufacturing and industrial operations"
            }
          ].map((tier, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.title}</h3>
              <div className="text-teal-600 font-semibold mb-4">{tier.usage}</div>
              <p className="text-gray-600">{tier.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Save on Your Business Energy Costs?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Speak with one of our commercial energy experts
          </p>
          <a
            href="tel:855-475-8315"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Call 855-475-8315
          </a>
        </div>
      </div>

      <style>{`
        .bg-coral-500 { background-color: #FF6B5B; }
        .hover\\:bg-coral-600:hover { background-color: #E95A4A; }
      `}</style>
    </div>
  );
}