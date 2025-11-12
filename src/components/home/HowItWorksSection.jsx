import React from "react";
import { MapPin, Search, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Enter your ZIP code",
    description: "Enter Your Zip Code to view the best electricity rates in your area.",
    color: "from-teal-500 to-cyan-500"
  },
  {
    number: "02",
    icon: Search,
    title: "Shop and sort through plans",
    description: "Shop & compare plans for one that fits your lifestyle.",
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Sign up in minutes!",
    description: "Sign-up in minutes online or over the phone- it's that simple.",
    color: "from-orange-500 to-yellow-500"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-2xl text-teal-600 font-semibold">
            Your Quest to Magical Savings
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link to={createPageUrl("CompareRates")}>
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Compare Rates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-gray-600">
            Or give us a call at{" "}
            <a href="tel:855-475-8315" className="text-teal-600 font-semibold hover:text-teal-700">
              855-475-8315
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}