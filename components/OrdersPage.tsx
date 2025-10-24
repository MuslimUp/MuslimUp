import React, { useState, useEffect } from 'react';
import { useOrders, Order } from '../hooks/useOrders';
import { useProfiles } from '../hooks/useProfiles';
import { useServices } from '../hooks/useServices';

const OrdersPage: React.FC = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { profiles } = useProfiles();
  const { services } = useServices();
  const [filter, setFilter] = useState<'all' | 'buyer' | 'seller'>('all');

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500',
      delivered: 'bg-purple-500/20 text-purple-400 border-purple-500',
      completed: 'bg-green-500/20 text-green-400 border-green-500',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500',
      disputed: 'bg-orange-500/20 text-orange-400 border-orange-500',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500';
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'En attente',
      in_progress: 'En cours',
      delivered: 'Livré',
      completed: 'Terminé',
      cancelled: 'Annulé',
      disputed: 'Litige',
    };
    return texts[status] || status;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Mes Commandes</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('buyer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'buyer'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Achats
          </button>
          <button
            onClick={() => setFilter('seller')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'seller'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Ventes
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const service = services.find(s => s.id === order.service_id);
              const otherUser = profiles[order.buyer_id] || profiles[order.seller_id];

              return (
                <div
                  key={order.id}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {service?.title || 'Service'}
                          </h3>
                          <p className="text-gray-400">
                            {otherUser?.name || 'Utilisateur'}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500 text-sm">Prix</p>
                          <p className="text-white font-semibold">{order.price}€</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Date de commande</p>
                          <p className="text-white">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {order.requirements && (
                        <div className="mb-4">
                          <p className="text-gray-500 text-sm mb-1">Requis</p>
                          <p className="text-gray-300">{order.requirements}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          Voir les détails
                        </button>
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
