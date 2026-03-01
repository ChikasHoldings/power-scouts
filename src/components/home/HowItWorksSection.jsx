import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, BarChart3, FileText, Zap } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: MapPin,
    title: "Enter Your ZIP Code",
    description: "We'll instantly pull every available plan from licensed providers in your area — no account needed.",
    color: "from-[#0A5C8C] to-[#084a6f]"
  },
  {
    number: "2",
    icon: FileText,
    title: "Upload Your Bill (Optional)",
    description: "Our Bill Analyzer reads your current bill, identifies overcharges, and calculates your exact savings potential.",
    color: "from-[#FF6B35] to-[#FF8C5A]",
    highlight: true
  },
  {
    number: "3",
    icon: BarChart3,
    title: "Compare Your Top 10",
    description: "We rank plans by real value — not ad spend. See your top 3 picks plus 7 more curated options, side by side.",
    color: "from-[#0A5C8C] to-[#084a6f]"
  },
  {
    number: "4",
    icon: Zap,
    title: "Switch & Start Saving",
    description: "Pick a plan and sign up directly with the provider. Takes under 5 minutes. Your power stays on — guaranteed.",
    color: "from-emerald-500 to-emerald-600"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084a6f] mb-2 sm:mb-3 px-4">
            How Electric Scouts Finds You the Best Rate
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Four steps. Under two minutes. Real savings on your next bill.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-8 sm:mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border ${step.highlight ? 'border-[#FF6B35] ring-1 ring-[#FF6B35]/20' : 'border-gray-100'} relative`}>
                {step.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Only on Electric Scouts
                  </div>
                )}
                <div className="mb-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Step {step.number}</div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-base text-gray-600 leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 px-4">
          <Link to={createPageUrl("CompareRates")} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold px-10 py-5 text-base sm:text-lg rounded-xl transition-all duration-300 touch-manipulation shadow-lg hover:shadow-xl active:scale-95">
            Compare Rates Now
          </Link>
          <Link to={createPageUrl("BillAnalyzer")} className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-bold px-8 py-5 text-base sm:text-lg rounded-xl transition-all duration-300 touch-manipulation">
            <FileText className="w-5 h-5 mr-2" />
            Analyze My Bill
          </Link>
        </div>
      </div>
    </section>);
}
