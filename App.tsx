import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ServiceCard from './components/ServiceCard';
import TestimonialCard from './components/TestimonialCard';
import ServiceDetailPageNew from './components/ServiceDetailPageNew';
import FreelancerDetailPage from './components/FreelancerDetailPage';
import HowItWorksPage from './components/HowItWorksPage';
import ValuesPage from './components/ValuesPage';
import BecomeSellerPage from './components/BecomeSellerPage';
import FaqPage from './components/FaqPage';
import TrustAndSafetyPage from './components/TrustAndSafetyPage';
import HelpCenterPage from './components/HelpCenterPage';
import AuthModal from './components/AuthModal';
import CreateServicePageNew from './components/CreateServicePageNew';
import SellerDashboardPage from './components/SellerDashboardPage';
import FloatingChatButton from './components/FloatingChatButton';
import OrdersPageNew from './components/OrdersPageNew';
import OrderDetailPage from './components/OrderDetailPage';
import OrderCreationPage from './components/OrderCreationPage';
import AdvancedSearchPage from './components/AdvancedSearchPage';
import { ProfilePage } from './components/ProfilePage';
import ReviewSubmissionModal from './components/ReviewSubmissionModal';
import { supabase } from './lib/supabase';
import { useServices } from './hooks/useServices';
import { useProfiles } from './hooks/useProfiles';

import { CATEGORIES, FREELANCERS, SERVICES, TESTIMONIALS } from './constants';
import { Freelancer, Service } from './types';

