import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Zap, FileText, HelpCircle, Building2, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SEOHead from "../components/SEOHead";

// Sample blog posts data (you can fetch this from an entity if you create one)
const blogPosts = [
  { id: 1, title: "How to Save Money on Your Texas Electricity Bill", category: "Tips", excerpt: "Learn proven strategies to reduce your electricity costs..." },
  { id: 2, title: "Understanding Fixed vs Variable Rate Plans", category: "Education", excerpt: "Discover the differences between fixed and variable electricity rates..." },
  { id: 3, title: "Renewable Energy Options in Deregulated States", category: "Green Energy", excerpt: "Explore 100% renewable energy plans available in your state..." }
];

// Sample FAQ data
const faqs = [
  { id: 1, question: "How does electricity deregulation work?", answer: "Electricity deregulation allows consumers to choose their electricity supplier from competing providers..." },
  { id: 2, question: "Can I switch providers if I'm under contract?", answer: "Yes, but you may owe an early termination fee to your current provider..." },
  { id: 3, question: "What's the difference between fixed and variable rates?", answer: "Fixed-rate plans lock in your rate for the contract term, while variable rates change monthly..." }
];

const providersList = [
  "TXU Energy", "Reliant Energy", "Gexa Energy", "Direct Energy", "Green Mountain Energy",
  "Constellation", "Frontier Utilities", "4Change Energy", "Payless Power", "Rhythm Energy"
];

