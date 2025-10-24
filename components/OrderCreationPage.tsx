import React, { useState, useEffect } from 'react';
import { Service, ServicePackage } from '../types';
import { supabase } from '../lib/supabase';
import PaymentModal from './PaymentModal';

interface OrderCreationPageProps {
  service: Service;
  packageId: string;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

const OrderCreationPage: React.FC<OrderCreationPageProps> = ({
  service,
  packageId,
  onBack,
  onSuccess
}) => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchPackage();
  }, [packageId]);

  const fetchPackage = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('service_packages')
      .select('*')
      .eq('id', packageId)
      .maybeSingle();

    if (data) {
      setSelectedPackage({
        id: data.id,
        serviceId: data.service_id,
        name: data.name,
        tier: data.tier,
        description: data.description,
        price: data.price,
        deliveryDays: data.delivery_days,
        revisions: data.revisions,
        features: data.features || [],
        isActive: data.is_active
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requirements.trim()) {
      setError('Veuillez fournir les détails de votre commande');
      return;
    }

    if (!selectedPackage) {
      setError('Package non trouvé');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase non configuré');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté');
      }

      const commission = Math.round(selectedPackage.price * 0.20);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + selectedPackage.deliveryDays);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: session.user.id,
          seller_id: service.sellerId || service.freelancerId,
          service_id: service.id,
          package_id: packageId,
          status: 'pending',
          amount: selectedPackage.price,
          commission: commission,
          delivery_date: deliveryDate.toISOString(),
          requirements: requirements
        })
        .select()
        .single();

      if (orderError) throw orderError;

      await supabase
        .from('order_messages')
        .insert({
          order_id: order.id,
          sender_id: session.user.id,
          message: requirements,
          is_system_message: false
        });

      await supabase
        .from('notifications')
        .insert({
          user_id: service.sellerId || service.freelancerId,
          type: 'new_order',
          title: 'Nouvelle commande en attente',
          message: `Une nouvelle commande pour "${service.title}" attend le paiement`,
          link: `/orders/${order.id}`
        });

      setCreatedOrderId(order.id);
      setShowPayment(true);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPackage) {
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Passer commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Détails de la commande</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Décrivez vos besoins en détail *
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={8}
                    placeholder="Expliquez précisément ce que vous attendez de ce service. Plus vous êtes détaillé, mieux le vendeur pourra répondre à vos attentes."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white py-4 rounded-lg hover:bg-teal-600 transition-colors font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Création en cours...' : `Procéder au paiement (${selectedPackage.price}€)`}
              </button>

              <p className="text-sm text-gray-400 text-center">
                En passant commande, vous acceptez nos conditions générales de vente. Le paiement sera conservé de manière sécurisée jusqu'à la livraison du service.
              </p>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Récapitulatif</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <img src={service.imageUrl} alt={service.title} className="w-full rounded-lg mb-3" />
                  <h4 className="text-white font-semibold mb-1">{service.title}</h4>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-400 text-sm mb-2">Package sélectionné</p>
                  <p className="text-white font-semibold">{selectedPackage.name}</p>
                </div>

                <div className="space-y-2">
                  {selectedPackage.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Livraison</span>
                    <span className="text-white">{selectedPackage.deliveryDays} jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Révisions</span>
                    <span className="text-white">{selectedPackage.revisions}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-teal-400">{selectedPackage.price}€</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Commission de service incluse (20%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {showPayment && createdOrderId && selectedPackage && (
          <PaymentModal
            orderId={createdOrderId}
            amount={selectedPackage.price}
            onSuccess={() => {
              setShowPayment(false);
              onSuccess(createdOrderId);
            }}
            onCancel={() => {
              setShowPayment(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderCreationPage;