const HomePage: React.FC<{
  onServiceClick: (id: string) => void;
  freelancersMap: Record<string, Freelancer>;
  onNavigate: (page: string) => void;
  services: Service[];
}> = ({ onServiceClick, freelancersMap, onNavigate, services }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = searchQuery.trim()
    ? services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : services;

  const handleSearch = (query?: string) => {
    const searchTerm = typeof query === 'string' ? query : searchQuery;
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <main>
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
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={() => handleSearch()} />
            <div className="mt-5 flex items-center justify-center flex-wrap gap-x-8 gap-y-2 text-lg text-white">
              <button onClick={() => handleSuggestionClick('logo')} className="hover:text-teal-300 transition-colors">logo</button>
              <button onClick={() => handleSuggestionClick('site web')} className="hover:text-teal-300 transition-colors">site web</button>
              <button onClick={() => handleSuggestionClick('design')} className="hover:text-teal-300 transition-colors">design</button>
              <button onClick={() => handleSuggestionClick('montage vidéo')} className="hover:text-teal-300 transition-colors">montage vidéo</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Découvrez nos catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => onNavigate('search')}
                className="group flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <category.icon className="h-12 w-12 text-teal-400 mb-4 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-white text-center">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            {searchQuery ? 'Résultats de recherche' : 'Services populaires'}
          </h2>
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Aucun service trouvé pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredServices.slice(0, 20).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  freelancer={freelancersMap[service.freelancerId] || freelancersMap[service.sellerId || '']}
                  onClick={() => onServiceClick(service.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Ce que notre communauté en pense</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {TESTIMONIALS.map(testimonial => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>
        </div>
      </section>

      <section className="relative bg-teal-500 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 max-w-7xl mx-auto overflow-hidden xl:px-8">
                <svg x="50%" y={-130} className="absolute left-full -translate-x-1/2 -translate-y-1/4 transform-gpu opacity-20" width={404} height={784} fill="none" viewBox="0 0 404 784">
                    <defs>
                        <pattern id="b1e6e422-73f8-40a6-b5d9-fa75ad50783a" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                            <rect x={0} y={0} width={4} height={4} className="text-teal-400" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width={404} height={784} fill="url(#b1e6e422-73f8-40a6-b5d9-fa75ad50783a)" />
                </svg>
            </div>
        </div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Prêt à démarrer ?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-900">
            Que vous cherchiez un talent ou que vous souhaitiez en proposer un, MuslimUp est la plateforme qu'il vous faut.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-gray-900 rounded-lg shadow-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Trouver un service
            </button>
            <button
              onClick={() => onNavigate('become-seller')}
              className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-gray-900 bg-white/50 rounded-lg border-2 border-transparent hover:bg-white/80 transition-colors"
            >
              Devenir vendeur
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const App: React.FC = () => {
  const { services: dbServices, loading: servicesLoading } = useServices();
  const { profiles: dbProfiles, loading: profilesLoading, becomeSeller: becomeSellerDB } = useProfiles();

  const [activeInfoPage, setActiveInfoPage] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderCreation, setOrderCreation] = useState<{ serviceId: string; packageId: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loginSuccessAction, setLoginSuccessAction] = useState<'default' | 'becomeSeller'>('default');
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ orderId: string; serviceId: string; sellerId: string } | null>(null);

  const services = dbServices.length > 0 ? dbServices : SERVICES;
  const freelancersMap = useMemo(() => {
    const dbProfilesCount = Object.keys(dbProfiles).length;
    if (dbProfilesCount > 0) {
      return dbProfiles;
    }
    return FREELANCERS.reduce((acc, freelancer) => {
      acc[freelancer.id] = freelancer;
      return acc;
    }, {} as Record<string, Freelancer>);
  }, [dbProfiles]);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_seller')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.is_seller) {
            setIsSeller(true);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setIsAuthenticated(!!session);

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_seller')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.is_seller) {
            setIsSeller(true);
          }
        } else {
          setIsSeller(false);
          if (event === 'SIGNED_OUT') {
            handleGoHome();
          }
        }
      });

      return () => subscription.unsubscribe();
    } else {
      if (localStorage.getItem('isAuthenticated') === 'true') {
        setIsAuthenticated(true);
      }
      if (localStorage.getItem('isSeller') === 'true') {
        setIsSeller(true);
      }
    }
  }, []);

  const servicesMap = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {} as Record<string, Service>);
  }, [services]);

  const handleGoHome = useCallback(() => {
      setActiveInfoPage(null);
      setSelectedServiceId(null);
      setSelectedFreelancerId(null);
      setSelectedOrderId(null);
      setOrderCreation(null);
      setIsCreatingService(false);
      window.scrollTo(0, 0);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setActiveInfoPage(page === 'home' ? null : page);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    setSelectedOrderId(null);
    setOrderCreation(null);
    setIsCreatingService(false);
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (loginSuccessAction === 'becomeSeller') {
        localStorage.setItem('isSeller', 'true');
        setIsSeller(true);
        handleGoHome();
    } else {
        handleNavigate('dashboard');
    }
    setLoginSuccessAction('default');
  }, [loginSuccessAction, handleGoHome, handleNavigate]);

  const handleLogout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isSeller');
    setIsAuthenticated(false);
    setIsSeller(false);
    handleGoHome();
  }, [handleGoHome]);

  const handleAuthClick = useCallback(() => {
    setLoginSuccessAction('default');
    setIsAuthModalOpen(true);
  }, []);

  const handleBecomeSeller = useCallback(async () => {
      try {
        await becomeSellerDB();
        localStorage.setItem('isSeller', 'true');
        setIsSeller(true);
        handleGoHome();
      } catch (error) {
        console.error('Erreur lors de l\'activation du compte vendeur:', error);
        localStorage.setItem('isSeller', 'true');
        setIsSeller(true);
        handleGoHome();
      }
  }, [handleGoHome, becomeSellerDB]);

  const handleAuthAndBecomeSeller = useCallback(() => {
      setLoginSuccessAction('becomeSeller');
      setIsAuthModalOpen(true);
  }, []);

  const handleCreateServiceClick = useCallback(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!isSeller) {
      handleNavigate('become-seller');
      return;
    }
    setIsCreatingService(true);
    setActiveInfoPage(null);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    setSelectedOrderId(null);
    setOrderCreation(null);
    window.scrollTo(0, 0);
  }, [isAuthenticated, isSeller, handleNavigate]);

  const handleServiceClick = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveInfoPage(null);
    setIsCreatingService(false);
    setSelectedOrderId(null);
    setOrderCreation(null);
    window.scrollTo(0, 0);
  }, []);

  const handleFreelancerClick = useCallback((freelancerId: string) => {
    setSelectedFreelancerId(freelancerId);
    setSelectedServiceId(null);
    setIsCreatingService(false);
    setSelectedOrderId(null);
    setOrderCreation(null);
    window.scrollTo(0, 0);
  }, []);

  const handleOrderClick = useCallback((serviceId: string, packageId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setOrderCreation({ serviceId, packageId });
    setSelectedServiceId(null);
    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  const handleOrderSuccess = useCallback((orderId: string) => {
    setOrderCreation(null);
    setSelectedOrderId(orderId);
    window.scrollTo(0, 0);
  }, []);

  const handleViewOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveInfoPage(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedOrderId) {
      setSelectedOrderId(null);
      handleNavigate('orders');
    } else if (orderCreation) {
      setOrderCreation(null);
      handleServiceClick(orderCreation.serviceId);
    } else if (selectedFreelancerId) {
        setSelectedFreelancerId(null);
        handleGoHome();
    } else if (selectedServiceId) {
        setSelectedServiceId(null);
        handleGoHome();
    } else {
        handleGoHome();
    }
  }, [selectedFreelancerId, selectedServiceId, selectedOrderId, orderCreation, handleGoHome, handleNavigate, handleServiceClick]);

  const renderPage = () => {
    if (orderCreation) {
      const service = servicesMap[orderCreation.serviceId];
      if (!service) {
        handleGoHome();
        return null;
      }
      return (
        <OrderCreationPage
          service={service}
          packageId={orderCreation.packageId}
          onBack={handleBack}
          onSuccess={handleOrderSuccess}
        />
      );
    }

    if (selectedOrderId) {
      return <OrderDetailPage orderId={selectedOrderId} onBack={handleBack} />;
    }

    if (isCreatingService) {
      return <CreateServicePageNew categories={CATEGORIES} onBack={handleGoHome} onSuccess={handleGoHome} />;
    }

    if (activeInfoPage) {
        if (activeInfoPage === 'dashboard') {
            if (!isAuthenticated) {
                setActiveInfoPage(null);
                setIsAuthModalOpen(true);
                return null;
            }
            return (
              <SellerDashboardPage
                onCreateService={handleCreateServiceClick}
                onEditService={(serviceId) => console.log('Edit service:', serviceId)}
                onViewOrders={() => handleNavigate('orders')}
              />
            );
        }
        if (activeInfoPage === 'orders') {
            if (!isAuthenticated) {
                setActiveInfoPage(null);
                setIsAuthModalOpen(true);
                return null;
            }
            return <OrdersPageNew onOrderClick={handleViewOrder} />;
        }
        if (activeInfoPage === 'messages') {
            if (!isAuthenticated) {
                setActiveInfoPage(null);
                setIsAuthModalOpen(true);
                return null;
            }
            return (
              <div className="min-h-screen bg-gray-900 pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>
                  <div className="bg-white/5 rounded-xl p-12 border border-white/10 text-center">
                    <p className="text-gray-400 text-lg">Messagerie en cours de développement</p>
                  </div>
                </div>
              </div>
            );
        }
        if (activeInfoPage === 'profile') {
            if (!isAuthenticated) {
                setActiveInfoPage(null);
                setIsAuthModalOpen(true);
                return null;
            }
            return <ProfilePage onBack={handleGoHome} />;
        }
        if (activeInfoPage === 'search') {
            return <AdvancedSearchPage categories={CATEGORIES} onServiceClick={handleServiceClick} />;
        }
        if (activeInfoPage === 'how-it-works') return <HowItWorksPage />;
        if (activeInfoPage === 'values') return <ValuesPage />;
        if (activeInfoPage === 'become-seller') {
            const startSellingAction = isAuthenticated ? handleBecomeSeller : handleAuthAndBecomeSeller;
            return <BecomeSellerPage onStartSelling={startSellingAction} />;
        }
        if (activeInfoPage === 'faq') return <FaqPage />;
        if (activeInfoPage === 'trust-and-safety') return <TrustAndSafetyPage />;
        if (activeInfoPage === 'help-center') return <HelpCenterPage />;
    }

    if (selectedServiceId) {
      const service = servicesMap[selectedServiceId];
      if (!service) {
        handleGoHome();
        return null;
      }
      const freelancer = freelancersMap[service.sellerId || service.freelancerId];
      return (
        <ServiceDetailPageNew
          service={service}
          freelancer={freelancer}
          onBack={handleBack}
          onFreelancerClick={handleFreelancerClick}
          onOrderClick={handleOrderClick}
        />
      );
    }

    if (selectedFreelancerId) {
        const freelancer = freelancersMap[selectedFreelancerId];
        const freelancerServices = services.filter(s => (s.sellerId || s.freelancerId) === selectedFreelancerId);
        return <FreelancerDetailPage freelancer={freelancer} services={freelancerServices} freelancersMap={freelancersMap} onBack={handleBack} onServiceClick={handleServiceClick} />;
    }

    return <HomePage onServiceClick={handleServiceClick} freelancersMap={freelancersMap} onNavigate={handleNavigate} services={services} />;
  };

  return (
    <div className="bg-gray-900 text-gray-200">
      <Header
        onNavigate={handleNavigate}
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        isSeller={isSeller}
        onLogout={handleLogout}
        onCreateServiceClick={handleCreateServiceClick}
      />
      {renderPage()}
      <Footer onCategoryClick={() => handleNavigate('search')} onNavigate={handleNavigate} />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      {reviewModal && (
        <ReviewSubmissionModal
          orderId={reviewModal.orderId}
          serviceId={reviewModal.serviceId}
          sellerId={reviewModal.sellerId}
          onClose={() => setReviewModal(null)}
          onSuccess={() => {
            setReviewModal(null);
            handleGoHome();
          }}
        />
      )}
      <FloatingChatButton />
    </div>
  );
};

export default App;
