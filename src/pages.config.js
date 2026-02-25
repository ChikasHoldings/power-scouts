/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AboutUs from './pages/AboutUs';
import AllCities from './pages/AllCities';
import AllProviders from './pages/AllProviders';
import AllStates from './pages/AllStates';
import ArticleDetail from './pages/ArticleDetail';
import BillAnalyzer from './pages/BillAnalyzer';
import BusinessCompareRates from './pages/BusinessCompareRates';
import BusinessElectricity from './pages/BusinessElectricity';
import BusinessHub from './pages/BusinessHub';
import BusinessQuoteDashboard from './pages/BusinessQuoteDashboard';
import CityRates from './pages/CityRates';
import CompareRates from './pages/CompareRates';
import ConnecticutElectricity from './pages/ConnecticutElectricity';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import HomeConcierge from './pages/HomeConcierge';
import IllinoisElectricity from './pages/IllinoisElectricity';
import Landing from './pages/Landing';
import LearningCenter from './pages/LearningCenter';
import MaineElectricity from './pages/MaineElectricity';
import MarylandElectricity from './pages/MarylandElectricity';
import MassachusettsElectricity from './pages/MassachusettsElectricity';
import NewHampshireElectricity from './pages/NewHampshireElectricity';
import NewJerseyElectricity from './pages/NewJerseyElectricity';
import NewYorkElectricity from './pages/NewYorkElectricity';
import NotFound from './pages/NotFound';
import OhioElectricity from './pages/OhioElectricity';
import PennsylvaniaElectricity from './pages/PennsylvaniaElectricity';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProviderDetails from './pages/ProviderDetails';
import RenewableCompareRates from './pages/RenewableCompareRates';
import RenewableEnergy from './pages/RenewableEnergy';
import RhodeIslandElectricity from './pages/RhodeIslandElectricity';
import Robots from './pages/Robots';
import SavingsCalculator from './pages/SavingsCalculator';
import Sitemap from './pages/Sitemap';
import SitemapXML from './pages/SitemapXML';
import TermsOfService from './pages/TermsOfService';
import TexasElectricity from './pages/TexasElectricity';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutUs": AboutUs,
    "AllCities": AllCities,
    "AllProviders": AllProviders,
    "AllStates": AllStates,
    "ArticleDetail": ArticleDetail,
    "BillAnalyzer": BillAnalyzer,
    "BusinessCompareRates": BusinessCompareRates,
    "BusinessElectricity": BusinessElectricity,
    "BusinessHub": BusinessHub,
    "BusinessQuoteDashboard": BusinessQuoteDashboard,
    "CityRates": CityRates,
    "CompareRates": CompareRates,
    "ConnecticutElectricity": ConnecticutElectricity,
    "FAQ": FAQ,
    "Home": Home,
    "HomeConcierge": HomeConcierge,
    "IllinoisElectricity": IllinoisElectricity,
    "Landing": Landing,
    "LearningCenter": LearningCenter,
    "MaineElectricity": MaineElectricity,
    "MarylandElectricity": MarylandElectricity,
    "MassachusettsElectricity": MassachusettsElectricity,
    "NewHampshireElectricity": NewHampshireElectricity,
    "NewJerseyElectricity": NewJerseyElectricity,
    "NewYorkElectricity": NewYorkElectricity,
    "NotFound": NotFound,
    "OhioElectricity": OhioElectricity,
    "PennsylvaniaElectricity": PennsylvaniaElectricity,
    "PrivacyPolicy": PrivacyPolicy,
    "ProviderDetails": ProviderDetails,
    "RenewableCompareRates": RenewableCompareRates,
    "RenewableEnergy": RenewableEnergy,
    "RhodeIslandElectricity": RhodeIslandElectricity,
    "Robots": Robots,
    "SavingsCalculator": SavingsCalculator,
    "Sitemap": Sitemap,
    "SitemapXML": SitemapXML,
    "TermsOfService": TermsOfService,
    "TexasElectricity": TexasElectricity,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};