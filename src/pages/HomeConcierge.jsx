import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Zap, Wifi, Droplet, Phone, CheckCircle } from "lucide-react";

export default function HomeConcierge() {
  const services = [
    { icon: Zap, name: "Electricity", color: "from-yellow-500 to-orange-500" },
    { icon: Wifi, name: "Internet", color: "from-blue-500 to-cyan-500" },
    { icon: Droplet, name: "Water", color: "from-cyan-500 to-teal-500" },
    { icon: Phone, name: "Phone", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Home className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Home Concierge Service
          </h1>
          <p className="text-2xl opacity-90 mb-8">
            One call to set up all your home utilities. We handle the hassle, you enjoy your new home.
          </p>
          <a href="tel:855-475-8315">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-12 py-6 text-xl font-semibold">
              Call 855-475-8315
            </Button>
          </a>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          We Handle Everything
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <service.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Use Our Concierge Service?
            </h2>
            <div className="space-y-4">
              {[
                "Save time - one call sets up everything",
                "Expert guidance on the best plans",
                "Competitive rates on all services",
                "Seamless coordination and scheduling",
                "No hidden fees or charges"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Moving to Texas?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Let us take care of all your utility setup while you focus on settling into your new home.
            </p>
            <a href="tel:855-475-8315">
              <Button size="lg" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                Get Started Today
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}