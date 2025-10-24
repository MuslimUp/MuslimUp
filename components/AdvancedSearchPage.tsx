import React, { useState, useEffect } from 'react';
import { Service, Freelancer, Category } from '../types';
import { supabase } from '../lib/supabase';
import ServiceCard from './ServiceCard';

interface AdvancedSearchPageProps {
  categories: Category[];
  onServiceClick: (id: string) => void;
}

const AdvancedSearchPage: React.FC<AdvancedSearchPageProps> = ({
  categories,
  onServiceClick
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [freelancers, setFreelancers] = useState<Record<string, Freelancer>>({});
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('newest');

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sortBy]);

  const fetchServices = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'popular':
          query = query.order('total_sales', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const servicesWithPackages = await Promise.all(
          data.map(async (s) => {
            const { data: packages } = await supabase
              .from('service_packages')
              .select('price')
              .eq('service_id', s.id)
              .eq('is_active', true)
              .order('price', { ascending: true })
              .limit(1);

            return {
              id: s.id,
              freelancerId: s.seller_id,
              sellerId: s.seller_id,
              categoryId: s.category_id,
              category: s.category,
              title: s.title,
              slug: s.slug,
              imageUrl: s.image_url,
              tags: s.tags,
              rating: s.rating,
              reviewCount: s.review_count,
              price: packages && packages.length > 0 ? packages[0].price : 0,
              ordersInQueue: s.orders_in_queue,
              totalSales: s.total_sales,
              description: s.description,
              isActive: s.is_active,
              createdAt: s.created_at
            };
          })
        );

        setServices(servicesWithPackages);

        const sellerIds = [...new Set(data.map(s => s.seller_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', sellerIds);

        if (profiles) {
          const freelancersMap = profiles.reduce((acc, p) => {
            acc[p.id] = {
              id: p.id,
              name: p.name || 'Utilisateur',
              title: p.title || 'Freelance',
              avatarUrl: p.avatar_url || 'https://picsum.photos/128/128',
              level: p.level || 'Nouveau vendeur',
              description: p.description || '',
              rating: p.rating || 0,
              reviewCount: p.review_count || 0,
              stats: {
                responseTime: p.response_time || 24,
                ordersCompleted: p.orders_completed || 0,
                onTimeDeliveryRate: p.on_time_delivery_rate || 100
              },
              memberSince: p.member_since || new Date().toLocaleDateString()
            };
            return acc;
          }, {} as Record<string, Freelancer>);

          setFreelancers(freelancersMap);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (searchQuery && !service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (minPrice && service.price < parseInt(minPrice)) {
      return false;
    }

    if (maxPrice && service.price > parseInt(maxPrice)) {
      return false;
    }

    if (minRating && service.rating < parseFloat(minRating)) {
      return false;
    }

    return true;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Rechercher un service</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Filtres</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prix minimum (€)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prix maximum (€)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Note minimum</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Toutes les notes</option>
                    <option value="4.5">4.5★ et plus</option>
                    <option value="4.0">4.0★ et plus</option>
                    <option value="3.5">3.5★ et plus</option>
                    <option value="3.0">3.0★ et plus</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setMinPrice('');
                    setMaxPrice('');
                    setMinRating('');
                  }}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par mot-clé..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {sortedServices.length} service{sortedServices.length > 1 ? 's' : ''} trouvé{sortedServices.length > 1 ? 's' : ''}
                </p>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="newest">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Mieux notés</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">Chargement...</p>
              </div>
            ) : sortedServices.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">Aucun service trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    freelancer={freelancers[service.sellerId || service.freelancerId] || {
                      id: service.freelancerId,
                      name: 'Freelance',
                      title: 'Vendeur',
                      avatarUrl: 'https://picsum.photos/128/128',
                      level: 'Nouveau vendeur',
                      description: '',
                      rating: 0,
                      reviewCount: 0,
                      stats: { responseTime: 24, ordersCompleted: 0, onTimeDeliveryRate: 100 },
                      memberSince: new Date().toLocaleDateString()
                    }}
                    onClick={() => onServiceClick(service.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
