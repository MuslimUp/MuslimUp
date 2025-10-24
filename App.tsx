import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from './lib/supabase';
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
import AuthModal from './components/AuthModal';
import CreateServicePage from './components/CreateServicePage';
import SellerAccountPage from './components/SellerAccountPage';
import FloatingChatButton from './components/FloatingChatButton';

import { CATEGORIES, FREELANCERS, SERVICES, TESTIMONIALS } from './constants';
import { Freelancer, Service } from './types';

// Home Page Component
const HomePage: React.FC<{
  onServiceClick: (id: string) => void;
  freelancersMap: Record<string, Freelancer>;
  onNavigate: (page: string) => void;
  services: Service[];
  onCategoryFilter: (categoryId: string) => void;
}> = ({ onServiceClick, freelancersMap, onNavigate, services, onCategoryFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);

  const handleSearch = (query?: string) => {
    const searchTerm = typeof query === 'string' ? query : searchQuery;
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  React.useEffect(() => {
    setFilteredServices(services);
  }, [services]);

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
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={() => handleSearch()} />
            <div className="mt-5 flex items-center justify-center flex-wrap gap-x-8 gap-y-2 text-lg text-white">
              <button onClick={() => handleSuggestionClick('logo')} className="hover:text-teal-300 transition-colors">logo</button>
              <button onClick={() => handleSuggestionClick('site web')} className="hover:text-teal-300 transition-colors">site web</button>
              <button onClick={() => handleSuggestionClick('find clients')} className="hover:text-teal-300 transition-colors">find clients</button>
              <button onClick={() => handleSuggestionClick('montage vidéo')} className="hover:text-teal-300 transition-colors">montage vidéo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Découvrez nos catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryFilter(category.id)}
                className="group flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <category.icon className="h-12 w-12 text-teal-400 mb-4 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-white text-center">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Services populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.slice(0, 10).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  freelancer={freelancersMap[service.freelancerId]}
                  onClick={() => onServiceClick(service.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Aucun service trouvé pour votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
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

      {/* CTA Section */}
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
  const [activeInfoPage, setActiveInfoPage] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loginSuccessAction, setLoginSuccessAction] = useState<'default' | 'becomeSeller'>('default');
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        supabase
          .from('profiles')
          .select('is_seller')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.is_seller) {
              setIsSeller(true);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setIsSeller(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles!services_seller_id_fkey (
            id,
            full_name,
            avatar_url,
            seller_level,
            response_time_hours,
            orders_completed,
            on_time_delivery_rate,
            member_since
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        const transformedServices: Service[] = data.map((item: any) => ({
          id: item.id,
          freelancerId: item.seller_id,
          categoryId: item.category_id,
          title: item.title,
          description: item.description,
          imageUrl: item.image_url,
          price: parseFloat(item.price),
          features: item.features || [],
          rating: 0,
          reviewCount: 0,
          ordersInQueue: item.orders_in_queue || 0,
        }));
        setServices(transformedServices);
      }
      setLoadingServices(false);
    };

    fetchServices();
  }, []);
  
  const [profiles, setProfiles] = useState<Freelancer[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_seller', true);

      if (data) {
        const transformedProfiles: Freelancer[] = data.map((profile: any) => ({
          id: profile.id,
          name: profile.full_name,
          title: 'Freelance',
          avatarUrl: profile.avatar_url,
          level: profile.seller_level === 'top' ? 'Top Vendeur' : profile.seller_level === 'level2' ? 'Vendeur de Niveau 2' : profile.seller_level === 'level1' ? 'Vendeur de Niveau 1' : 'Nouveau vendeur',
          description: profile.bio || '',
          rating: 4.8,
          reviewCount: 0,
          stats: {
            responseTime: profile.response_time_hours || 24,
            ordersCompleted: profile.orders_completed || 0,
            onTimeDeliveryRate: profile.on_time_delivery_rate || 100,
          },
          memberSince: new Date(profile.member_since).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        }));
        setProfiles(transformedProfiles);
      }
    };

    fetchProfiles();
  }, []);

  const freelancersMap = useMemo(() => {
    const allFreelancers = [...FREELANCERS, ...profiles];
    return allFreelancers.reduce((acc, freelancer) => {
      acc[freelancer.id] = freelancer;
      return acc;
    }, {} as Record<string, Freelancer>);
  }, [profiles]);

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
      setIsCreatingService(false);
      window.scrollTo(0, 0);
  }, []);
  
  const handleLoginSuccess = useCallback(async () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (loginSuccessAction === 'becomeSeller') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('profiles')
            .update({ is_seller: true })
            .eq('id', session.user.id);
          setIsSeller(true);
        }
        handleGoHome();
    }
    setLoginSuccessAction('default');
  }, [loginSuccessAction, handleGoHome]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsSeller(false);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setActiveInfoPage(page === 'home' ? null : page);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    setIsCreatingService(false);
    window.scrollTo(0, 0);
  }, []);
  
  const handleAuthClick = useCallback(() => {
    setLoginSuccessAction('default');
    setIsAuthModalOpen(true);
  }, []);
  
  const handleBecomeSeller = useCallback(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({ is_seller: true })
          .eq('id', session.user.id);
        setIsSeller(true);
      }
      handleGoHome();
  }, [handleGoHome]);

  const handleAuthAndBecomeSeller = useCallback(() => {
      setLoginSuccessAction('becomeSeller');
      setIsAuthModalOpen(true);
  }, []);

  const handleCreateServiceClick = useCallback(() => {
    setIsCreatingService(true);
    setActiveInfoPage(null);
    setSelectedServiceId(null);
    setSelectedFreelancerId(null);
    window.scrollTo(0, 0);
  }, []);

  const handleServiceCreate = useCallback(async (newServiceData: Omit<Service, 'id' | 'freelancerId' | 'rating' | 'reviewCount' | 'ordersInQueue'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('services')
      .insert({
        seller_id: session.user.id,
        category_id: newServiceData.categoryId,
        title: newServiceData.title,
        description: newServiceData.description,
        image_url: newServiceData.imageUrl,
        price: newServiceData.price,
        features: newServiceData.features,
        is_active: true,
      })
      .select()
      .single();

    if (data) {
      const newService: Service = {
        id: data.id,
        freelancerId: data.seller_id,
        categoryId: data.category_id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        price: parseFloat(data.price),
        features: data.features || [],
        rating: 0,
        reviewCount: 0,
        ordersInQueue: 0,
      };
      setServices(prevServices => [newService, ...prevServices]);
    }

    setIsCreatingService(false);
    handleGoHome();
  }, [handleGoHome]);

  const handleServiceClick = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveInfoPage(null);
    setIsCreatingService(false);
    window.scrollTo(0, 0);
  }, []);

  const handleFreelancerClick = useCallback((freelancerId: string) => {
    setSelectedFreelancerId(freelancerId);
    setSelectedServiceId(null);
    setIsCreatingService(false);
    window.scrollTo(0, 0);
  }, []);
  
  const handleCategoryFilter = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    window.scrollTo({ top: document.getElementById('services-section')?.offsetTop, behavior: 'smooth' });
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

  const displayedServices = useMemo(() => {
    if (!selectedCategory) return services;
    return services.filter(service => service.categoryId === selectedCategory);
  }, [services, selectedCategory]);

  const renderPage = () => {
    if (isCreatingService) {
      return <CreateServicePage categories={CATEGORIES} onServiceCreate={handleServiceCreate} onBack={handleGoHome} />;
    }

    if (activeInfoPage) {
        if (activeInfoPage === 'seller-account') {
            return <SellerAccountPage />;
        }
        if (activeInfoPage === 'how-it-works') return <HowItWorksPage />;
        if (activeInfoPage === 'values') return <ValuesPage />;
        if (activeInfoPage === 'become-seller') {
            const startSellingAction = isAuthenticated ? handleBecomeSeller : handleAuthAndBecomeSeller;
            return <BecomeSellerPage onStartSelling={startSellingAction} />;
        }
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
        const freelancerServices = services.filter(s => s.freelancerId === selectedFreelancerId);
        return <FreelancerDetailPage freelancer={freelancer} services={freelancerServices} freelancersMap={freelancersMap} onBack={handleBack} onServiceClick={handleServiceClick} />;
    }
    
    return <HomePage onServiceClick={handleServiceClick} freelancersMap={freelancersMap} onNavigate={handleNavigate} services={displayedServices} onCategoryFilter={handleCategoryFilter} />;
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
      <Footer onCategoryClick={handleCategoryFilter} onNavigate={handleNavigate} />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      <FloatingChatButton />
    </div>
  );
};

export default App;