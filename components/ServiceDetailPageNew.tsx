import React, { useState, useEffect } from 'react';
import { Service, Freelancer, ServicePackage, Review } from '../types';
import { supabase } from '../lib/supabase';

interface ServiceDetailPageNewProps {
  service: Service;
  freelancer: Freelancer;
  onBack: () => void;
  onFreelancerClick: (id: string) => void;
  onOrderClick: (serviceId: string, packageId: string) => void;
}

const ServiceDetailPageNew: React.FC<ServiceDetailPageNewProps> = ({
  service,
  freelancer,
  onBack,
  onFreelancerClick,
  onOrderClick
}) => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPackagesAndReviews();
    checkFavorite();
  }, [service.id]);

  const fetchPackagesAndReviews = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: packagesData } = await supabase
        .from('service_packages')
        .select('*')
        .eq('service_id', service.id)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (packagesData) {
        const formattedPackages: ServicePackage[] = packagesData.map(p => ({
          id: p.id,
          serviceId: p.service_id,
          name: p.name,
          tier: p.tier,
          description: p.description,
          price: p.price,
          deliveryDays: p.delivery_days,
          revisions: p.revisions,
          features: p.features || [],
          isActive: p.is_active
        }));
        setPackages(formattedPackages);
        setSelectedPackage(formattedPackages[0] || null);
      }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_reviewer_id_fkey (name, avatar_url)
        `)
        .eq('service_id', service.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsData) {
        setReviews(reviewsData.map(r => ({
          id: r.id,
          orderId: r.order_id,
          serviceId: r.service_id,
          reviewerId: r.reviewer_id,
          sellerId: r.seller_id,
          rating: r.rating,
          comment: r.comment,
          response: r.response,
          createdAt: r.created_at,
          reviewerName: r.profiles?.name || 'Utilisateur',
          reviewerAvatar: r.profiles?.avatar_url || 'https://picsum.photos/128/128'
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('service_id', service.id)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Vous devez être connecté');
      return;
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('service_id', service.id);
      setIsFavorite(false);
    } else {
      await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          service_id: service.id
        });
      setIsFavorite(true);
    }
  };

  const tierColors = {
    basic: 'border-gray-500',
    standard: 'border-teal-500',
    premium: 'border-yellow-500'
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <img src={service.imageUrl} alt={service.title} className="w-full rounded-xl" />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <svg
                  className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-700'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{service.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => onFreelancerClick(freelancer.id)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img src={freelancer.avatarUrl} alt={freelancer.name} className="w-12 h-12 rounded-full" />
                <div className="text-left">
                  <p className="text-white font-semibold">{freelancer.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300">{freelancer.rating}</span>
                    <span className="text-gray-500">({freelancer.reviewCount})</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">À propos de ce service</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{service.description}</p>
            </div>

            {reviews.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">Avis clients ({service.reviewCount})</h2>
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-white/10 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-white font-semibold">{review.reviewerName}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                          {review.response && (
                            <div className="mt-3 pl-4 border-l-2 border-teal-500">
                              <p className="text-sm text-gray-400 mb-1">Réponse du vendeur :</p>
                              <p className="text-gray-300">{review.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Choisissez votre package</h3>

              <div className="space-y-3 mb-6">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedPackage?.id === pkg.id
                        ? `${tierColors[pkg.tier]} bg-white/10`
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">{pkg.name}</span>
                      <span className="text-teal-400 font-bold">{pkg.price}€</span>
                    </div>
                    <p className="text-sm text-gray-400">{pkg.deliveryDays} jours • {pkg.revisions} révision(s)</p>
                  </button>
                ))}
              </div>

              {selectedPackage && (
                <>
                  <div className="mb-6 space-y-2">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onOrderClick(service.id, selectedPackage.id)}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold mb-3"
                  >
                    Commander ({selectedPackage.price}€)
                  </button>

                  <button className="w-full bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-colors font-semibold">
                    Contacter le vendeur
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPageNew;
