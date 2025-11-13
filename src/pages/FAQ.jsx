import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does the deregulated Texas electricity market work?",
    answer: "In Texas, you can choose your electricity provider, unlike many other states. This creates competition among providers, potentially leading to better rates and services for customers."
  },
  {
    question: "Is Power Scouts really free?",
    answer: "Yes! Power Scouts is free for consumers. We receive a commission from electricity providers when you sign up through our service, but this doesn't affect the rate you pay."
  },
  {
    question: "How do I switch electricity providers?",
    answer: "Switching is easy! Compare plans on our site, choose the one you like, and sign up online or call us. We handle the rest, including notifying your current provider."
  },
  {
    question: "Will my power be shut off when I switch providers?",
    answer: "No, your power will never be shut off when switching providers. The transition happens seamlessly behind the scenes with no interruption to your service."
  },
  {
    question: "What's the difference between fixed and variable rate plans?",
    answer: "Fixed-rate plans lock in your rate for the contract term, providing price stability. Variable-rate plans can fluctuate monthly based on market conditions."
  },
  {
    question: "Are there any fees to switch providers?",
    answer: "It depends on your current contract. If you're still within a contract term, you may face early termination fees. We always show these fees upfront so you can make an informed decision."
  },
  {
    question: "How much electricity does the average Texas home use?",
    answer: "The average Texas home uses about 1,200 kWh per month, though this varies significantly based on home size, season, and usage habits."
  },
  {
    question: "Can I get 100% renewable energy?",
    answer: "Yes! Many providers offer plans with 100% renewable energy content. Look for the green leaf icon when comparing plans."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-2xl opacity-90">
            Everything you need to know about choosing an electricity plan
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-teal-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team of energy experts is here to help
          </p>
          <a
            href="tel:855-475-8315"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Call 855-475-8315
          </a>
        </div>
      </div>
    </div>
  );
}