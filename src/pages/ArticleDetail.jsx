import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, Zap, DollarSign, Leaf, TrendingDown, Shield, 
  Clock, Users, ArrowRight, MapPin, Building2, FileText
} from "lucide-react";
import SEOHead, { getArticleSchema, getBreadcrumbSchema } from "../components/SEOHead";
import { getFullArticle } from "../components/learning/fullArticles";
import ArticleRecommendations from "../components/learning/ArticleRecommendations";
import ReadingAnalytics, { trackDailyReading } from "../components/learning/ReadingAnalytics";

// Complete articles data - all 71 articles
const articles = [
  // Getting Started
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
    image: "https://images.unsplash.com/photo-1554224311-beee4ece2227?w=1200&q=80",
    excerpt: "Learn the exact process energy experts use to find the lowest rates and avoid hidden fees that cost you money.",
    readTime: "10 min",
    keywords: ["compare electricity rates", "save money electricity", "electricity shopping guide"],
    relatedArticles: [1, 3, 11]
  },
  {
    id: 3,
    category: "Plan Types",
    icon: Zap,
    color: "purple",
    title: "Fixed Rate vs Variable Rate: Which Saves You More Money?",
    description: "Real customer examples show you which electricity plan type works best for different situations.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    excerpt: "See actual bills from families who chose fixed vs variable rates and discover which option is right for you.",
    readTime: "12 min",
    keywords: ["fixed rate electricity", "variable rate electricity", "best electricity plan type"],
    relatedArticles: [1, 2, 7]
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
    relatedArticles: [1, 2, 8]
  },
  {
    id: 5,
    category: "Business Energy",
    icon: Building2,
    color: "blue",
    title: "Business Electricity Rates: Complete Commercial Power Guide 2024",
    description: "Compare business electricity rates and save thousands on commercial power bills. Expert guide for small business and enterprise.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    excerpt: "Small businesses save $2,000-10,000 annually by shopping commercial electricity rates. Here's your complete guide.",
    readTime: "11 min",
    keywords: ["business electricity rates", "commercial power", "small business energy"],
    relatedArticles: [1, 2, 11]
  },
  {
    id: 6,
    category: "Consumer Protection",
    icon: Shield,
    color: "purple",
    title: "How to Avoid Electricity Scams and Find Legitimate Providers",
    description: "Identify electricity scams, door-to-door fraud, and fake providers. Learn to verify legitimate licensed companies.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    excerpt: "Door-to-door electricity scams cost consumers millions annually. Learn the red flags and protect yourself.",
    readTime: "9 min",
    keywords: ["electricity scams", "provider fraud", "door-to-door sales", "legitimate providers"],
    relatedArticles: [1, 10, 2]
  },
  {
    id: 7,
    category: "Money Saving",
    icon: TrendingDown,
    color: "green",
    title: "Contract Renewal Strategy: Save $300+ Every Year",
    description: "Master electricity contract renewal timing. Learn when to shop, avoid auto-renewal penalties, and negotiate better rates.",
    image: "https://images.unsplash.com/photo-1554224311-85f1eb488f7f?w=1200&q=80",
    excerpt: "Most people overpay $300-800 yearly by letting contracts auto-renew. Here's how to avoid this expensive mistake.",
    readTime: "10 min",
    keywords: ["contract renewal", "auto-renewal", "electricity contracts", "renewal strategy"],
    relatedArticles: [2, 3, 10]
  },
  {
    id: 8,
    category: "Seasonal Tips",
    icon: Zap,
    color: "orange",
    title: "Beat the Heat: Summer Electricity Saving Strategies",
    description: "Proven tactics to lower your electricity bill during hot summer months without sacrificing comfort.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
    excerpt: "These 10 strategies helped families cut summer electricity bills by 30-40% while staying comfortable.",
    readTime: "8 min",
    keywords: ["summer electricity savings", "lower AC costs", "reduce summer bills"],
    relatedArticles: [2, 3, 5]
  },
  {
    id: 9,
    category: "Understanding Bills",
    icon: FileText,
    color: "teal",
    title: "How to Read Your Electricity Bill and Spot Overcharges",
    description: "Learn to decode your electricity bill and identify hidden fees that cost you money every month.",
    image: "https://images.unsplash.com/photo-1554224311-beee4ece2227?w=1200&q=80",
    excerpt: "Understanding your bill is the first step to saving money. This guide shows you exactly what to look for.",
    readTime: "7 min",
    keywords: ["read electricity bill", "understand electricity bill", "electricity bill explained"],
    relatedArticles: [1, 2, 10]
  },
  {
    id: 10,
    category: "Switching Providers",
    icon: Users,
    color: "blue",
    title: "How to Switch Electricity Providers Without Hassle",
    description: "Step-by-step guide to switching providers seamlessly with no power interruption.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    excerpt: "Switching takes 10 minutes online and could save you $500+ per year. Here's exactly what to do.",
    readTime: "6 min",
    keywords: ["switch electricity provider", "change power company", "electricity provider switch"],
    relatedArticles: [1, 2, 3]
  },
  // STATE GUIDES
  {
    id: 11,
    category: "State Guides",
    icon: MapPin,
    color: "orange",
    title: "Texas Electricity Rates Guide: Find the Cheapest Plans in 2024",
    description: "Everything Texas residents need to know about finding the lowest electricity rates in Houston, Dallas, Austin, and beyond.",
    image: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=1200&q=80",
    excerpt: "Texas has 40+ providers. This guide shows you exactly how to find the cheapest rates and avoid common mistakes.",
    readTime: "12 min",
    keywords: ["Texas electricity rates", "cheapest Texas electricity", "Texas power plans"],
    relatedArticles: [1, 2, 12]
  },
  {
    id: 12,
    category: "State Guides",
    icon: MapPin,
    color: "blue",
    title: "Pennsylvania Electricity Rates: Complete Guide to PA Power Savings",
    description: "Compare Pennsylvania electricity rates from 25+ providers. Find the cheapest power plans in Philadelphia and Pittsburgh.",
    image: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=1200&q=80",
    excerpt: "Pennsylvania consumers save $400-600 yearly by shopping for competitive electricity suppliers. Here's your complete guide.",
    readTime: "11 min",
    keywords: ["Pennsylvania electricity rates", "PA power", "Philadelphia electricity"],
    relatedArticles: [1, 2, 13]
  },
  {
    id: 13,
    category: "State Guides",
    icon: MapPin,
    color: "purple",
    title: "New York Electricity Rates: Complete NY Power Shopping Guide",
    description: "Compare New York electricity rates from 20+ ESCO suppliers. Find lowest power prices in NYC, Buffalo, and Rochester.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    excerpt: "New York's regulated ESCO market offers savings with strong consumer protections. Save $300-500 annually.",
    readTime: "11 min",
    keywords: ["New York electricity", "NYC power rates", "ESCO suppliers"],
    relatedArticles: [1, 2, 14]
  },
  {
    id: 14,
    category: "State Guides",
    icon: MapPin,
    color: "green",
    title: "Ohio Electricity Rates: Compare OH Power Plans & Save Money",
    description: "Compare Ohio electricity rates from 20+ suppliers. Find lowest power prices in Cleveland, Columbus, and Cincinnati.",
    image: "https://images.unsplash.com/photo-1604246851544-2b2d471f671a?w=1200&q=80",
    excerpt: "Ohio's competitive market with PUCO oversight makes shopping safe and profitable. Save $350-550 yearly.",
    readTime: "10 min",
    keywords: ["Ohio electricity", "Cleveland power", "Columbus electricity"],
    relatedArticles: [1, 2, 15]
  },
  {
    id: 15,
    category: "State Guides",
    icon: MapPin,
    color: "orange",
    title: "Illinois Electricity Rates: Complete Guide to IL Power Savings",
    description: "Compare Illinois electricity rates from 20+ suppliers. Find cheapest power in Chicago, Aurora, and Naperville.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
    excerpt: "Illinois deregulation since 1997 gives Chicago-area residents excellent supplier options. Save $350-500 yearly.",
    readTime: "10 min",
    keywords: ["Illinois electricity", "Chicago power", "ComEd rates"],
    relatedArticles: [1, 2, 16]
  },
  {
    id: 16,
    category: "State Guides",
    icon: MapPin,
    color: "blue",
    title: "New Jersey Electricity Rates: NJ Power Shopping Guide",
    description: "Compare NJ electricity rates from 15+ suppliers. Find lowest power prices in Newark, Jersey City, and Paterson.",
    image: "https://images.unsplash.com/photo-1589756823695-278bc8eac975?w=1200&q=80",
    excerpt: "New Jersey's regulated market offers solid savings with strong BPU oversight. Save $300-450 yearly.",
    readTime: "9 min",
    keywords: ["New Jersey electricity", "NJ power", "PSE&G rates"],
    relatedArticles: [1, 2, 17]
  },
  {
    id: 17,
    category: "State Guides",
    icon: MapPin,
    color: "purple",
    title: "Maryland Electricity Rates: Complete MD Power Comparison Guide",
    description: "Compare Maryland electricity rates from 15+ suppliers. Find cheapest power in Baltimore, Frederick, and Rockville.",
    image: "https://images.unsplash.com/photo-1590932722660-b2e3c71b1379?w=1200&q=80",
    excerpt: "Maryland's competitive market with PSC protections helps residents save $300-450 annually on electricity.",
    readTime: "9 min",
    keywords: ["Maryland electricity", "Baltimore power", "BGE rates"],
    relatedArticles: [1, 2, 18]
  },
  {
    id: 18,
    category: "State Guides",
    icon: MapPin,
    color: "green",
    title: "Massachusetts Electricity Rates: Complete MA Power Guide",
    description: "Compare Massachusetts electricity rates from 12+ suppliers. Find lowest power prices in Boston, Worcester, and Springfield.",
    image: "https://images.unsplash.com/photo-1572636661577-f6d05cbb7682?w=1200&q=80",
    excerpt: "Massachusetts offers competitive supplier options with strong DPU oversight. Save $250-400 yearly on electricity.",
    readTime: "8 min",
    keywords: ["Massachusetts electricity", "Boston power", "National Grid MA"],
    relatedArticles: [1, 2, 19]
  },
  {
    id: 19,
    category: "State Guides",
    icon: MapPin,
    color: "orange",
    title: "Connecticut Electricity Rates: CT Power Shopping Guide",
    description: "Compare Connecticut electricity rates from 12+ suppliers. Find cheapest power in Hartford, New Haven, and Stamford.",
    image: "https://images.unsplash.com/photo-1569149646689-5e8bbdbbd944?w=1200&q=80",
    excerpt: "Connecticut's PURA-regulated market offers moderate competition and real savings. Save $250-400 yearly.",
    readTime: "8 min",
    keywords: ["Connecticut electricity", "CT power", "Eversource CT"],
    relatedArticles: [1, 2, 20]
  },
  {
    id: 20,
    category: "State Guides",
    icon: MapPin,
    color: "blue",
    title: "Maine Electricity Rates: Complete ME Power Comparison Guide",
    description: "Compare Maine electricity rates from 8+ suppliers. Find cheapest power in Portland, Bangor, and Lewiston.",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&q=80",
    excerpt: "Maine's smaller competitive market still offers real savings opportunities. Save $200-350 yearly on electricity.",
    readTime: "7 min",
    keywords: ["Maine electricity", "Portland power", "CMP rates"],
    relatedArticles: [1, 2, 21]
  },
  {
    id: 21,
    category: "State Guides",
    icon: MapPin,
    color: "purple",
    title: "New Hampshire Electricity Rates: NH Power Shopping Guide",
    description: "Compare NH electricity rates from 8+ suppliers. Find cheapest power in Manchester, Nashua, and Concord.",
    image: "https://images.unsplash.com/photo-1606403726988-eb685c61c9b6?w=1200&q=80",
    excerpt: "New Hampshire offers modest supplier competition with PUC oversight. Save $200-350 yearly on electricity.",
    readTime: "7 min",
    keywords: ["New Hampshire electricity", "NH power", "Eversource NH"],
    relatedArticles: [1, 2, 22]
  },
  {
    id: 22,
    category: "State Guides",
    icon: MapPin,
    color: "green",
    title: "Rhode Island Electricity Rates: RI Power Comparison Guide",
    description: "Compare Rhode Island electricity rates from 8+ suppliers. Find cheapest power in Providence, Warwick, and Cranston.",
    image: "https://images.unsplash.com/photo-1602984891859-69d29e64b886?w=1200&q=80",
    excerpt: "Rhode Island's competitive market with PUC licensing offers genuine savings. Save $200-320 yearly on electricity.",
    readTime: "7 min",
    keywords: ["Rhode Island electricity", "RI power", "National Grid RI"],
    relatedArticles: [1, 2, 11]
  },
  // MAJOR CITY GUIDES
  {
    id: 23,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Houston Electricity Rates 2024: Complete Guide for Harris County",
    description: "Compare Houston electricity from 45+ providers serving Harris County, Katy, Pearland, The Woodlands. Save $800+ yearly.",
    image: "https://images.unsplash.com/photo-1577894947058-fccf5cf3f8ac?w=1200&q=80",
    excerpt: "Houston's massive competitive market gives 2.3M residents unmatched power to save. Find the cheapest rates.",
    readTime: "12 min",
    keywords: ["Houston electricity", "Harris County power", "Katy electricity", "Pearland power", "The Woodlands energy"],
    relatedArticles: [11, 24, 2]
  },
  {
    id: 24,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Dallas Electricity Rates 2024: DFW Metroplex Shopping Guide",
    description: "Compare Dallas-Fort Worth electricity from 40+ providers. Serving Dallas, Plano, Irving, Garland, Frisco. Save $700+ yearly.",
    image: "https://images.unsplash.com/photo-1552083974-186346191183?w=1200&q=80",
    excerpt: "DFW's 7.5M residents have access to 40+ competitive providers. Master the DFW electricity market.",
    readTime: "11 min",
    keywords: ["Dallas electricity", "DFW power rates", "Plano electricity", "Irving energy", "Frisco power", "Fort Worth electricity"],
    relatedArticles: [11, 23, 2]
  },
  {
    id: 25,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Philadelphia Electricity Rates 2024: Complete Philly Metro Guide",
    description: "Compare Philadelphia electricity from 25+ PECO suppliers. Serving Philly, Chester, Delaware, Montgomery counties. Save $500+ yearly.",
    image: "https://images.unsplash.com/photo-1548913891-2f6c0feeae98?w=1200&q=80",
    excerpt: "Philadelphia's competitive market with PA PUC oversight offers safe, effective savings for 1.5M households.",
    readTime: "11 min",
    keywords: ["Philadelphia electricity", "Philly power rates", "PECO suppliers", "PA electricity", "Philadelphia energy"],
    relatedArticles: [12, 2, 1]
  },
  // TEXAS CITIES
  {
    id: 26,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Austin Electricity Rates 2024: Compare Cheapest TX Power Plans",
    description: "Compare Austin TX electricity from 40+ providers. Round Rock, Cedar Park, Pflugerville competitive areas. Save $600-850 yearly.",
    image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=80",
    excerpt: "Austin metro area with 40+ competitive providers in surrounding cities. Find cheapest rates outside Austin Energy territory.",
    readTime: "10 min",
    keywords: ["Austin electricity", "Round Rock power", "Cedar Park electricity", "Pflugerville energy", "Austin Energy rates"],
    relatedArticles: [11, 23, 24]
  },
  {
    id: 27,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "San Antonio Electricity Rates 2024: Complete TX Power Guide",
    description: "Compare San Antonio electricity options. CPS Energy territory and competitive suburbs. Save $600-800 yearly in eligible areas.",
    image: "https://images.unsplash.com/photo-1568737948262-7f2e83ed98b3?w=1200&q=80",
    excerpt: "San Antonio electricity market overview. CPS Energy coverage and competitive options in surrounding areas.",
    readTime: "9 min",
    keywords: ["San Antonio electricity", "CPS Energy", "San Antonio power rates", "Bexar County electricity"],
    relatedArticles: [11, 23, 24]
  },
  {
    id: 28,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Fort Worth Electricity Rates 2024: Tarrant County Power Guide",
    description: "Compare Fort Worth TX electricity from 40+ providers. Serving Fort Worth, Arlington, North Richland Hills. Save $650-850 yearly.",
    image: "https://images.unsplash.com/photo-1559661012-5cf78c123ae8?w=1200&q=80",
    excerpt: "Fort Worth and Tarrant County competitive market with 40+ providers. Excellent DFW Metroplex savings opportunities.",
    readTime: "10 min",
    keywords: ["Fort Worth electricity", "Tarrant County power", "Arlington Texas electricity", "Oncor Fort Worth"],
    relatedArticles: [11, 24, 23]
  },
  {
    id: 29,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "El Paso Electricity Rates 2024: West Texas Power Guide",
    description: "Compare El Paso TX electricity options. El Paso Electric territory with limited competitive access. Save $350-500 yearly.",
    image: "https://images.unsplash.com/photo-1517639493569-5666a7556f98?w=1200&q=80",
    excerpt: "El Paso electricity market differs from rest of Texas. Limited competitive options outside ERCOT grid.",
    readTime: "8 min",
    keywords: ["El Paso electricity", "El Paso Electric", "west Texas power", "El Paso energy rates"],
    relatedArticles: [11, 23, 2]
  },
  // PENNSYLVANIA CITIES
  {
    id: 30,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Pittsburgh Electricity Rates 2024: PA Power Comparison Guide",
    description: "Compare Pittsburgh PA electricity from 25+ suppliers. Duquesne Light territory. Save $400-550 yearly with PA PUC licensed suppliers.",
    image: "https://images.unsplash.com/photo-1611964562818-b6f8d41cb64c?w=1200&q=80",
    excerpt: "Pittsburgh and Allegheny County competitive market. 25+ PA PUC certified suppliers serving Duquesne Light territory.",
    readTime: "10 min",
    keywords: ["Pittsburgh electricity", "Duquesne Light", "Pittsburgh power rates", "Allegheny County electricity"],
    relatedArticles: [12, 25, 2]
  },
  {
    id: 31,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Allentown Electricity Rates 2024: Lehigh Valley PA Power Guide",
    description: "Compare Allentown PA electricity from 25+ PPL suppliers. Lehigh Valley, Bethlehem, Easton coverage. Save $380-500 yearly.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
    excerpt: "Allentown and Lehigh Valley competitive market. PPL Electric territory with 25+ certified suppliers.",
    readTime: "9 min",
    keywords: ["Allentown electricity", "PPL Electric", "Lehigh Valley power", "Bethlehem PA electricity"],
    relatedArticles: [12, 30, 2]
  },
  // NEW YORK CITIES
  {
    id: 32,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "NYC Electricity Rates 2024: New York City ESCO Guide",
    description: "Compare NYC electricity from 20+ ESCOs. Con Edison territory covering Manhattan, Brooklyn, Queens, Bronx, Staten Island. Save $300-450 yearly.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    excerpt: "NYC ESCO market overview. 20+ suppliers serving Con Edison territory across all 5 boroughs.",
    readTime: "11 min",
    keywords: ["NYC electricity", "Con Edison rates", "Manhattan power", "Brooklyn electricity", "Queens energy"],
    relatedArticles: [13, 33, 2]
  },
  {
    id: 33,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Buffalo Electricity Rates 2024: Western NY Power Guide",
    description: "Compare Buffalo NY electricity from 18+ ESCOs. National Grid territory. Save $350-500 yearly in Erie County.",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200&q=80",
    excerpt: "Buffalo and Erie County ESCO market. 18+ suppliers serving National Grid Western NY territory.",
    readTime: "9 min",
    keywords: ["Buffalo electricity", "National Grid Buffalo", "Western NY power", "Buffalo ESCO rates"],
    relatedArticles: [13, 32, 34]
  },
  {
    id: 34,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Rochester Electricity Rates 2024: Finger Lakes NY Power Guide",
    description: "Compare Rochester NY electricity from 16+ ESCOs. RG&E territory in Monroe County. Save $300-450 yearly.",
    image: "https://images.unsplash.com/photo-1559087867-ce4c91325525?w=1200&q=80",
    excerpt: "Rochester and Monroe County ESCO market. 16+ suppliers serving Rochester Gas & Electric territory.",
    readTime: "9 min",
    keywords: ["Rochester electricity", "RG&E rates", "Monroe County power", "Rochester ESCO"],
    relatedArticles: [13, 33, 32]
  },
  // OHIO CITIES
  {
    id: 35,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Cleveland Electricity Rates 2024: NEO Power Comparison Guide",
    description: "Compare Cleveland OH electricity from 20+ suppliers. FirstEnergy/CEI territory. Save $400-550 yearly with PUCO certified suppliers.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80",
    excerpt: "Cleveland and Cuyahoga County competitive market. 20+ PUCO-certified suppliers serving FirstEnergy territory.",
    readTime: "10 min",
    keywords: ["Cleveland electricity", "FirstEnergy Cleveland", "Cuyahoga County power", "Cleveland CEI rates"],
    relatedArticles: [14, 36, 37]
  },
  {
    id: 36,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Columbus Electricity Rates 2024: Central Ohio Power Guide",
    description: "Compare Columbus OH electricity from 20+ suppliers. AEP Ohio territory. Save $400-550 yearly in Franklin County.",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80",
    excerpt: "Columbus and Franklin County competitive market. 20+ PUCO-certified suppliers serving AEP Ohio.",
    readTime: "10 min",
    keywords: ["Columbus electricity", "AEP Ohio", "Franklin County power", "Columbus energy rates"],
    relatedArticles: [14, 35, 37]
  },
  {
    id: 37,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Cincinnati Electricity Rates 2024: SW Ohio Power Guide",
    description: "Compare Cincinnati OH electricity from 18+ suppliers. Duke Energy Ohio territory. Save $400-550 yearly in Hamilton County.",
    image: "https://images.unsplash.com/photo-1574268602187-425e1f21a3c9?w=1200&q=80",
    excerpt: "Cincinnati and Hamilton County competitive market. 18+ PUCO-certified suppliers serving Duke Energy Ohio.",
    readTime: "9 min",
    keywords: ["Cincinnati electricity", "Duke Energy Ohio", "Hamilton County power", "Cincinnati energy rates"],
    relatedArticles: [14, 35, 36]
  },
  {
    id: 38,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Toledo Electricity Rates 2024: Northwest Ohio Power Guide",
    description: "Compare Toledo OH electricity from 18+ suppliers. FirstEnergy territory. Save $380-500 yearly in Lucas County.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
    excerpt: "Toledo and Lucas County competitive market. 18+ PUCO-certified suppliers serving FirstEnergy territory.",
    readTime: "9 min",
    keywords: ["Toledo electricity", "FirstEnergy Toledo", "Lucas County power", "Toledo energy rates"],
    relatedArticles: [14, 35, 36]
  },
  {
    id: 39,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Akron Electricity Rates 2024: Summit County OH Power Guide",
    description: "Compare Akron OH electricity from 18+ suppliers. FirstEnergy territory. Save $350-480 yearly in Summit County.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
    excerpt: "Akron and Summit County competitive market. 18+ PUCO-certified suppliers serving FirstEnergy territory.",
    readTime: "8 min",
    keywords: ["Akron electricity", "FirstEnergy Akron", "Summit County power", "Akron energy rates"],
    relatedArticles: [14, 35, 36]
  },
  {
    id: 40,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Chicago Electricity Rates 2024: Complete IL Metro Power Guide",
    description: "Compare Chicago IL electricity from 20+ suppliers. ComEd territory. Save $400-550 yearly in Cook County.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
    excerpt: "Chicago and Cook County competitive market. 20+ ICC-licensed suppliers serving ComEd territory.",
    readTime: "11 min",
    keywords: ["Chicago electricity", "ComEd rates", "Chicago power", "Cook County electricity", "IL energy"],
    relatedArticles: [15, 41, 42]
  },
  {
    id: 41,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Aurora Electricity Rates 2024: Chicago Suburban IL Power Guide",
    description: "Compare Aurora IL electricity from 20+ suppliers. ComEd territory. Save $380-500 yearly in Kane County.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    excerpt: "Aurora and Kane County competitive market. 20+ ICC-licensed suppliers serving ComEd western suburbs.",
    readTime: "9 min",
    keywords: ["Aurora electricity", "ComEd Aurora", "Kane County power", "Aurora IL energy"],
    relatedArticles: [15, 40, 42]
  },
  {
    id: 42,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Naperville Electricity Rates 2024: DuPage County IL Power Guide",
    description: "Compare Naperville IL electricity from 20+ suppliers. ComEd territory. Save $400-520 yearly in DuPage County.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    excerpt: "Naperville and DuPage County competitive market. 20+ ICC-licensed suppliers serving affluent Illinois suburb.",
    readTime: "9 min",
    keywords: ["Naperville electricity", "ComEd Naperville", "DuPage County power", "Naperville IL energy"],
    relatedArticles: [15, 40, 41]
  },
  {
    id: 43,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Newark Electricity Rates 2024: North Jersey Power Guide",
    description: "Compare Newark NJ electricity from 15+ suppliers. PSE&G territory. Save $350-480 yearly in Essex County.",
    image: "https://images.unsplash.com/photo-1589756823695-278bc8eac975?w=1200&q=80",
    excerpt: "Newark and Essex County competitive market. 15+ BPU-licensed suppliers serving PSE&G territory.",
    readTime: "9 min",
    keywords: ["Newark electricity", "PSE&G Newark", "Essex County power", "Newark NJ energy"],
    relatedArticles: [16, 44, 2]
  },
  {
    id: 44,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Jersey City Electricity Rates 2024: Hudson County NJ Power Guide",
    description: "Compare Jersey City NJ electricity from 15+ suppliers. PSE&G territory. Save $330-460 yearly in Hudson County.",
    image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=1200&q=80",
    excerpt: "Jersey City and Hudson County competitive market. 15+ BPU-licensed suppliers serving PSE&G territory.",
    readTime: "9 min",
    keywords: ["Jersey City electricity", "PSE&G Jersey City", "Hudson County power", "Jersey City NJ energy"],
    relatedArticles: [16, 43, 2]
  },
  {
    id: 45,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Baltimore Electricity Rates 2024: Complete MD Metro Power Guide",
    description: "Compare Baltimore MD electricity from 15+ suppliers. BGE territory. Save $380-500 yearly in Baltimore County.",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&q=80",
    excerpt: "Baltimore City and County competitive market. 15+ PSC-licensed suppliers serving BGE territory.",
    readTime: "10 min",
    keywords: ["Baltimore electricity", "BGE rates", "Baltimore power", "Baltimore County electricity", "MD energy"],
    relatedArticles: [17, 2, 1]
  },
  {
    id: 46,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Boston Electricity Rates 2024: Complete MA Metro Power Guide",
    description: "Compare Boston MA electricity from 12+ suppliers. Eversource/National Grid territory. Save $330-450 yearly.",
    image: "https://images.unsplash.com/photo-1572636661577-f6d05cbb7682?w=1200&q=80",
    excerpt: "Boston competitive market serving 600K+ households. 12+ DPU-licensed suppliers across multiple territories.",
    readTime: "10 min",
    keywords: ["Boston electricity", "Eversource Boston", "National Grid Boston", "Boston power rates", "MA energy"],
    relatedArticles: [18, 47, 2]
  },
  {
    id: 47,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Worcester Electricity Rates 2024: Central MA Power Guide",
    description: "Compare Worcester MA electricity from 12+ suppliers. National Grid territory. Save $300-420 yearly in Worcester County.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80",
    excerpt: "Worcester and Worcester County competitive market. 12+ DPU-licensed suppliers serving National Grid Central MA.",
    readTime: "9 min",
    keywords: ["Worcester electricity", "National Grid Worcester", "Worcester County power", "Worcester MA energy"],
    relatedArticles: [18, 46, 2]
  },
  {
    id: 48,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Springfield MA Electricity Rates 2024: Western MA Power Guide",
    description: "Compare Springfield MA electricity from 12+ suppliers. Eversource territory. Save $280-400 yearly in Hampden County.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=80",
    excerpt: "Springfield and Hampden County competitive market. 12+ DPU-licensed suppliers serving Eversource Western MA.",
    readTime: "9 min",
    keywords: ["Springfield MA electricity", "Eversource Springfield", "Hampden County power", "Western MA energy"],
    relatedArticles: [18, 46, 47]
  },
  {
    id: 49,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Cambridge MA Electricity Rates 2024: Metro Boston Power Guide",
    description: "Compare Cambridge MA electricity from 12+ suppliers. Eversource territory. Save $300-420 yearly in Middlesex County.",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1200&q=80",
    excerpt: "Cambridge and Middlesex County competitive market. 12+ DPU-licensed suppliers serving Eversource territory.",
    readTime: "9 min",
    keywords: ["Cambridge electricity", "Eversource Cambridge", "Middlesex County power", "Cambridge MA energy"],
    relatedArticles: [18, 46, 2]
  },
  {
    id: 50,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Hartford Electricity Rates 2024: Central CT Power Guide",
    description: "Compare Hartford CT electricity from 12+ suppliers. Eversource territory. Save $300-420 yearly in Hartford County.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
    excerpt: "Hartford and Hartford County competitive market. 12+ PURA-licensed suppliers serving Connecticut capital.",
    readTime: "9 min",
    keywords: ["Hartford electricity", "Eversource Hartford", "Hartford County power", "Hartford CT energy"],
    relatedArticles: [19, 51, 52]
  },
  {
    id: 51,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "New Haven Electricity Rates 2024: South Central CT Power Guide",
    description: "Compare New Haven CT electricity from 12+ suppliers. United Illuminating territory. Save $280-410 yearly.",
    image: "https://images.unsplash.com/photo-1569149646689-5e8bbdbbd944?w=1200&q=80",
    excerpt: "New Haven and New Haven County competitive market. 12+ PURA-licensed suppliers serving UI territory.",
    readTime: "9 min",
    keywords: ["New Haven electricity", "United Illuminating", "New Haven County power", "New Haven CT energy"],
    relatedArticles: [19, 50, 52]
  },
  {
    id: 52,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Bridgeport Electricity Rates 2024: Fairfield County CT Power Guide",
    description: "Compare Bridgeport CT electricity from 12+ suppliers. United Illuminating territory. Save $260-390 yearly.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
    excerpt: "Bridgeport and Fairfield County competitive market. 12+ PURA-licensed suppliers serving UI coastal CT.",
    readTime: "8 min",
    keywords: ["Bridgeport electricity", "United Illuminating Bridgeport", "Fairfield County power", "Bridgeport CT energy"],
    relatedArticles: [19, 50, 51]
  },
  {
    id: 53,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Stamford Electricity Rates 2024: SW Connecticut Power Guide",
    description: "Compare Stamford CT electricity from 12+ suppliers. Eversource territory. Save $300-420 yearly in Fairfield County.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
    excerpt: "Stamford competitive market near NYC. 12+ PURA-licensed suppliers serving Eversource affluent Connecticut market.",
    readTime: "9 min",
    keywords: ["Stamford electricity", "Eversource Stamford", "Fairfield County Eversource", "Stamford CT energy"],
    relatedArticles: [19, 50, 51]
  },
  {
    id: 54,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Portland ME Electricity Rates 2024: Southern Maine Power Guide",
    description: "Compare Portland ME electricity from 8+ suppliers. CMP territory. Save $280-380 yearly in Cumberland County.",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&q=80",
    excerpt: "Portland and Cumberland County competitive market. 8+ PUC-licensed suppliers serving CMP Southern Maine.",
    readTime: "8 min",
    keywords: ["Portland ME electricity", "Central Maine Power", "Cumberland County power", "Portland Maine energy"],
    relatedArticles: [20, 55, 2]
  },
  {
    id: 55,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Bangor ME Electricity Rates 2024: Northern Maine Power Guide",
    description: "Compare Bangor ME electricity from 8+ suppliers. Emera Maine territory. Save $250-360 yearly in Penobscot County.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
    excerpt: "Bangor and Penobscot County competitive market. 8+ PUC-licensed suppliers serving Emera Maine Northern ME.",
    readTime: "8 min",
    keywords: ["Bangor electricity", "Emera Maine", "Penobscot County power", "Bangor ME energy"],
    relatedArticles: [20, 54, 2]
  },
  {
    id: 56,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Manchester NH Electricity Rates 2024: Southern NH Power Guide",
    description: "Compare Manchester NH electricity from 8+ suppliers. Eversource territory. Save $280-390 yearly in Hillsborough County.",
    image: "https://images.unsplash.com/photo-1606403726988-eb685c61c9b6?w=1200&q=80",
    excerpt: "Manchester and Hillsborough County competitive market. 8+ PUC-licensed suppliers serving Eversource Southern NH.",
    readTime: "9 min",
    keywords: ["Manchester NH electricity", "Eversource Manchester", "Hillsborough County power", "Manchester New Hampshire energy"],
    relatedArticles: [21, 57, 2]
  },
  {
    id: 57,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Nashua NH Electricity Rates 2024: Greater Nashua Power Guide",
    description: "Compare Nashua NH electricity from 8+ suppliers. Eversource territory. Save $270-380 yearly near MA border.",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
    excerpt: "Nashua competitive market near Massachusetts border. 8+ PUC-licensed suppliers serving Eversource NH.",
    readTime: "8 min",
    keywords: ["Nashua NH electricity", "Eversource Nashua", "Greater Nashua power", "Nashua New Hampshire energy"],
    relatedArticles: [21, 56, 2]
  },
  {
    id: 58,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Providence RI Electricity Rates 2024: Complete RI Metro Power Guide",
    description: "Compare Providence RI electricity from 8+ suppliers. National Grid territory. Save $260-360 yearly in Providence County.",
    image: "https://images.unsplash.com/photo-1602984891859-69d29e64b886?w=1200&q=80",
    excerpt: "Providence and Providence County competitive market. 8+ PUC-licensed suppliers serving National Grid RI capital.",
    readTime: "9 min",
    keywords: ["Providence electricity", "National Grid Providence", "Providence County power", "Providence RI energy"],
    relatedArticles: [22, 59, 60]
  },
  {
    id: 59,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Warwick RI Electricity Rates 2024: Kent County Power Guide",
    description: "Compare Warwick RI electricity from 8+ suppliers. National Grid territory. Save $250-350 yearly in Kent County.",
    image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1200&q=80",
    excerpt: "Warwick and Kent County competitive market. 8+ PUC-licensed suppliers serving National Grid RI's second city.",
    readTime: "8 min",
    keywords: ["Warwick electricity", "National Grid Warwick", "Kent County power", "Warwick RI energy"],
    relatedArticles: [22, 58, 60]
  },
  {
    id: 60,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Cranston RI Electricity Rates 2024: Providence County Power Guide",
    description: "Compare Cranston RI electricity from 8+ suppliers. National Grid territory. Save $240-340 yearly near Providence.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
    excerpt: "Cranston competitive market adjacent to Providence. 8+ PUC-licensed suppliers serving National Grid RI.",
    readTime: "8 min",
    keywords: ["Cranston electricity", "National Grid Cranston", "Cranston RI power", "Cranston energy"],
    relatedArticles: [22, 58, 59]
  },
  {
    id: 61,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Syracuse NY Electricity Rates 2024: Central NY Power Guide",
    description: "Compare Syracuse NY electricity from 16+ ESCOs. National Grid territory. Save $320-440 yearly in Onondaga County.",
    image: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=1200&q=80",
    excerpt: "Syracuse and Onondaga County ESCO market. 16+ DPS-licensed ESCOs serving National Grid Central NY.",
    readTime: "9 min",
    keywords: ["Syracuse electricity", "National Grid Syracuse", "Onondaga County power", "Syracuse NY ESCO"],
    relatedArticles: [13, 32, 33]
  },
  {
    id: 62,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Albany NY Electricity Rates 2024: Capital Region Power Guide",
    description: "Compare Albany NY electricity from 16+ ESCOs. National Grid territory. Save $310-430 yearly in Albany County.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
    excerpt: "Albany and Albany County ESCO market. 16+ DPS-licensed ESCOs serving National Grid NY Capital Region.",
    readTime: "9 min",
    keywords: ["Albany electricity", "National Grid Albany", "Capital Region NY power", "Albany ESCO"],
    relatedArticles: [13, 32, 61]
  },
  {
    id: 63,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Rockford IL Electricity Rates 2024: Northern Illinois Power Guide",
    description: "Compare Rockford IL electricity from 18+ suppliers. ComEd territory. Save $330-450 yearly in Winnebago County.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    excerpt: "Rockford and Winnebago County competitive market. 18+ ICC-licensed suppliers serving ComEd Northern IL.",
    readTime: "9 min",
    keywords: ["Rockford electricity", "ComEd Rockford", "Winnebago County power", "Rockford IL energy"],
    relatedArticles: [15, 40, 41]
  },
  {
    id: 64,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Joliet IL Electricity Rates 2024: Will County Power Guide",
    description: "Compare Joliet IL electricity from 18+ suppliers. ComEd territory. Save $340-460 yearly in Will County.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
    excerpt: "Joliet and Will County competitive market. 18+ ICC-licensed suppliers serving ComEd southwest Chicago suburbs.",
    readTime: "9 min",
    keywords: ["Joliet electricity", "ComEd Joliet", "Will County power", "Joliet IL energy"],
    relatedArticles: [15, 40, 42]
  },
  {
    id: 65,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Paterson NJ Electricity Rates 2024: Passaic County Power Guide",
    description: "Compare Paterson NJ electricity from 15+ suppliers. PSE&G territory. Save $310-430 yearly in Passaic County.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    excerpt: "Paterson and Passaic County competitive market. 15+ BPU-licensed suppliers serving PSE&G North Jersey.",
    readTime: "9 min",
    keywords: ["Paterson electricity", "PSE&G Paterson", "Passaic County power", "Paterson NJ energy"],
    relatedArticles: [16, 43, 44]
  },
  {
    id: 66,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Elizabeth NJ Electricity Rates 2024: Union County Power Guide",
    description: "Compare Elizabeth NJ electricity from 15+ suppliers. PSE&G territory. Save $300-420 yearly in Union County.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=80",
    excerpt: "Elizabeth and Union County competitive market. 15+ BPU-licensed suppliers serving PSE&G NYC-adjacent market.",
    readTime: "8 min",
    keywords: ["Elizabeth electricity", "PSE&G Elizabeth", "Union County power", "Elizabeth NJ energy"],
    relatedArticles: [16, 43, 44]
  },
  {
    id: 67,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Frederick MD Electricity Rates 2024: Western Maryland Power Guide",
    description: "Compare Frederick MD electricity from 14+ suppliers. Potomac Edison territory. Save $320-440 yearly in Frederick County.",
    image: "https://images.unsplash.com/photo-1590932722660-b2e3c71b1379?w=1200&q=80",
    excerpt: "Frederick and Frederick County competitive market. 14+ PSC-licensed suppliers serving Potomac Edison Western MD.",
    readTime: "9 min",
    keywords: ["Frederick electricity", "Potomac Edison", "Frederick County power", "Frederick MD energy"],
    relatedArticles: [17, 45, 68]
  },
  {
    id: 68,
    category: "City Guides",
    icon: Building2,
    color: "blue",
    title: "Rockville MD Electricity Rates 2024: Montgomery County Power Guide",
    description: "Compare Rockville MD electricity from 15+ suppliers. Pepco territory. Save $330-450 yearly in Montgomery County.",
    image: "https://images.unsplash.com/photo-1577894947058-fccf5cf3f8ac?w=1200&q=80",
    excerpt: "Rockville and Montgomery County competitive market. 15+ PSC-licensed suppliers serving Pepco DC-adjacent MD.",
    readTime: "9 min",
    keywords: ["Rockville electricity", "Pepco Rockville", "Montgomery County MD power", "Rockville energy"],
    relatedArticles: [17, 45, 67]
  },
  {
    id: 69,
    category: "City Guides",
    icon: Building2,
    color: "purple",
    title: "Gaithersburg MD Electricity Rates 2024: Montgomery County Guide",
    description: "Compare Gaithersburg MD electricity from 15+ suppliers. Pepco territory. Save $320-440 yearly in I-270 corridor.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    excerpt: "Gaithersburg competitive market in Montgomery County. 15+ PSC-licensed suppliers serving Pepco territory.",
    readTime: "9 min",
    keywords: ["Gaithersburg electricity", "Pepco Gaithersburg", "Montgomery County Pepco", "Gaithersburg MD energy"],
    relatedArticles: [17, 68, 45]
  },
  {
    id: 70,
    category: "City Guides",
    icon: Building2,
    color: "green",
    title: "Lewiston ME Electricity Rates 2024: Androscoggin County Power Guide",
    description: "Compare Lewiston ME electricity from 8+ suppliers. CMP territory. Save $250-360 yearly in Androscoggin County.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
    excerpt: "Lewiston and Androscoggin County competitive market. 8+ PUC-licensed suppliers serving CMP Maine's second city.",
    readTime: "8 min",
    keywords: ["Lewiston electricity", "Central Maine Power Lewiston", "Androscoggin County power", "Lewiston ME energy"],
    relatedArticles: [20, 54, 55]
  },
  {
    id: 71,
    category: "City Guides",
    icon: Building2,
    color: "orange",
    title: "Concord NH Electricity Rates 2024: Capital Region NH Power Guide",
    description: "Compare Concord NH electricity from 8+ suppliers. Eversource territory. Save $260-370 yearly in Merrimack County.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    excerpt: "Concord and Merrimack County competitive market. 8+ PUC-licensed suppliers serving Eversource NH capital.",
    readTime: "8 min",
    keywords: ["Concord NH electricity", "Eversource Concord", "Merrimack County power", "Concord New Hampshire energy"],
    relatedArticles: [21, 56, 57]
  }
];

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" }
};