export default function Search() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialQuery = urlParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    planType: "all",
    renewable: false,
    fixedRate: false,
    variableRate: false
  });

  // Fetch electricity plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => base44.entities.ElectricityPlan.list(),
    initialData: [],
  });

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      const url = new URL(window.location);
      url.searchParams.set('q', searchQuery);
      window.history.pushState({}, '', url);
    }
  }, [searchQuery]);

  // Search logic
  const searchResults = {
    plans: plans.filter(plan => {
      if (!searchQuery && filters.planType === "all" && !filters.renewable && !filters.fixedRate && !filters.variableRate) return false;
      
      const matchesSearch = !searchQuery || 
        plan.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.plan_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.features?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlanType = filters.planType === "all" || plan.plan_type === filters.planType;
      const matchesRenewable = !filters.renewable || (plan.renewable_percentage >= 50);
      const matchesFixed = !filters.fixedRate || plan.plan_type === "fixed";
      const matchesVariable = !filters.variableRate || plan.plan_type === "variable";

      return matchesSearch && matchesPlanType && matchesRenewable && matchesFixed && matchesVariable;
    }),
    
    providers: providersList.filter(provider =>
      searchQuery && provider.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    
    blogs: blogPosts.filter(post =>
      searchQuery && (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ),
    
    faqs: faqs.filter(faq =>
      searchQuery && (
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  };

  const totalResults = searchResults.plans.length + searchResults.providers.length + 
                      searchResults.blogs.length + searchResults.faqs.length;

  const clearFilters = () => {
    setFilters({
      planType: "all",
      renewable: false,
      fixedRate: false,
      variableRate: false
    });
  };

  const hasActiveFilters = filters.planType !== "all" || filters.renewable || 
                          filters.fixedRate || filters.variableRate;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEOHead
        title="Search Electricity Plans, Providers & Resources | Power Scouts"
        description="Search for electricity plans, providers, blog posts, and FAQs. Find the best energy options across 12 deregulated states."
        keywords="search electricity plans, find energy providers, electricity search, power company search"
        canonical="/search"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Search Power Scouts
          </h1>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for providers, plans, green energy, or electricity tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base border-0 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Summary */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-bold text-gray-900">{totalResults}</span> results for 
              <span className="font-bold text-[#0A5C8C]"> "{searchQuery}"</span>
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Plan Type Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Plan Type</label>
                    <Select value={filters.planType} onValueChange={(value) => setFilters({...filters, planType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="fixed">Fixed Rate</SelectItem>
                        <SelectItem value="variable">Variable Rate</SelectItem>
                        <SelectItem value="prepaid">Prepaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feature Checkboxes */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Features</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="renewable"
                          checked={filters.renewable}
                          onCheckedChange={(checked) => setFilters({...filters, renewable: checked})}
                        />
                        <label htmlFor="renewable" className="text-sm text-gray-700 cursor-pointer">
                          50%+ Renewable Energy
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="fixed"
                          checked={filters.fixedRate}
                          onCheckedChange={(checked) => setFilters({...filters, fixedRate: checked})}
                        />
                        <label htmlFor="fixed" className="text-sm text-gray-700 cursor-pointer">
                          Fixed Rate Only
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="variable"
                          checked={filters.variableRate}
                          onCheckedChange={(checked) => setFilters({...filters, variableRate: checked})}
                        />
                        <label htmlFor="variable" className="text-sm text-gray-700 cursor-pointer">
                          Variable Rate Only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="plans">
                  Plans ({searchResults.plans.length})
                </TabsTrigger>
                <TabsTrigger value="providers">
                  Providers ({searchResults.providers.length})
                </TabsTrigger>
                <TabsTrigger value="blogs">
                  Blog ({searchResults.blogs.length})
                </TabsTrigger>
                <TabsTrigger value="faqs">
                  FAQs ({searchResults.faqs.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results Tab */}
              <TabsContent value="all" className="space-y-8">
                {!searchQuery && !hasActiveFilters ? (
                  <Card className="p-12 text-center">
                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                    <p className="text-gray-600">
                      Search for electricity plans, providers, or browse our resources
                    </p>
                  </Card>
                ) : totalResults === 0 ? (
                  <Card className="p-12 text-center">
                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filters
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters}>Clear Filters</Button>
                    )}
                  </Card>
                ) : (
                  <>
                    {searchResults.providers.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Building2 className="w-6 h-6" />
                          Providers ({searchResults.providers.length})
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {searchResults.providers.map((provider, index) => (
                            <Link key={index} to={createPageUrl("ProviderDetails") + `?provider=${provider}`}>
                              <Card className="hover:shadow-lg transition-all border-2 hover:border-[#0A5C8C]">
                                <CardContent className="p-6">
                                  <h3 className="text-lg font-bold text-gray-900">{provider}</h3>
                                  <p className="text-sm text-gray-600 mt-2">View plans and details →</p>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.plans.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-6 h-6" />
                          Electricity Plans ({searchResults.plans.length})
                        </h2>
                        <div className="space-y-4">
                          {searchResults.plans.slice(0, 10).map((plan) => (
                            <Card key={plan.id} className="hover:shadow-lg transition-all">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900">{plan.provider_name}</h3>
                                    <p className="text-gray-600">{plan.plan_name}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-[#0A5C8C]">
                                      {plan.rate_per_kwh}¢
                                    </div>
                                    <div className="text-xs text-gray-600">per kWh</div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline">{plan.plan_type}</Badge>
                                  {plan.contract_length && (
                                    <Badge variant="outline">{plan.contract_length} months</Badge>
                                  )}
                                  {plan.renewable_percentage >= 50 && (
                                    <Badge className="bg-green-100 text-green-800">
                                      {plan.renewable_percentage}% Renewable
                                    </Badge>
                                  )}
                                </div>
                                <Link to={createPageUrl("CompareRates")}>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.blogs.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="w-6 h-6" />
                          Blog Posts ({searchResults.blogs.length})
                        </h2>
                        <div className="space-y-4">
                          {searchResults.blogs.map((post) => (
                            <Card key={post.id} className="hover:shadow-lg transition-all">
                              <CardContent className="p-6">
                                <Badge className="mb-3">{post.category}</Badge>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                                <Link to={createPageUrl("Blog")}>
                                  <Button variant="link" className="p-0">Read More →</Button>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.faqs.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <HelpCircle className="w-6 h-6" />
                          FAQs ({searchResults.faqs.length})
                        </h2>
                        <div className="space-y-4">
                          {searchResults.faqs.map((faq) => (
                            <Card key={faq.id} className="hover:shadow-lg transition-all">
                              <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Individual Tabs */}
              <TabsContent value="plans">
                {searchResults.plans.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.plans.map((plan) => (
                      <Card key={plan.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{plan.provider_name}</h3>
                              <p className="text-gray-600">{plan.plan_name}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#0A5C8C]">
                                {plan.rate_per_kwh}¢
                              </div>
                              <div className="text-xs text-gray-600">per kWh</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{plan.plan_type}</Badge>
                            {plan.contract_length && (
                              <Badge variant="outline">{plan.contract_length} months</Badge>
                            )}
                            {plan.renewable_percentage >= 50 && (
                              <Badge className="bg-green-100 text-green-800">
                                {plan.renewable_percentage}% Renewable
                              </Badge>
                            )}
                          </div>
                          <Link to={createPageUrl("CompareRates")}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="providers">
                {searchResults.providers.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Found</h3>
                    <p className="text-gray-600">Try a different search term</p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {searchResults.providers.map((provider, index) => (
                      <Link key={index} to={createPageUrl("ProviderDetails") + `?provider=${provider}`}>
                        <Card className="hover:shadow-lg transition-all border-2 hover:border-[#0A5C8C]">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-gray-900">{provider}</h3>
                            <p className="text-sm text-gray-600 mt-2">View plans and details →</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="blogs">
                {searchResults.blogs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Found</h3>
                    <p className="text-gray-600">Try a different search term</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.blogs.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <Badge className="mb-3">{post.category}</Badge>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-3">{post.excerpt}</p>
                          <Link to={createPageUrl("Blog")}>
                            <Button variant="link" className="p-0">Read More →</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="faqs">
                {searchResults.faqs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
                    <p className="text-gray-600">Try a different search term</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.faqs.map((faq) => (
                      <Card key={faq.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}