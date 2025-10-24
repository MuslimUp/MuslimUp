import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PaymentModal: React.FC<PaymentModalProps> = ({
  orderId,
  amount,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    if (!supabase) {
      setError('Configuration Supabase manquante');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Vous devez être connecté');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount,
            orderId,
            metadata: {
              buyerId: session.user.id,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setClientSecret(data.clientSecret);

      const stripeInstance = await stripePromise;
      if (stripeInstance && data.clientSecret) {
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements({
          clientSecret: data.clientSecret,
        });
        setElements(elementsInstance);

        const paymentElement = elementsInstance.create('payment');
        paymentElement.mount('#payment-element');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'initialisation du paiement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Erreur lors du paiement');
        setLoading(false);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 rounded-xl p-8 max-w-lg w-full border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Paiement sécurisé</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300">Montant à payer</span>
            <span className="text-2xl font-bold text-teal-400">{amount}€</span>
          </div>
          <p className="text-sm text-gray-400">
            Vos fonds seront conservés en sécurité jusqu'à la livraison du service.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="payment-element" className="mb-6"></div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !stripe}
              className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Traitement...' : `Payer ${amount}€`}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Paiement sécurisé par Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
