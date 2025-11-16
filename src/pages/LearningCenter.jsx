import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, Zap, DollarSign, Leaf, TrendingDown, Shield, 
  Clock, Users, ArrowRight, CheckCircle, MapPin, Building2, Home, FileText, Star
} from "lucide-react";
import SEOHead, { getBreadcrumbSchema, getArticleSchema } from "../components/SEOHead";
import EnhancedSearch from "../components/learning/EnhancedSearch";

// Fallback local articles for initial display
const fallbackArticles = [
  {
    id: 1,
    category: "Getting Started",
    icon: BookOpen,
    color: "blue",
    title: "Understanding Deregulated Electricity Markets: Your Complete Guide",
    description: "Learn how energy deregulation works and how it can save you hundreds on your electricity bills each year.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80",
    excerpt: "Discover how choosing your electricity provider can save you $500-800 per year in competitive energy markets across 12 states.",
    readTime: "8 min",
    keywords: ["deregulated electricity", "energy deregulation", "choose electricity provider"],
    relatedArticles: [2, 3, 5]
  },
  {
    id: 2,
    category: "Saving Money",
    icon: DollarSign,
    color: "green",
    title: "How to Compare Electricity Rates and Save $500+ Per Year",
    description: "Master the art of comparing electricity plans with this step-by-step guide used by thousands of smart consumers.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/dc494ab1e_hand-lit-light-bulb.jpg",
    excerpt: "Learn the exact process energy experts use to find the lowest rates and avoid hidden fees that cost you money.",
    readTime: "10 min",
    keywords: ["compare electricity rates", "save money electricity", "electricity shopping guide"],
    relatedArticles: [1, 3, 5]
  },
  {
    id: 3,
    category: "Plan Types",
    icon: Zap,
    color: "purple",
    title: "Fixed Rate vs Variable Rate: Which Saves You More Money?",
    description: "Real customer examples show you which electricity plan type works best for different situations.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/354f5e658_man-cunting-stack-coins.jpg",
    excerpt: "See actual bills from families who chose fixed vs variable rates and discover which option is right for you.",
    readTime: "12 min",
    keywords: ["fixed rate electricity", "variable rate electricity", "best electricity plan type"],
    relatedArticles: [1, 2, 5]
  },
  {
    id: 4,
    category: "Renewable Energy",
    icon: Leaf,
    color: "green",
    title: "Green Energy Plans: Save Money While Saving the Planet",
    description: "How 100% renewable electricity plans work and why they often cost the same as traditional plans.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    excerpt: "Thousands of families power their homes with 100% renewable energy without paying extra. Here's how you can too.",
    readTime: "7 min",
    keywords: ["renewable energy plans", "green electricity", "100% renewable energy"],
    relatedArticles: [1, 2, 5]
  },
  {
    id: 5,
    category: "Business Energy",
    icon: Building2,
    color: "blue",
    title: "Business Electricity Rates: Complete Commercial Power Guide 2026",
    description: "Compare business electricity rates and save thousands on commercial power bills. Expert guide for small business and enterprise.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    excerpt: "Small businesses save $2,000-10,000 annually by shopping commercial electricity rates. Here's your complete guide.",
    readTime: "11 min",
    keywords: ["business electricity rates", "commercial power", "small business energy"],
    relatedArticles: [1, 2, 3]
  },
  {
    id: 106,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Nashua NH Electricity Rates 2026: Complete Guide to Save $550+ Annually",
    description: "Compare Nashua NH electricity rates from 16+ suppliers. Find cheapest power in Hillsborough County.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/0497c3089_89e68724-f3a0-408a-b82b-21c7f26fe660.jpg",
    excerpt: "Nashua residents can choose from 16+ competitive electricity suppliers while Eversource delivers power. Save $550+ annually.",
    readTime: "9 min",
    keywords: ["Nashua electricity", "NH power rates", "Eversource Nashua"],
    relatedArticles: [107, 108, 1]
  },
  {
    id: 107,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Concord NH Electricity Rates 2026: Capital City Power Guide - Save $540+",
    description: "Compare Concord NH electricity rates from 16+ Eversource suppliers. Find cheapest power in Merrimack County.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/63646130e_c2b6c002-b461-43af-873e-02caf45e467b.jpg",
    excerpt: "Concord's state capital residents save an average of $540 annually by comparing 16+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Concord NH electricity", "Merrimack County power", "Eversource Concord"],
    relatedArticles: [106, 108, 1]
  },
  {
    id: 108,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Warwick RI Electricity Rates 2026: Kent County Power Guide - Save $520+",
    description: "Compare Warwick RI electricity rates from 15+ National Grid suppliers. Find cheapest power in Kent County.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/d9b752924_a37c566e-4168-4be1-a823-20bf311f7ed9.jpg",
    excerpt: "Warwick residents save an average of $520 per year by shopping 15+ competitive electricity suppliers serving Kent County.",
    readTime: "9 min",
    keywords: ["Warwick electricity", "Kent County RI power", "National Grid Warwick"],
    relatedArticles: [106, 107, 1]
  },
  {
    id: 109,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Cranston RI Electricity Rates 2026: Providence County Power - Save $510+",
    description: "Compare Cranston RI electricity rates from 14+ National Grid suppliers serving Edgewood, Garden City, and Knightsville.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/c4af296bf_ccdd3a45-7050-4bd0-89d9-81c846e9fcdc.jpg",
    excerpt: "Cranston families in Providence County save $510+ annually by comparing electricity rates from 14+ competitive suppliers.",
    readTime: "9 min",
    keywords: ["Cranston electricity", "Providence County power", "National Grid Cranston"],
    relatedArticles: [108, 110, 1]
  },
  {
    id: 110,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Bridgeport CT Electricity Rates 2026: Fairfield County Power - Save $530+",
    description: "Compare Bridgeport CT electricity rates from 18+ United Illuminating suppliers in Connecticut's largest city.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/4e2eca8a2_770d9cd5-f0df-4175-80a1-078211ed206a.jpg",
    excerpt: "Bridgeport residents save $530+ per year by shopping 18+ electricity suppliers in Fairfield County's competitive market.",
    readTime: "9 min",
    keywords: ["Bridgeport electricity", "Fairfield County CT", "United Illuminating Bridgeport"],
    relatedArticles: [111, 112, 1]
  },
  {
    id: 111,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "New Haven CT Electricity Rates 2026: Yale City Power Guide - Save $540+",
    description: "Compare New Haven CT electricity rates from 19+ United Illuminating suppliers in New Haven County.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/7add50838_ab8c9932-5234-436a-b781-91c450b67ab0.jpg",
    excerpt: "New Haven households save $540+ annually by comparing rates from 19+ competitive electricity suppliers in the area.",
    readTime: "9 min",
    keywords: ["New Haven electricity", "Connecticut power", "UI New Haven"],
    relatedArticles: [110, 112, 1]
  },
  {
    id: 112,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Hartford CT Electricity Rates 2026: Capital City Power - Save $550+",
    description: "Compare Hartford CT electricity rates from 19+ Eversource suppliers serving Hartford County.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/c2fba1722_ottawa-street.jpg",
    excerpt: "Hartford's capital region residents save an average of $550 per year by comparing 19+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Hartford electricity", "Hartford County power", "Eversource Hartford"],
    relatedArticles: [110, 111, 1]
  },
  {
    id: 113,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Bangor ME Electricity Rates 2026: Penobscot County Power - Save $540+",
    description: "Compare Bangor ME electricity rates from 16+ Emera Maine suppliers in northern Maine.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/a83f5b033_f9cc9f9f-03e1-4bc8-bb2c-a8bdf40d7b5d.jpg",
    excerpt: "Bangor residents in Penobscot County save $540+ annually by shopping 16+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Bangor electricity", "Maine power rates", "Emera Maine Bangor"],
    relatedArticles: [114, 115, 1]
  },
  {
    id: 114,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Lewiston ME Electricity Rates 2026: Androscoggin County Power - Save $545+",
    description: "Compare Lewiston ME electricity rates from 16+ CMP suppliers in Maine's second-largest city.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/e1656009b_35c3c8a7-86a1-4171-93f9-2a876c9ff35a.jpg",
    excerpt: "Lewiston households save an average of $545 per year by comparing rates from 16+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Lewiston electricity", "Androscoggin County power", "CMP Lewiston"],
    relatedArticles: [113, 115, 1]
  },
  {
    id: 115,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Portland ME Electricity Rates 2026: Cumberland County Power - Save $550+",
    description: "Compare Portland ME electricity rates from 17+ CMP suppliers in Maine's largest city.",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400&h=300&fit=crop",
    excerpt: "Portland residents save $550+ annually by shopping 17+ competitive electricity suppliers in Cumberland County.",
    readTime: "9 min",
    keywords: ["Portland ME electricity", "Maine power", "CMP Portland"],
    relatedArticles: [113, 114, 1]
  },
  {
    id: 116,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Springfield MA Electricity Rates 2026: Hampden County Power - Save $560+",
    description: "Compare Springfield MA electricity rates from 20+ Eversource suppliers in western Massachusetts.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/081e45489_45362c2b-5e37-45ca-a6ab-ac06564ed343.jpg",
    excerpt: "Springfield families in Hampden County save $560+ per year by comparing 20+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Springfield MA electricity", "Hampden County power", "Eversource Springfield"],
    relatedArticles: [117, 118, 1]
  },
  {
    id: 117,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Worcester MA Electricity Rates 2026: Worcester County Power - Save $570+",
    description: "Compare Worcester MA electricity rates from 21+ National Grid suppliers in Central Massachusetts.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/e90708aeb_d4fa1135-c2c6-4c43-8184-540993ddd4db.jpg",
    excerpt: "Worcester residents save an average of $570 annually by comparing rates from 21+ competitive electricity suppliers.",
    readTime: "9 min",
    keywords: ["Worcester electricity", "Massachusetts power", "National Grid Worcester"],
    relatedArticles: [116, 118, 1]
  },
  {
    id: 118,
    category: "City Guides",
    icon: MapPin,
    color: "teal",
    title: "Boston MA Electricity Rates 2026: Complete Suffolk County Power Guide",
    description: "Compare Boston MA electricity rates from 22+ suppliers across Eversource and National Grid territories.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69141a7199585b6c94026f23/44bb8debd_6e33a452-8111-4711-a6e7-b49128f6bc5a.jpg",
    excerpt: "Boston households save $580+ per year by comparing electricity rates from 22+ competitive suppliers in Suffolk County.",
    readTime: "9 min",
    keywords: ["Boston electricity", "Suffolk County power", "Massachusetts electricity rates"],
    relatedArticles: [116, 117, 1]
  }
];

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-500 to-cyan-500" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", gradient: "from-green-500 to-emerald-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", gradient: "from-purple-500 to-pink-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-500 to-red-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", gradient: "from-teal-500 to-cyan-500" }
};

