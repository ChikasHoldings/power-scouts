import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, ArrowRight, Users, Award, TrendingUp } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ProvidersSection from "../components/home/ProvidersSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import TestimonialsSection from "../components/home/TestimonialsSection";

export default function Home() {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");

  const handleCompareRates = () => {
    if (zipCode) {
      navigate(createPageUrl("CompareRates") + `?zip=${zipCode}`);
    } else {
      navigate(createPageUrl("CompareRates"));
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection zipCode={zipCode} setZipCode={setZipCode} onCompare={handleCompareRates} />
      <AboutSection />
      <ProvidersSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </div>
  );
}