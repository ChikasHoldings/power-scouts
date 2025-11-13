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
    <section className="py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084a6f] mb-2 sm:mb-3">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Compare plans, switch providers, and start saving in three easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center px-2">
              <div className="mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0A5C8C] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mx-auto">
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={createPageUrl("CompareRates")}>
            <Button className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold px-8 sm:px-10 py-3 text-base sm:text-lg rounded-lg transition-all duration-300 touch-manipulation">
              Compare Rates Now
            </Button>
          </Link>
        </div>
      </div>
    </section>);

}