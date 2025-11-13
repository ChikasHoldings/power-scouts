import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Zap, ArrowRight, CheckCircle, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const cities = [
  {
    name: "Houston",
    county: "Harris County",
    population: "2.3M",
    avgRate: "8.9¢/kWh",
    providers: 45,
    savings: "$850/yr",
    image: "https://images.unsplash.com/photo-1577894947058-fccf5cf3f8ac?w=400&h=300&fit=crop"
  },
  {
    name: "Dallas",
    county: "Dallas County",
    population: "1.3M",
    avgRate: "9.1¢/kWh",
    providers: 42,
    savings: "$820/yr",
    image: "https://images.unsplash.com/photo-1552083974-186346191183?w=400&h=300&fit=crop"
  },
  {
    name: "Austin",
    county: "Travis County",
    population: "978K",
    avgRate: "9.3¢/kWh",
    providers: 38,
    savings: "$780/yr",
    image: "https://images.unsplash.com/photo-1587166287897-57569859d3fe?w=400&h=300&fit=crop"
  },
  {
    name: "San Antonio",
    county: "Bexar County",
    population: "1.5M",
    avgRate: "8.8¢/kWh",
    providers: 40,
    savings: "$830/yr",
    image: "https://images.unsplash.com/photo-1583582183923-4cf85c286e8f?w=400&h=300&fit=crop"
  },
  {
    name: "Fort Worth",
    county: "Tarrant County",
    population: "927K",
    avgRate: "9.0¢/kWh",
    providers: 41,
    savings: "$810/yr",
    image: "https://images.unsplash.com/photo-1580853039160-f0376b92f928?w=400&h=300&fit=crop"
  },
  {
    name: "El Paso",
    county: "El Paso County",
    population: "679K",
    avgRate: "9.4¢/kWh",
    providers: 35,
    savings: "$760/yr",
    image: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=400&h=300&fit=crop"
  },
  {
    name: "Arlington",
    county: "Tarrant County",
    population: "398K",
    avgRate: "9.1¢/kWh",
    providers: 40,
    savings: "$800/yr",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop"
  },
  {
    name: "Corpus Christi",
    county: "Nueces County",
    population: "326K",
    avgRate: "8.7¢/kWh",
    providers: 37,
    savings: "$840/yr",
    image: "https://images.unsplash.com/photo-1580071413131-47c7f6760f6a?w=400&h=300&fit=crop"
  },
  {
    name: "Plano",
    county: "Collin County",
    population: "286K",
    avgRate: "9.2¢/kWh",
    providers: 43,
    savings: "$790/yr",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    name: "Laredo",
    county: "Webb County",
    population: "256K",
    avgRate: "9.5¢/kWh",
    providers: 33,
    savings: "$750/yr",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
  },
  {
    name: "Lubbock",
    county: "Lubbock County",
    population: "258K",
    avgRate: "9.3¢/kWh",
    providers: 36,
    savings: "$770/yr",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop"
  },
  {
    name: "Irving",
    county: "Dallas County",
    population: "239K",
    avgRate: "9.0¢/kWh",
    providers: 42,
    savings: "$810/yr",
    image: "https://images.unsplash.com/photo-1605648916361-9bc12352f964?w=400&h=300&fit=crop"
  },
  {
    name: "Garland",
    county: "Dallas County",
    population: "238K",
    avgRate: "9.1¢/kWh",
    providers: 41,
    savings: "$800/yr",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop"
  },
  {
    name: "Frisco",
    county: "Collin County",
    population: "200K",
    avgRate: "9.2¢/kWh",
    providers: 43,
    savings: "$790/yr",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop"
  },
  {
    name: "McKinney",
    county: "Collin County",
    population: "195K",
    avgRate: "9.1¢/kWh",
    providers: 42,
    savings: "$800/yr",
    image: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&h=300&fit=crop"
  },
  {
    name: "Grand Prairie",
    county: "Dallas County",
    population: "193K",
    avgRate: "9.0¢/kWh",
    providers: 41,
    savings: "$810/yr",
    image: "https://images.unsplash.com/photo-1489493887464-ec5f7c52db77?w=400&h=300&fit=crop"
  },
  {
    name: "Abilene",
    county: "Taylor County",
    population: "125K",
    avgRate: "9.4¢/kWh",
    providers: 34,
    savings: "$760/yr",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop"
  },
  {
    name: "Amarillo",
    county: "Potter County",
    population: "200K",
    avgRate: "9.3¢/kWh",
    providers: 35,
    savings: "$770/yr",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  }
];

export default function AllCities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [zipCode, setZipCode] = useState("");

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              Texas Service Areas
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Find the best electricity rates in your city. We serve all major Texas cities in the deregulated market.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cities or counties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#0A5C8C] mb-1">85%</div>
              <div className="text-sm text-gray-600">of Texas Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A5C8C] mb-1">100+</div>
              <div className="text-sm text-gray-600">Cities Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A5C8C] mb-1">20M+</div>
              <div className="text-sm text-gray-600">Residents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0A5C8C] mb-1">$800</div>
              <div className="text-sm text-gray-600">Avg. Annual Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Major Service Areas
          </h2>
          <p className="text-gray-600">
            {filteredCities.length} cit{filteredCities.length !== 1 ? 'ies' : 'y'} found
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#FF6B35] group overflow-hidden">
              {/* City Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={`${city.name}, Texas`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                  <p className="text-sm text-white/90">{city.county}</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* City Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Population</div>
                      <div className="text-sm font-bold text-gray-900">{city.population}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Zap className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Providers</div>
                      <div className="text-sm font-bold text-gray-900">{city.providers}</div>
                    </div>
                  </div>
                </div>

                {/* Average Rate */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Avg. Rate</div>
                      <div className="text-xl font-bold text-[#0A5C8C]">{city.avgRate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 mb-1">Potential Savings</div>
                      <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" />
                        {city.savings}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link to={createPageUrl("CityRates") + `?city=${city.name}`}>
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white group-hover:shadow-lg transition-all">
                    View Rates in {city.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0A5C8C] to-[#084a6f] rounded-3xl shadow-2xl p-12 text-center overflow-hidden">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Find the Best Rates in Your Area
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Enter your ZIP code to compare electricity plans available in your city.
            </p>
            
            {/* ZIP Code Input */}
            <div className="max-w-lg mx-auto mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-1.5">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#0A5C8C] flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Enter ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg p-0 h-auto placeholder:text-gray-400 font-semibold"
                      maxLength={5}
                    />
                  </div>
                  <Link to={createPageUrl("CompareRates") + (zipCode ? `?zip=${zipCode}` : '')}>
                    <Button className="w-full sm:w-auto px-10 py-6 text-lg font-bold rounded-xl bg-[#FF6B35] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all h-full">
                      Compare Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>100% Free</span>
              </div>
              <span className="text-blue-300">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No Credit Card</span>
              </div>
              <span className="text-blue-300">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}