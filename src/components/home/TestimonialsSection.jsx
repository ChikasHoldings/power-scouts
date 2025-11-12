import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const defaultTestimonials = [
  {
    customer_name: "Janice C",
    location: "Dallas, TX",
    rating: 5,
    review_text: "The representative of Power Wizard was very helpful. She answered all my questions. She explained anything I didn't understand. This company was highly recommended.",
    review_date: "2024-10-06"
  },
  {
    customer_name: "Letitia T",
    location: "Houston, TX",
    rating: 5,
    review_text: "Caroline is an awesome customer service agent who made the process easy and thoroughly explained everything and answered every question. Professional, patient and friendly.",
    review_date: "2024-07-01"
  },
  {
    customer_name: "Tom P",
    location: "Plano, TX",
    rating: 5,
    review_text: "My agent was just great!! Very helpful and very personable!! We got things taken care of - and had a bit of fun doing it!! Much thanks!!",
    review_date: "2024-04-28"
  },
  {
    customer_name: "Kenneth E",
    location: "Houston, TX",
    rating: 5,
    review_text: "Very friendly, and responsive in a timely manner with helping me and my family switch providers for our electric bill. Was also able to help us save a lot of money.",
    review_date: "2024-09-13"
  },
  {
    customer_name: "Brandi F",
    location: "Corpus Christi, TX",
    rating: 5,
    review_text: "Had Power Wizard for years and cancelled when I moved. After 6 months I've realized just how much money and headache the company had saved me and I signed back up immediately.",
    review_date: "2024-08-15"
  },
  {
    customer_name: "Dee R",
    location: "Fort Worth, TX",
    rating: 5,
    review_text: "The agent was very helpful, pleasant and respectful, she explained everything so clearly and it didn't take a long time to sign me up, I'm very pleased.",
    review_date: "2024-08-28"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-review_date'),
    initialData: [],
  });

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const visibleTestimonials = [
    displayTestimonials[currentIndex],
    displayTestimonials[(currentIndex + 1) % displayTestimonials.length],
    displayTestimonials[(currentIndex + 2) % displayTestimonials.length]
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Don't Take Our Word For It
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-gray-900">4.8</span>
            <span className="text-gray-600">• 1,200+ Reviews</span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review Date */}
                <p className="text-sm text-gray-500 mb-3">
                  {format(new Date(testimonial.review_date), "MMMM d, yyyy")}
                </p>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 leading-relaxed line-clamp-4">
                  {testimonial.review_text}
                </p>

                {/* Customer Info */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900">{testimonial.customer_name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 hover:bg-teal-50 hover:border-teal-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2 hover:bg-teal-50 hover:border-teal-500"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-teal-500 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}