import React, { useState, useEffect } from 'react';
import { Service, Order } from '../types';
import { supabase } from '../lib/supabase';

interface SellerDashboardPageProps {
  onCreateService: () => void;
  onEditService: (serviceId: string) => void;
  onViewOrders: () => void;
}

const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  onCreateService,
  onEditService,
  onViewOrders
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlyRevenue: 0,
    activeOrders: 0,
    completedOrders: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('seller_id', session.user.id)
        .order('created_at', { ascending: false });

      if (servicesData) {
        const servicesWithPrices = await Promise.all(
          servicesData.map(async (s) => {
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

        setServices(servicesWithPrices);
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', session.user.id);

      if (ordersData) {
        const completed = ordersData.filter(o => o.status === 'completed');
        const active = ordersData.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status));

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyOrders = completed.filter(o => {
          const orderDate = new Date(o.completed_at);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.amount - o.commission), 0);

        const totalSales = completed.reduce((sum, o) => sum + (o.amount - o.commission), 0);

        const { data: profile } = await supabase
          .from('profiles')
          .select('rating')
          .eq('id', session.user.id)
          .maybeSingle();

        setStats({
          totalSales,
          monthlyRevenue,
          activeOrders: active.length,
          completedOrders: completed.length,
          avgRating: profile?.rating || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    if (!supabase) return;

    try {
      await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard vendeur</h1>
          <button
            onClick={onCreateService}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold"
          >
            + Créer un service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Commandes actives</div>
            <div className="text-3xl font-bold text-white">{stats.activeOrders}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Commandes complétées</div>
            <div className="text-3xl font-bold text-white">{stats.completedOrders}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Revenus du mois</div>
            <div className="text-3xl font-bold text-teal-400">{stats.monthlyRevenue}€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Revenus totaux</div>
            <div className="text-3xl font-bold text-teal-400">{stats.totalSales}€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Note moyenne</div>
            <div className="text-3xl font-bold text-white">
              {stats.avgRating.toFixed(1)}★
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Mes services ({services.length})</h2>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Vous n'avez pas encore créé de service</p>
              <button
                onClick={onCreateService}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold"
              >
                Créer mon premier service
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map(service => (
                <div
                  key={service.id}
                  className="bg-white/5 rounded-lg p-4 flex items-center gap-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{service.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>{service.rating.toFixed(1)}</span>
                        <span>({service.reviewCount})</span>
                      </div>
                      <div>
                        {service.totalSales || 0} vente{(service.totalSales || 0) > 1 ? 's' : ''}
                      </div>
                      <div>
                        À partir de <span className="text-teal-400 font-semibold">{service.price}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}>
                      {service.isActive ? 'Actif' : 'Inactif'}
                    </div>

                    <button
                      onClick={() => toggleServiceStatus(service.id, service.isActive || false)}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {service.isActive ? 'Désactiver' : 'Activer'}
                    </button>

                    <button
                      onClick={() => onEditService(service.id)}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
