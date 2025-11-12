import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Award, Clock, CheckCircle } from "lucide-react";

const announcements = [
  {
    icon: TrendingUp,
    text: "Over 10,000 Texans saved an average of $475 this month",
    bgColor: "from-green-50 to-emerald-50",
    textColor: "text-green-700",
    iconColor: "text-green-600"
  },
  {
    icon: Clock,
    text: "Switch in minutes - No service interruption guaranteed",
    bgColor: "from-blue-50 to-cyan-50",
    textColor: "text-blue-700",
    iconColor: "text-blue-600"
  },
  {
    icon: Award,
    text: "4.8★ Rated - Trusted by thousands of satisfied customers",
    bgColor: "from-yellow-50 to-orange-50",
    textColor: "text-orange-700",
    iconColor: "text-orange-600"
  },
  {
    icon: Users,
    text: "Join 10,000+ happy customers who switched and saved",
    bgColor: "from-purple-50 to-pink-50",
    textColor: "text-purple-700",
    iconColor: "text-purple-600"
  }
];

export default function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-white border-y border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div
            key={currentIndex}
            className={`flex items-center justify-center gap-3 py-3 animate-fade-in bg-gradient-to-r ${current.bgColor} rounded-lg my-2 px-4`}
          >
            <div className={`w-8 h-8 ${current.bgColor} rounded-full flex items-center justify-center shadow-sm border border-white/50`}>
              <Icon className={`w-4 h-4 ${current.iconColor}`} />
            </div>
            <p className={`text-sm sm:text-base font-semibold ${current.textColor} text-center`}>
              {current.text}
            </p>
            <CheckCircle className={`w-4 h-4 ${current.iconColor} flex-shrink-0`} />
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-1.5 pb-3">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-blue-600' : 'w-1.5 bg-gray-300'
              }`}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}