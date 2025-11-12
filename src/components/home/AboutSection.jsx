import React from "react";
import { Users, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Modern home office"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              The Power Wizard Way
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our goal is simple. To empower you by simplifying your search for electricity 
              companies and plans. Whether you're looking for the cheapest electricity rate 
              or a plan that fits your needs, we're here to help you make the best choice.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 pt-6">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Ctext x='10' y='30' font-family='Arial' font-size='24' font-weight='bold' fill='white'%3EPW%3C/text%3E%3C/svg%3E"
                    alt="Power Wizard"
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Power Wizard has helped tens of thousands</h3>
                  <p className="text-gray-600 text-sm">of Texans save on electricity since 2019</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">A proven team of industry experts</h3>
                  <p className="text-gray-600 text-sm">with 100+ years of experience</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-white text-white" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">1,200+ Google Reviews and 4.8 Stars</h3>
                  <p className="text-gray-600 text-sm">Trusted by thousands of satisfied customers</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link to={createPageUrl("AboutUs")}>
                <Button variant="outline" size="lg" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}