export default function ArticleDetail() {
  const location = window.location;
  
  // Get article ID from URL
  const urlParams = new URLSearchParams(location.search);
  const articleId = parseInt(urlParams.get('id'));
  const article = articles.find(a => a.id === articleId);

  // Scroll to top on mount and track reading - depend on full location to detect changes
  useEffect(() => {
    window.scrollTo(0, 0);
    trackDailyReading();
  }, [location.search, articleId]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link to={createPageUrl("LearningCenter")}>
            <Button className="bg-[#0A5C8C] hover:bg-[#084a6f] text-white">
              Back to Learning Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = article.icon;
  const colors = colorClasses[article.color];

  // Get full article content
  const fullArticle = getFullArticle(articleId);

  const articleSchema = getArticleSchema({
    title: fullArticle?.metaTitle || article.title,
    description: fullArticle?.metaDescription || article.description,
    image: article.image,
    datePublished: "2024-01-15",
    dateModified: "2024-01-15"
  });

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Learning Center", url: "/learning-center" },
    { name: article.title, url: `/article?id=${article.id}` }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEOHead
        title={fullArticle?.metaTitle || `${article.title} | Power Scouts Learning Center`}
        description={fullArticle?.metaDescription || article.description}
        keywords={fullArticle?.tags?.join(", ") || article.keywords.join(", ")}
        canonical={`/article?id=${article.id}`}
        image={article.image}
        type="article"
        structuredData={[articleSchema, breadcrumbData]}
      />

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={createPageUrl("LearningCenter")}>
          <Button
            variant="outline"
            className="mb-6 rounded-xl"
          >
            ← Back to Learning Center
          </Button>
        </Link>

        <article className="bg-white rounded-2xl shadow-xl border-2 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className={`inline-flex px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-bold uppercase mb-3`}>
                {article.category}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.readTime} read
                </span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 sm:p-10 lg:p-12">
            {fullArticle ? (
              <div 
                className="prose prose-lg max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: fullArticle.content }}
              />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-[#FF6B35] pl-6 py-2 bg-gray-50 rounded-r-lg">
                  {article.description}
                </p>
                
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                {/* CTA within article */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 my-8 text-center border-2 border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Start Saving Today</h3>
                  <p className="text-sm text-gray-600 mb-4">Compare electricity rates in your area now</p>
                  <Link to={createPageUrl("CompareRates")}>
                    <Button className="bg-[#0A5C8C] hover:bg-[#084a6f] text-white rounded-xl">
                      Compare Rates
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <p className="text-base text-gray-600 leading-relaxed">
                  For more personalized guidance, explore our state-specific and city-specific guides or use our free comparison tool to find the best rates in your area.
                </p>
              </div>
            )}

            {/* Related Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to={createPageUrl("CompareRates")} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <Zap className="w-5 h-5 text-[#FF6B35]" />
                  <span className="font-medium text-gray-900">Compare Rates</span>
                </Link>
                <Link to={createPageUrl("AllStates")} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <span className="font-medium text-gray-900">View All States</span>
                </Link>
                <Link to={createPageUrl("AllProviders")} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <Building2 className="w-5 h-5 text-[#FF6B35]" />
                  <span className="font-medium text-gray-900">All Providers</span>
                </Link>
                <Link to={createPageUrl("FAQ")} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <FileText className="w-5 h-5 text-[#FF6B35]" />
                  <span className="font-medium text-gray-900">FAQs</span>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Reading Analytics */}
        <div className="mt-8">
          <ReadingAnalytics allArticles={articles} />
        </div>

        {/* AI-Powered Article Recommendations */}
        <ArticleRecommendations 
          currentArticle={article}
          allArticles={articles}
        />

        {/* Bottom CTA */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Ready to Find Better Rates?
              </h2>
              <p className="text-base text-blue-100 mb-6 max-w-xl mx-auto">
                Compare electricity plans and start saving money today
              </p>
              <Link to={createPageUrl("CompareRates")}>
                <Button className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-8 py-6 text-lg font-bold rounded-xl">
                  Compare Rates Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Article Tags */}
        {fullArticle?.tags && fullArticle.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Article Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {fullArticle.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles for Article Content */}
      <style>{`
        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .article-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #4a5568;
        }
        
        .article-content strong {
          font-weight: 600;
          color: #2d3748;
        }
        
        .article-content ul, .article-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          color: #4a5568;
        }
        
        .article-content .cta-box {
          background: linear-gradient(135deg, #EBF8FF 0%, #E6FFFA 100%);
          border: 2px solid #90CDF4;
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
          text-align: center;
        }
        
        .article-content .cta-box h3 {
          color: #0A5C8C;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
        }
        
        .article-content .cta-box p {
          color: #4a5568;
          margin-bottom: 1rem;
        }
        
        .article-content .cta-button {
          display: inline-block;
          background: #FF6B35;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .article-content .cta-button:hover {
          background: #e55a2b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        
        .article-content a:not(.cta-button) {
          color: #0A5C8C;
          text-decoration: underline;
        }
        
        .article-content a:not(.cta-button):hover {
          color: #084a6f;
        }
      `}</style>
    </div>
  );
}