export default function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch articles from database
  const { data: dbArticles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('-created_date'),
    initialData: [],
  });

  // Map database articles to expected format
  const articles = dbArticles.length > 0 ? dbArticles.map(article => ({
    id: article.id,
    category: article.category,
    icon: MapPin, // Default icon for city guides
    color: "teal",
    title: article.title,
    description: article.meta_description,
    image: article.featured_image,
    excerpt: article.excerpt,
    readTime: article.read_time,
    keywords: article.keywords || [],
    relatedArticles: article.related_articles || []
  })) : fallbackArticles;

  const [searchResults, setSearchResults] = useState(articles);

  // Update search results when articles change
  React.useEffect(() => {
    setSearchResults(articles);
  }, [dbArticles]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const filteredArticles = searchResults.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesCategory;
  });

  const categories = ["All", ...new Set(articles.map(a => a.category))];

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Learning Center", url: "/learning-center" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEOHead
        title="Electricity Learning Center - Expert Guides to Save $500+ Per Year | Power Scouts"
        description="Master electricity shopping with expert guides on deregulation, rate comparison, plan types, and money-saving strategies. Serving TX, PA, NY, OH, IL, NJ, MD & 5 more states. Real examples, actionable tips, and step-by-step tutorials to lower your electricity bills."
        keywords="electricity guides, energy saving tips, electricity deregulation, compare electricity plans, fixed vs variable rates, switch electricity provider, lower electricity bill, Texas electricity guide, Houston electricity rates, electricity FAQs"
        canonical="/learning-center"
        structuredData={breadcrumbData}
      />

      {/* Hero Section - Reduced Height */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-8 sm:py-10 lg:py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm mb-4">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Free Expert Guides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Master Electricity Shopping & Save $500+ Annually
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-5">
              Expert guides with real examples to help you find the lowest rates
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xl sm:text-2xl font-bold mb-0.5">{articles.length}</div>
                <div className="text-xs text-blue-100">Guides</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xl sm:text-2xl font-bold mb-0.5">$500+</div>
                <div className="text-xs text-blue-100">Avg. Savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xl sm:text-2xl font-bold mb-0.5">12</div>
                <div className="text-xs text-blue-100">States</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            {/* Enhanced Search Bar */}
            <div className="mb-8 sm:mb-10">
              <EnhancedSearch 
                articles={articles}
                onSearch={handleSearch}
              />
              {searchResults.length !== articles.length && (
                <p className="text-center text-gray-600 mt-3 text-sm">
                  Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching your search
                </p>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-10">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#0A5C8C] text-white shadow-lg scale-105'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#0A5C8C] hover:text-[#0A5C8C]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Featured Article */}
            {searchResults.length === articles.length && selectedCategory === "All" && filteredArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Featured Guide
                </h2>
                {(() => {
                  const featured = filteredArticles[0];
                  const Icon = featured.icon;
                  const colors = colorClasses[featured.color];
                  return (
                    <Link to={createPageUrl("ArticleDetail") + `?id=${featured.id}`}>
                      <Card 
                        className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-[#0A5C8C] cursor-pointer group"
                      >
                        <div className="grid md:grid-cols-2 gap-0">
                          <div className="relative h-48 md:h-full overflow-hidden">
                            <img 
                              src={featured.image} 
                              alt={featured.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className={`absolute top-4 left-4 px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-bold uppercase`}>
                              {featured.category}
                            </div>
                          </div>
                          <div className="p-6 sm:p-8 flex flex-col justify-center">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#0A5C8C] transition-colors">
                              {featured.title}
                            </h3>
                            <p className="text-base text-gray-600 mb-4 leading-relaxed">
                              {featured.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {featured.readTime} read
                              </span>
                              <ArrowRight className="w-6 h-6 text-[#FF6B35] group-hover:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })()}
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedCategory === "All" ? "All Guides" : `${selectedCategory} Guides`}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {(selectedCategory === "All" && searchResults.length === articles.length ? filteredArticles.slice(1) : filteredArticles).map((article) => {
                    const Icon = article.icon;
                    const colors = colorClasses[article.color];
                    return (
                      <Link key={article.id} to={createPageUrl("ArticleDetail") + `?id=${article.id}`}>
                        <Card 
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-[#0A5C8C] cursor-pointer group h-full flex flex-col"
                        >
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className={`absolute top-3 left-3 px-2.5 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-bold uppercase`}>
                            {article.category}
                          </div>
                        </div>

                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0A5C8C] transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime}
                            </span>
                            <ArrowRight className="w-5 h-5 text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">No articles found matching your search</p>
                <p className="text-sm text-gray-500 mb-6">Try different keywords or browse by category</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchResults(articles);
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* CTA Section */}
            <section className="mt-12 sm:mt-16">
              <Card className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white border-0 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full"></div>
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full"></div>
                </div>
                <CardContent className="p-8 sm:p-12 text-center relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                    Ready to Find Better Rates?
                  </h2>
                  <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Put your knowledge to work and start saving on electricity today
                  </p>
                  <Link to={createPageUrl("CompareRates")}>
                    <Button className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all active:scale-95">
                      Compare Rates Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-blue-200 mt-4">
                    Free comparison • No credit card required • Instant results
                  </p>
                </CardContent>
              </Card>
            </section>
      </div>
    </div>
  );
}