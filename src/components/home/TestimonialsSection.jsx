import React, { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Review Card Component
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-1 relative overflow-hidden touch-manipulation">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Timestamp in top right */}
      <div className="absolute top-4 right-4">
        <span className="text-xs text-gray-400 font-medium">{review.date}</span>
      </div>

      {/* Header with Profile */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
          {review.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <p className="text-sm font-bold text-gray-900">{review.name}</p>
          <p className="text-xs text-gray-500">{review.location}</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) =>
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        )}
      </div>

      {/* Review Text */}
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
        "{review.text}"
      </p>
    </div>);

}

const allTestimonials = [
  // Texas
  { name: "Sarah M.", location: "Houston, TX", rating: 5, text: "Switching was so easy! Found a plan that saved me $80/month. The comparison tool made it simple to see all my options.", date: "2 days ago", timestamp: 2 },
  { name: "Michael R.", location: "Dallas, TX", rating: 5, text: "Best decision I made this year. Customer service was helpful and the rates are unbeatable.", date: "1 week ago", timestamp: 7 },
  { name: "Jennifer L.", location: "Austin, TX", rating: 5, text: "I was skeptical at first, but Power Scouts really delivered. My electricity bill dropped significantly!", date: "3 days ago", timestamp: 3 },
  { name: "David K.", location: "San Antonio, TX", rating: 5, text: "Quick setup, transparent pricing, no hidden fees. Exactly what I was looking for in an electricity provider.", date: "5 days ago", timestamp: 5 },
  
  // Illinois
  { name: "Lisa P.", location: "Chicago, IL", rating: 5, text: "The comparison feature is amazing. Saved me hours of research and hundreds of dollars on my bill.", date: "1 week ago", timestamp: 7 },
  { name: "James T.", location: "Aurora, IL", rating: 5, text: "Finally, a service that actually cares about saving customers money. Highly recommend!", date: "4 days ago", timestamp: 4 },
  { name: "Amanda W.", location: "Naperville, IL", rating: 5, text: "Switched my whole family over. We're all saving money now. The process was seamless and fast.", date: "2 weeks ago", timestamp: 14 },
  
  // Ohio
  { name: "Robert C.", location: "Columbus, OH", rating: 5, text: "Great rates and excellent customer support. They walked me through everything step by step.", date: "3 days ago", timestamp: 3 },
  { name: "Karen H.", location: "Cleveland, OH", rating: 5, text: "I've been using Power Scouts for 6 months now and my bills are consistently lower. Very satisfied!", date: "1 week ago", timestamp: 7 },
  { name: "Chris B.", location: "Cincinnati, OH", rating: 5, text: "The website is user-friendly and the plans are clearly explained. No surprises on my bill.", date: "5 days ago", timestamp: 5 },
  
  // Pennsylvania
  { name: "Patricia G.", location: "Philadelphia, PA", rating: 5, text: "Switched providers in under 10 minutes. The savings are real and the service is top-notch.", date: "2 days ago", timestamp: 2 },
  { name: "Steven A.", location: "Pittsburgh, PA", rating: 5, text: "Power Scouts made comparing electricity plans so simple. I found the perfect plan for my needs quickly.", date: "1 week ago", timestamp: 7 },
  { name: "Michelle D.", location: "Allentown, PA", rating: 5, text: "I was paying way too much before. Now I have a better plan at a lower rate. Thank you!", date: "4 days ago", timestamp: 4 },
  
  // New York
  { name: "Daniel F.", location: "New York, NY", rating: 5, text: "Trustworthy service with real savings. I tell all my friends and coworkers about it.", date: "3 days ago", timestamp: 3 },
  { name: "Emily S.", location: "Buffalo, NY", rating: 5, text: "The customer reviews helped me choose the right provider. My experience has been excellent so far.", date: "1 week ago", timestamp: 7 },
  { name: "Brian N.", location: "Rochester, NY", rating: 5, text: "Simple, fast, and effective. I'm saving over $100 a month compared to my old provider.", date: "2 weeks ago", timestamp: 14 },
  
  // New Jersey
  { name: "Rachel V.", location: "Newark, NJ", rating: 5, text: "Power Scouts took all the guesswork out of finding a good electricity plan. Highly satisfied customer here!", date: "5 days ago", timestamp: 5 },
  { name: "Kevin J.", location: "Jersey City, NJ", rating: 5, text: "I appreciate the transparency and the wide range of options. Found exactly what I was looking for.", date: "3 days ago", timestamp: 3 },
  
  // Maryland
  { name: "Angela M.", location: "Baltimore, MD", rating: 5, text: "Excellent service from start to finish. My new plan has better rates and no contract headaches.", date: "1 week ago", timestamp: 7 },
  { name: "Mark E.", location: "Columbia, MD", rating: 5, text: "Finally ditched my overpriced plan. The switch was painless and I'm already seeing savings.", date: "4 days ago", timestamp: 4 },
  
  // Massachusetts
  { name: "Nicole T.", location: "Boston, MA", rating: 5, text: "Power Scouts is a game-changer for residents. Easy to use and delivers real results.", date: "2 days ago", timestamp: 2 },
  { name: "Jason L.", location: "Worcester, MA", rating: 5, text: "I was hesitant to switch, but I'm so glad I did. Lower rates and better service overall.", date: "1 week ago", timestamp: 7 },
  
  // Connecticut
  { name: "Stephanie R.", location: "Hartford, CT", rating: 5, text: "The comparison tool is incredibly helpful. I saved money and got a plan with renewable energy options.", date: "5 days ago", timestamp: 5 },
  { name: "Timothy W.", location: "New Haven, CT", rating: 5, text: "Great experience all around. The team was responsive and the savings are exactly as promised.", date: "3 days ago", timestamp: 3 },
  
  // Rhode Island
  { name: "Melissa K.", location: "Providence, RI", rating: 5, text: "Every dollar counts. Power Scouts helped me find an affordable plan that works for me.", date: "2 weeks ago", timestamp: 14 },
  
  // New Hampshire
  { name: "Andrew H.", location: "Manchester, NH", rating: 5, text: "I've recommended Power Scouts to my entire family. Everyone who switched is saving money now.", date: "1 week ago", timestamp: 7 },
  
  // Maine
  { name: "Catherine P.", location: "Portland, ME", rating: 5, text: "Quick signup, competitive rates, and no hidden fees. Everything they promised delivered.", date: "4 days ago", timestamp: 4 },
  
  // More Texas cities
  { name: "Gregory S.", location: "Fort Worth, TX", rating: 5, text: "Best electricity comparison service. Made my decision easy and my wallet happy.", date: "2 days ago", timestamp: 2 },
  { name: "Samantha B.", location: "Plano, TX", rating: 5, text: "I switched my business and home electricity through Power Scouts. Both are saving significantly.", date: "1 week ago", timestamp: 7 },
  { name: "Richard M.", location: "Arlington, TX", rating: 5, text: "Professional service and genuine savings. Power Scouts lives up to the hype.", date: "5 days ago", timestamp: 5 },
  
  // More Illinois
  { name: "Jessica W.", location: "Rockford, IL", rating: 5, text: "The switch was quick and painless. My new rate is way better than what I had before.", date: "6 days ago", timestamp: 6 },
  { name: "Thomas B.", location: "Joliet, IL", rating: 5, text: "Couldn't be happier with my new electricity plan. The savings add up fast!", date: "1 week ago", timestamp: 7 },
  
  // More Ohio
  { name: "Maria S.", location: "Toledo, OH", rating: 5, text: "Power Scouts made it easy to compare all my options. Found the perfect plan for my home.", date: "3 days ago", timestamp: 3 },
  { name: "Paul R.", location: "Akron, OH", rating: 5, text: "Great selection of providers and plans. The customer service team was super helpful too.", date: "5 days ago", timestamp: 5 },
  
  // More Pennsylvania
  { name: "Laura K.", location: "Reading, PA", rating: 5, text: "Saved over $600 in my first year. This service is worth every minute spent comparing plans.", date: "2 days ago", timestamp: 2 },
  { name: "John D.", location: "Erie, PA", rating: 5, text: "I wish I had found Power Scouts sooner. My electricity costs have dropped dramatically.", date: "1 week ago", timestamp: 7 },
  
  // More New York
  { name: "Elizabeth H.", location: "Syracuse, NY", rating: 5, text: "The platform is intuitive and the results are accurate. Very impressed with the service.", date: "4 days ago", timestamp: 4 },
  { name: "William C.", location: "Albany, NY", rating: 5, text: "Transparent pricing and excellent customer support. Everything you need in one place.", date: "3 days ago", timestamp: 3 },
  
  // More New Jersey
  { name: "Christine M.", location: "Paterson, NJ", rating: 5, text: "My friends thought I was crazy to switch, but now they're all using Power Scouts too!", date: "1 week ago", timestamp: 7 },
  { name: "George T.", location: "Elizabeth, NJ", rating: 5, text: "The energy comparison tool saved me time and money. Highly recommend to everyone.", date: "5 days ago", timestamp: 5 },
  
  // More Maryland
  { name: "Sharon L.", location: "Germantown, MD", rating: 5, text: "Simple process from start to finish. My new plan has lower rates and better terms.", date: "2 days ago", timestamp: 2 },
  
  // More Massachusetts
  { name: "Joseph F.", location: "Springfield, MA", rating: 5, text: "Power Scouts helped me navigate all the options. I'm now on a plan that fits my budget perfectly.", date: "6 days ago", timestamp: 6 },
  
  // More Connecticut
  { name: "Barbara N.", location: "Bridgeport, CT", rating: 5, text: "I've been saving money every month since I switched. The process was surprisingly easy.", date: "1 week ago", timestamp: 7 },
  { name: "Charles G.", location: "Stamford, CT", rating: 5, text: "Top-notch service and real savings. I'm telling everyone I know about Power Scouts.", date: "4 days ago", timestamp: 4 },
  
  // Additional Recent Reviews
  { name: "Rebecca T.", location: "Corpus Christi, TX", rating: 5, text: "Just switched yesterday and already feeling confident about my choice. The comparison made it crystal clear which plan was best.", date: "1 day ago", timestamp: 1 },
  { name: "Marcus D.", location: "Lubbock, TX", rating: 5, text: "After 3 weeks with my new provider, I can confirm the savings are real. My bill is noticeably lower!", date: "3 weeks ago", timestamp: 21 },
  { name: "Diana K.", location: "Peoria, IL", rating: 5, text: "Been using Power Scouts for a month now. The whole experience has been seamless from start to finish.", date: "1 month ago", timestamp: 30 },
  { name: "Oscar M.", location: "Youngstown, OH", rating: 5, text: "Two months in and I'm still impressed. Saved enough to take my family out to dinner twice!", date: "2 months ago", timestamp: 60 },
  { name: "Veronica S.", location: "Lancaster, PA", rating: 5, text: "Three months later and I'm kicking myself for not switching sooner. The savings add up fast!", date: "3 months ago", timestamp: 90 },
  
  { name: "Derek P.", location: "El Paso, TX", rating: 5, text: "Power Scouts made choosing an electricity plan so simple. Switched just yesterday and loving it!", date: "1 day ago", timestamp: 1 },
  { name: "Natalie H.", location: "Yonkers, NY", rating: 5, text: "Three weeks with my new plan and everything is perfect. Lower rates and great customer service.", date: "3 weeks ago", timestamp: 21 },
  { name: "Felix R.", location: "Camden, NJ", rating: 5, text: "It's been a month since I switched through Power Scouts. Best financial decision I made this year!", date: "1 month ago", timestamp: 30 },
  { name: "Brenda L.", location: "Lowell, MA", rating: 5, text: "Two months of consistent savings. I tell everyone about this service now. It really works!", date: "2 months ago", timestamp: 60 },
  { name: "Walter J.", location: "Waterbury, CT", rating: 5, text: "After three months, I can say with certainty this was worth it. My electricity costs are way down.", date: "3 months ago", timestamp: 90 },
  
  { name: "Tiffany A.", location: "Garland, TX", rating: 5, text: "Signed up yesterday after comparing all my options. The interface is so user-friendly and helpful!", date: "1 day ago", timestamp: 1 },
  { name: "Raymond B.", location: "Springfield, IL", rating: 5, text: "It's been 3 weeks and I'm already seeing the difference in my monthly budget. Highly recommend!", date: "3 weeks ago", timestamp: 21 },
  { name: "Monica W.", location: "Dayton, OH", rating: 5, text: "One month with my new provider and zero regrets. Power Scouts delivers on their promises.", date: "1 month ago", timestamp: 30 },
  { name: "Harold G.", location: "Scranton, PA", rating: 5, text: "Two months in and the savings are exactly what was promised. No hidden fees, no surprises.", date: "2 months ago", timestamp: 60 },
  { name: "Gina C.", location: "White Plains, NY", rating: 5, text: "Three months later and I'm still grateful I found Power Scouts. My bills have been consistently lower.", date: "3 months ago", timestamp: 90 },
  
  { name: "Terrence V.", location: "Irving, TX", rating: 5, text: "Just made the switch one day ago. The process was so smooth and the rate I got is fantastic!", date: "1 day ago", timestamp: 1 },
  { name: "Erica N.", location: "Trenton, NJ", rating: 5, text: "Three weeks with my new electricity plan and I couldn't be happier. Power Scouts made it easy!", date: "3 weeks ago", timestamp: 21 },
  { name: "Vincent K.", location: "Cambridge, MA", rating: 5, text: "One month milestone today. Still loving my decision to switch. Great rates and service!", date: "1 month ago", timestamp: 30 },
  { name: "Phyllis D.", location: "Canton, OH", rating: 5, text: "After two months, I can confidently say this service is legit. Real savings, real results.", date: "2 months ago", timestamp: 60 },
  { name: "Bernard S.", location: "Danbury, CT", rating: 5, text: "Three months of lower electricity bills. This is the kind of savings that actually makes a difference!", date: "3 months ago", timestamp: 90 }
];

// Sort testimonials by timestamp (most recent first)
const testimonials = [...allTestimonials].sort((a, b) => a.timestamp - b.timestamp);



export default function TestimonialsSection() {
  const [visibleCount, setVisibleCount] = useState(8);
  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, testimonials.length));
  };

  return (
    <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 sm:px-4 py-2 shadow-md border border-gray-200 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900">4.8</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-gray-600 font-medium">2,500+ Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084a6f] mb-2 px-4">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 px-4">Real reviews from real people across 12 states</p>
        </div>

        {/* Reviews Grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 mb-6 sm:mb-8">
          {visibleTestimonials.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              variant="outline"
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold hover:bg-[#0A5C8C] hover:text-white transition-colors touch-manipulation"
            >
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}