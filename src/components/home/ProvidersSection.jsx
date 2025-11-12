import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const defaultProviders = [
  { name: "4Change Energy", logo: "4CE" },
  { name: "APG&E", logo: "APG&E" },
  { name: "BKV Energy", logo: "BKV" },
  { name: "Champion Energy", logo: "CE" },
  { name: "Chariot Energy", logo: "CHE" },
  { name: "Constellation", logo: "CON" },
  { name: "Energy Texas", logo: "ETX" },
  { name: "Express Energy", logo: "EXP" },
  { name: "Frontier Utilities", logo: "FU" },
  { name: "Gexa Energy", logo: "GEX" },
  { name: "Rhythm Energy", logo: "RHY" },
  { name: "TriEagle Energy", logo: "TRI" },
  { name: "TXU Energy", logo: "TXU" },
  { name: "Veteran Energy", logo: "VET" },
];

export default function ProvidersSection() {
  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.ElectricityProvider.list(),
    initialData: [],
  });

  const displayProviders = providers.length > 0 ? providers : defaultProviders;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted Electricity Providers
          </h2>
          <p className="text-xl text-gray-600">
            Top energy providers that deliver a variety of simple and clear electricity plans.
          </p>
        </div>

        {/* Provider Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {displayProviders.map((provider, index) => (
            <Link
              key={index}
              to={createPageUrl("ProviderDetails") + `?provider=${provider.name}`}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 h-24 flex items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {provider.logo_url ? (
                  <img
                    src={provider.logo_url}
                    alt={provider.name}
                    className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-400 group-hover:text-teal-500 transition-colors">
                      {provider.logo || provider.name.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}