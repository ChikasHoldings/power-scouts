import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Search, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084a6f] leading-tight px-4">
            The Only Platform With a{" "}
            <span className="text-[#FF6B35]">Built-In Bill Analyzer</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full">
              <img
                src="https://iwguavsojnbzveutwzpw.supabase.co/storage/v1/object/public/content/homepage/about-couple-savings.png"
                alt="Happy couple reviewing electricity savings on tablet in modern living room"
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-5 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-4 lg:px-0">
              Other comparison sites show you rates. We show you what you're actually paying — and exactly how much you'd save by switching. Upload your bill and our analyzer does the rest.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 px-4 lg:px-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-gray-900">Bill Analyzer</span>
                  <p className="text-sm sm:text-base text-gray-600">Upload your bill. We find hidden fees and overcharges automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-[#0A5C8C]" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-gray-900">Smart Plan Matching</span>
                  <p className="text-sm sm:text-base text-gray-600">Plans ranked by real value to you — not by who pays us the most.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-gray-900">No Bias. No Sponsored Rankings.</span>
                  <p className="text-sm sm:text-base text-gray-600">40+ providers compete so the best deal always wins.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 px-4 lg:px-0 pt-2">
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-bold text-[#084a6f]">50K+</span>
                <span className="text-xs sm:text-sm text-gray-500 block">Households switched</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-bold text-[#084a6f]">12</span>
                <span className="text-xs sm:text-sm text-gray-500 block">States covered</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-bold text-[#FF6B35]">$600+</span>
                <span className="text-xs sm:text-sm text-gray-500 block">Avg. annual savings</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-3 px-4 lg:px-0">
              <Link to={createPageUrl("BillAnalyzer")} className="inline-flex items-center justify-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold px-8 py-4 text-base rounded-xl transition-all duration-300 touch-manipulation shadow-lg">
                <FileText className="w-4 h-4 mr-2" />
                Try the Bill Analyzer
              </Link>
              <Link to={createPageUrl("AboutUs")} className="inline-flex items-center justify-center border-2 border-[#0A5C8C] text-[#0A5C8C] hover:bg-[#0A5C8C] hover:text-white font-semibold px-8 py-4 text-base rounded-xl transition-all duration-300 touch-manipulation">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
