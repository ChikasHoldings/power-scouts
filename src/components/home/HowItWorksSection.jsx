import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const steps = [
  {
    number: "1",
    title: "Enter Your ZIP Code",
    description: "Enter your ZIP code to see available plans. We'll instantly show you personalized rates from trusted Texas providers."
  },
  {
    number: "2",
    title: "Compare & Choose",
    description: "Compare plans based on your usage. Filter by price, contract length, renewable energy, and more to find your perfect fit."
  },
  {
    number: "3",
    title: "Sign Up & Save",
    description: "Sign up directly online in just minutes. Start saving immediately with no hidden fees or surprises."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084a6f] mb-2 sm:mb-3 px-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Compare plans, switch providers, and start saving in three easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-5 sm:gap-8 mb-8 sm:mb-10">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0A5C8C] to-[#084a6f] text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto shadow-lg">
                  {step.number}
                </div>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center px-4">
          <Link to={createPageUrl("CompareRates")} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold px-10 py-5 text-base sm:text-lg rounded-xl transition-all duration-300 touch-manipulation shadow-lg hover:shadow-xl active:scale-95">
            Compare Rates Now
          </Link>
        </div>
      </div>
    </section>);

}