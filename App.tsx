import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ServiceCard from './components/ServiceCard';
import TestimonialCard from './components/TestimonialCard';
import ServiceDetailPage from './components/ServiceDetailPage';
import FreelancerDetailPage from './components/FreelancerDetailPage';
import HowItWorksPage from './components/HowItWorksPage';
import ValuesPage from './components/ValuesPage';
import BecomeSellerPage from './components/BecomeSellerPage';
import FaqPage from './components/FaqPage';
import TrustAndSafetyPage from './components/TrustAndSafetyPage';
import { CATEGORIES, FREELANCERS, SERVICES, TESTIMONIALS } from './constants';
import { Freelancer, Service } from './types';
import AuthForm from './AuthForm'; // ✅ Ton vrai formulaire Firebase

// Home Page Component
const HomePage: React.FC<{
  onServiceClick: (id: string) => void;
  freelancersMap: Record<string, Freelancer>;
  onNavigate: (page: string) => void;
}> = ({ onServiceClick, freelancersMap, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 text-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900"></div>
          <div className="absolute top-1/2 left-1/2 w-[80rem] h-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-teal-900/50 to-gray-900 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 w-[60rem] h-[60rem] -translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-br from-teal-800/40 to-gray-900 animate-[spin_30s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            Le talent de la <span className="text-teal-400">Oumma</span> au service de vos projets.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
            Mettez en relation vos ambitions avec les compétences de notre communauté. La marketplace des freelances musulmans.
          </p>
          <div className="mt-12">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
          </div>
        </div>
      </section>
    </main>
  );
};

// Application principale
const App: React.FC = () => {
  const [activeInfoPage, setActiveInfoPage] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const freelancersMap = useMemo(() => {
    return FREELANCERS.reduce((acc, freelancer) => {
      acc[freelancer.id] = freelancer;
      return acc;
    }, {} as Record<string, Freelancer>);
  }, []);

  const servicesMap = useMemo(() => {
    return SERVICES.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {} as Record<string, Service>);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setActiveInfoPage(page === 'home' ? null : page);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    window.scrollTo(0, 0);
  }, []);

  const handleAuthClick = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const handleGoHome = useCallback(() => {
    setActiveInfoPage(null);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    window.scrollTo(0, 0);
  }, []);

  const handleServiceClick = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveInfoPage(null);
    window.scrollTo(0, 0);
  }, []);

  const handleFreelancerClick = useCallback((freelancerId: string) => {
    setSelectedFreelancerId(freelancerId);
    setSelectedServiceId(null);
    setActiveInfoPage(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedFreelancerId) {
      setSelectedFreelancerId(null);
      handleGoHome();
    } else if (selectedServiceId) {
      setSelectedServiceId(null);
      handleGoHome();
    } else {
      handleGoHome();
    }
  }, [selectedFreelancerId, selectedServiceId, handleGoHome]);

  const renderPage = () => {
    if (activeInfoPage) {
      if (activeInfoPage === 'how-it-works') return <HowItWorksPage />;
      if (activeInfoPage === 'values') return <ValuesPage />;
      if (activeInfoPage === 'become-seller') return <BecomeSellerPage onStartSelling={handleAuthClick} />;
      if (activeInfoPage === 'faq') return <FaqPage />;
      if (activeInfoPage === 'trust-and-safety') return <TrustAndSafetyPage />;
    }

    if (selectedServiceId) {
      const service = servicesMap[selectedServiceId];
      const freelancer = freelancersMap[service.freelancerId];
      return <ServiceDetailPage service={service} freelancer={freelancer} onBack={handleBack} onFreelancerClick={handleFreelancerClick} />;
    }

    if (selectedFreelancerId) {
      const freelancer = freelancersMap[selectedFreelancerId];
      const freelancerServices = SERVICES.filter(s => s.freelancerId === selectedFreelancerId);
      return <FreelancerDetailPage freelancer={freelancer} services={freelancerServices} freelancersMap={freelancersMap} onBack={handleBack} onServiceClick={handleServiceClick} />;
    }

    return <HomePage onServiceClick={handleServiceClick} freelancersMap={freelancersMap} onNavigate={handleNavigate} />;
  };

  return (
    <div className="bg-gray-900 text-gray-200">
      <Header onNavigate={handleNavigate} onAuthClick={handleAuthClick} />
      {renderPage()}
      <Footer onCategoryClick={() => {}} onNavigate={handleNavigate} />
      {isAuthModalOpen && <AuthForm />} {/* ✅ ton vrai formulaire Firebase */}
    </div>
  );
};

export default App;

   
