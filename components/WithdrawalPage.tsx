import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  paymentMethod: string;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

interface SellerBalance {
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  availableBalance: number;
}

const WithdrawalPage: React.FC = () => {
  const [balance, setBalance] = useState<SellerBalance>({ totalEarned: 0, totalWithdrawn: 0, pendingWithdrawals: 0, availableBalance: 0 });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'paypal'>('bank_transfer');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [bankHolder, setBankHolder] = useState('');
  const [bankIban, setBankIban] = useState('');
  const [bankBic, setBankBic] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

      const { data: balanceData } = await supabase.rpc('calculate_seller_balance', {
        seller_uuid: session.user.id
      });

      if (balanceData) {
        setBalance({
          totalEarned: balanceData.total_earned || 0,
          totalWithdrawn: balanceData.total_withdrawn || 0,
          pendingWithdrawals: balanceData.pending_withdrawals || 0,
          availableBalance: balanceData.available_balance || 0
        });
      }

      const { data: withdrawalsData } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('seller_id', session.user.id)
        .order('created_at', { ascending: false });

      if (withdrawalsData) {
        setWithdrawals(withdrawalsData.map(w => ({
          id: w.id,
          amount: w.amount,
          status: w.status,
          paymentMethod: w.payment_method,
          rejectionReason: w.rejection_reason,
          createdAt: w.created_at,
          processedAt: w.processed_at
        })));
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('bank_account_holder, bank_iban, bank_bic')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setBankHolder(profile.bank_account_holder || '');
        setBankIban(profile.bank_iban || '');
        setBankBic(profile.bank_bic || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseInt(withdrawAmount);
    if (!amount || amount < 50) {
      setError('Le montant minimum de retrait est de 50€');
      return;
    }

    if (amount > balance.availableBalance) {
      setError('Montant supérieur au solde disponible');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (!supabase) throw new Error('Supabase non configuré');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non connecté');

      const paymentDetails = paymentMethod === 'bank_transfer'
        ? { holder: bankHolder, iban: bankIban, bic: bankBic }
        : { email: paypalEmail };

      if (paymentMethod === 'bank_transfer' && (!bankHolder || !bankIban)) {
        setError('Veuillez remplir vos informations bancaires');
        setSubmitting(false);
        return;
      }

      if (paymentMethod === 'bank_transfer') {
        await supabase
          .from('profiles')
          .update({
            bank_account_holder: bankHolder,
            bank_iban: bankIban,
            bank_bic: bankBic
          })
          .eq('id', session.user.id);
      }

      const { error: withdrawError } = await supabase
        .from('withdrawals')
        .insert({
          seller_id: session.user.id,
          amount,
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          status: 'pending'
        });

      if (withdrawError) throw withdrawError;

      setShowWithdrawForm(false);
      setWithdrawAmount('');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande de retrait');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      processing: { label: 'En traitement', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      completed: { label: 'Complété', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
      rejected: { label: 'Rejeté', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
        {statusConfig.label}
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-8">Mes retraits</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Gains totaux</div>
            <div className="text-3xl font-bold text-white">{balance.totalEarned}€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Retraits effectués</div>
            <div className="text-3xl font-bold text-white">{balance.totalWithdrawn}€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">En attente</div>
            <div className="text-3xl font-bold text-yellow-400">{balance.pendingWithdrawals}€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Solde disponible</div>
            <div className="text-3xl font-bold text-teal-400">{balance.availableBalance}€</div>
          </div>
        </div>

        {balance.availableBalance >= 50 && (
          <div className="bg-teal-500/10 border border-teal-500 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Demander un retrait</h3>
                <p className="text-teal-300">Vous pouvez retirer {balance.availableBalance}€ (minimum 50€)</p>
              </div>
              <button
                onClick={() => setShowWithdrawForm(true)}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold"
              >
                Retirer mes gains
              </button>
            </div>
          </div>
        )}

        {balance.availableBalance < 50 && balance.availableBalance > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <p className="text-gray-400">
              Solde minimum requis pour un retrait : 50€ (Solde actuel : {balance.availableBalance}€)
            </p>
          </div>
        )}

        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Historique des retraits</h2>

          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aucun retrait pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map(withdrawal => (
                <div key={withdrawal.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-white">{withdrawal.amount}€</span>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Demandé le {new Date(withdrawal.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {withdrawal.processedAt && (
                        <div className="text-sm text-gray-400">
                          Traité le {new Date(withdrawal.processedAt).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {withdrawal.rejectionReason && (
                        <div className="mt-2 text-sm text-red-400">
                          Raison: {withdrawal.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                      {withdrawal.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showWithdrawForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Demande de retrait</h2>
                <button onClick={() => setShowWithdrawForm(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Montant (minimum 50€)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="50"
                    max={balance.availableBalance}
                    placeholder="Montant à retirer"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Disponible: {balance.availableBalance}€
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Méthode de paiement</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Titulaire du compte</label>
                      <input
                        type="text"
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">IBAN</label>
                      <input
                        type="text"
                        value={bankIban}
                        onChange={(e) => setBankIban(e.target.value)}
                        placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">BIC/SWIFT (optionnel)</label>
                      <input
                        type="text"
                        value={bankBic}
                        onChange={(e) => setBankBic(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email PayPal</label>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Envoi en cours...' : 'Confirmer la demande'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPage;
