import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Zap, Building, Leaf, TrendingDown, Shield, BookOpen, FileText } from "lucide-react";

export default function SEOContentSection() {
  const states = [
    { name: "Texas", page: "TexasElectricity", cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"] },
    { name: "Illinois", page: "IllinoisElectricity", cities: ["Chicago", "Aurora", "Naperville", "Rockford"] },
    { name: "Ohio", page: "OhioElectricity", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"] },
    { name: "Pennsylvania", page: "PennsylvaniaElectricity", cities: ["Philadelphia", "Pittsburgh", "Allentown"] },
    { name: "New York", page: "NewYorkElectricity", cities: ["New York City", "Buffalo", "Rochester"] },
    { name: "New Jersey", page: "NewJerseyElectricity", cities: ["Newark", "Jersey City", "Paterson"] },
    { name: "Maryland", page: "MarylandElectricity", cities: ["Baltimore", "Columbia", "Germantown"] },
    { name: "Massachusetts", page: "MassachusettsElectricity", cities: ["Boston", "Worcester", "Springfield"] },
    { name: "Connecticut", page: "ConnecticutElectricity", cities: ["Hartford", "New Haven", "Bridgeport"] },
    { name: "Maine", page: "MaineElectricity", cities: ["Portland", "Lewiston", "Bangor"] },
    { name: "New Hampshire", page: "NewHampshireElectricity", cities: ["Manchester", "Nashua", "Concord"] },
    { name: "Rhode Island", page: "RhodeIslandElectricity", cities: ["Providence", "Warwick", "Cranston"] },
  ];

  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main SEO Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Compare Electricity Rates Across 12 Deregulated States
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            Electric Scouts gives you access to every available electricity plan in your area — from{" "}
            <Link to={createPageUrl("CompareRates") + "?planType=fixed"} className="text-[#0A5C8C] hover:underline font-medium">fixed-rate plans</Link> that lock in your price, to{" "}
            <Link to={createPageUrl("CompareRates") + "?planType=variable"} className="text-[#0A5C8C] hover:underline font-medium">variable-rate plans</Link> with no commitment, to{" "}
            <Link to={createPageUrl("RenewableEnergy")} className="text-[#0A5C8C] hover:underline font-medium">100% renewable energy plans</Link>. Plus, our{" "}
            <Link to={createPageUrl("BillAnalyzer")} className="text-[#FF6B35] hover:underline font-bold">Bill Analyzer</Link> shows you exactly where your money is going.
          </p>
        </div>

        {/* State Grid with Cities */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0A5C8C]" />
            Electricity Rates by State
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {states.map((state) => (
              <div key={state.name} className="border border-gray-200 rounded-xl p-4 hover:border-[#0A5C8C] hover:shadow-md transition-all">
                <Link to={createPageUrl(state.page)} className="text-[#0A5C8C] font-semibold text-sm sm:text-base hover:underline">
                  {state.name} Electricity Rates
                </Link>
                <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1">
                  {state.cities.map((city) => (
                    <Link
                      key={city}
                      to={createPageUrl("CityRates") + `?city=${encodeURIComponent(city)}&state=${state.name === "New York" ? "NY" : state.name === "New Jersey" ? "NJ" : state.name === "New Hampshire" ? "NH" : state.name === "Rhode Island" ? "RI" : state.name.substring(0, 2).toUpperCase()}`}
                      className="text-xs text-gray-500 hover:text-[#0A5C8C] hover:underline"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to={createPageUrl("AllStates")} className="text-[#0A5C8C] hover:underline font-medium text-sm">
              View All States &amp; Cities &rarr;
            </Link>
          </div>
        </div>

        {/* Service Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-12">
          <Link to={createPageUrl("CompareRates")} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#0A5C8C] hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
              <Zap className="w-5 h-5 text-[#0A5C8C]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Compare Residential Rates</p>
              <p className="text-xs text-gray-500">40+ providers, instant results</p>
            </div>
          </Link>
          <Link to={createPageUrl("BusinessCompareRates")} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#0A5C8C] hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
              <Building className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Business Electricity</p>
              <p className="text-xs text-gray-500">Commercial plans &amp; volume discounts</p>
            </div>
          </Link>
          <Link to={createPageUrl("RenewableCompareRates")} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#0A5C8C] hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Green Energy Plans</p>
              <p className="text-xs text-gray-500">100% renewable wind &amp; solar</p>
            </div>
          </Link>
          <Link to={createPageUrl("BillAnalyzer")} className="flex items-center gap-3 p-4 border-2 border-[#FF6B35] rounded-xl hover:bg-orange-50 hover:shadow-lg transition-all group relative">
            <div className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Exclusive</div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
              <FileText className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Bill Analyzer</p>
              <p className="text-xs text-gray-500">Upload your bill, find hidden savings</p>
            </div>
          </Link>
        </div>

        {/* SEO Content Paragraphs */}
        <div className="prose prose-base max-w-none text-gray-600">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 !mb-3">
            <BookOpen className="w-5 h-5 text-[#0A5C8C]" />
            How to Compare Electricity Rates and Save Money
          </h3>
          <p className="leading-relaxed text-sm !mt-0 !mb-3">
            In deregulated electricity markets across Texas, Illinois, Ohio, Pennsylvania, New York, New Jersey, Maryland, Massachusetts, Maine, New Hampshire, Rhode Island, and Connecticut, you have the legal right to choose your electricity provider. That means providers compete for your business — and the savings can be significant. The average Electric Scouts customer saves over $600 per year simply by switching to a better-matched plan.
          </p>
          <p className="leading-relaxed text-sm !mb-3">
            What makes Electric Scouts different is our <strong>Bill Analyzer</strong> — a tool no other comparison site offers. Instead of guessing which plan might save you money, upload your current bill and we'll break down every line item: energy charges, delivery fees, taxes, and hidden surcharges. Then we match you with plans that specifically address where you're overpaying.
          </p>
          <p className="leading-relaxed text-sm !mb-3">
            The average American household uses about 10,500 kWh per year. Even a 1-2 cent per kWh difference translates to $100-$200 in annual savings. Our platform compares plans from providers like TXU Energy, Constellation, Direct Energy, Rhythm Energy, and dozens more — ranking them by actual value to you, not by advertising spend.
          </p>
          <p className="leading-relaxed text-sm !mb-4">
            Key factors to consider: <strong>rate per kWh</strong> (the primary cost driver), <strong>contract length</strong> (longer terms often mean lower rates), <strong>early termination fees</strong>, <strong>renewable energy content</strong>, and <strong>base charges</strong>. Electric Scouts displays all of this transparently so you can make an informed decision in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={createPageUrl("BillAnalyzer")} className="inline-flex items-center gap-1.5 text-[#FF6B35] hover:underline font-medium text-sm">
              <FileText className="w-4 h-4" /> Bill Analyzer
            </Link>
            <Link to={createPageUrl("LearningCenter")} className="inline-flex items-center gap-1.5 text-[#0A5C8C] hover:underline font-medium text-sm">
              <BookOpen className="w-4 h-4" /> Learning Center
            </Link>
            <Link to={createPageUrl("SavingsCalculator")} className="inline-flex items-center gap-1.5 text-[#0A5C8C] hover:underline font-medium text-sm">
              <TrendingDown className="w-4 h-4" /> Savings Calculator
            </Link>
            <Link to={createPageUrl("FAQ")} className="inline-flex items-center gap-1.5 text-[#0A5C8C] hover:underline font-medium text-sm">
              <Shield className="w-4 h-4" /> FAQs
            </Link>
            <Link to={createPageUrl("AllProviders")} className="inline-flex items-center gap-1.5 text-[#0A5C8C] hover:underline font-medium text-sm">
              <Zap className="w-4 h-4" /> All Providers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
