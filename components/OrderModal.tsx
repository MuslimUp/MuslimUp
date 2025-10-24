import React, { useState } from 'react';
import { XMarkIcon, CheckBadgeIcon } from './icons';
import { Service, Freelancer } from '../types';
import { supabase } from '../lib/supabase';

interface OrderModalProps {
  service: Service;
  freelancer: Freelancer;
  onClose: () => void;
  onOrderSuccess: () => void;
}

const Spinner: React.FC = () => (
  <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const OrderModal: React.FC<OrderModalProps> = ({ service, freelancer, onClose, onOrderSuccess }) => {
  const [orderState, setOrderState] = useState<'initial' | 'loading' | 'success'>('initial');
  const [requirements, setRequirements] = useState('');
  const [error, setError] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrderState('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté pour passer commande');
      }

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          service_id: service.id,
          buyer_id: session.user.id,
          seller_id: service.freelancerId,
          status: 'pending',
          price: service.price,
          delivery_date: deliveryDate.toISOString(),
          requirements: requirements,
        });

      if (orderError) throw orderError;

      await supabase
        .from('services')
        .update({ orders_in_queue: service.ordersInQueue + 1 })
        .eq('id', service.id);

      setOrderState('success');
      setTimeout(() => {
        onOrderSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la commande');
      setOrderState('initial');
    }
  };

  const renderContent = () => {
    switch (orderState) {
      case 'loading':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <Spinner />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Traitement de votre commande...</h3>
            <p className="text-gray-500">Veuillez patienter.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <CheckBadgeIcon className="h-20 w-20 text-teal-500 mx-auto animate-pulse" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Commande confirmée !</h3>
            <p className="text-gray-500">Le vendeur a été notifié et va commencer votre projet.</p>
          </div>
        );
      case 'initial':
      default:
        return (
          <div className="transition-opacity duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Commander ce service</h2>
              <p className="mt-2 text-gray-600">{service.title}</p>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Service proposé par</p>
                  <p className="font-semibold text-gray-900">{freelancer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="text-2xl font-bold text-gray-900">{service.price}€</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmitOrder}>
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Détails de votre projet
                </label>
                <textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  placeholder="Décrivez vos besoins, vos attentes, et toute information utile pour le vendeur..."
                  required
                  className="block w-full p-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 px-8 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 px-8 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Confirmer la commande
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              En commandant, vous acceptez nos conditions générales. Le paiement sera sécurisé par MuslimUp.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg p-8 bg-white rounded-2xl text-black shadow-2xl font-sans max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
          disabled={orderState !== 'initial'}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderModal;
