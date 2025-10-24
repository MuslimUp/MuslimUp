import React, { useState, useEffect } from 'react';
import { Order, Service } from '../types';
import { supabase } from '../lib/supabase';

interface OrdersPageNewProps {
  onOrderClick: (orderId: string) => void;
}

const OrdersPageNew: React.FC<OrdersPageNewProps> = ({ onOrderClick }) => {
  const [orders, setOrders] = useState<(Order & { service?: Service; sellerName?: string; buyerName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
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

      setUserId(session.user.id);

      const query = supabase
        .from('orders')
        .select(`
          *,
          services (*),
          buyer:profiles!orders_buyer_id_fkey (name),
          seller:profiles!orders_seller_id_fkey (name)
        `)
        .order('created_at', { ascending: false });

      if (activeTab === 'buyer') {
        query.eq('buyer_id', session.user.id);
      } else {
        query.eq('seller_id', session.user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setOrders(data.map(o => ({
          id: o.id,
          buyerId: o.buyer_id,
          sellerId: o.seller_id,
          serviceId: o.service_id,
          packageId: o.package_id,
          status: o.status,
          amount: o.amount,
          commission: o.commission,
          deliveryDate: o.delivery_date,
          requirements: o.requirements,
          deliveryMessage: o.delivery_message,
          deliveryFiles: o.delivery_files,
          cancellationReason: o.cancellation_reason,
          completedAt: o.completed_at,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          service: o.services ? {
            id: o.services.id,
            freelancerId: o.services.seller_id,
            sellerId: o.services.seller_id,
            categoryId: o.services.category_id,
            category: o.services.category,
            title: o.services.title,
            slug: o.services.slug,
            imageUrl: o.services.image_url,
            rating: o.services.rating,
            reviewCount: o.services.review_count,
            price: 0,
            ordersInQueue: o.services.orders_in_queue,
            description: o.services.description
          } : undefined,
          sellerName: o.seller?.name || 'Vendeur',
          buyerName: o.buyer?.name || 'Acheteur'
        })));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      in_progress: { label: 'En cours', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      in_revision: { label: 'En révision', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
      delivered: { label: 'Livré', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
      completed: { label: 'Terminé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
      cancelled: { label: 'Annulé', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
      dispute: { label: 'Litige', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
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
        <h1 className="text-4xl font-bold text-white mb-8">Mes commandes</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'buyer'
                ? 'bg-teal-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Achats
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'seller'
                ? 'bg-teal-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Ventes
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-12 border border-white/10 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-lg">
              {activeTab === 'buyer' ? 'Aucun achat pour le moment' : 'Aucune vente pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => onOrderClick(order.id)}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {order.service && (
                    <img
                      src={order.service.imageUrl}
                      alt={order.service.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {order.service?.title || 'Service'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {activeTab === 'buyer' ? `Vendeur: ${order.sellerName}` : `Acheteur: ${order.buyerName}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-teal-400 font-bold text-lg">{order.amount}€</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4">
                      <div>
                        <span>Créée le:</span>
                        <span className="text-white ml-1">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {order.deliveryDate && (
                        <div>
                          <span>Livraison:</span>
                          <span className="text-white ml-1">
                            {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPageNew;
