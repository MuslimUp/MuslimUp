import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!supabase) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      setProfile(profileData);

      const { data: buyerOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', session.user.id);

      const { data: sellerOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', session.user.id);

      const allOrders = [...(buyerOrders || []), ...(sellerOrders || [])];

      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('seller_id', session.user.id);

      setStats({
        totalOrders: allOrders.length,
        activeOrders: allOrders.filter(o => ['pending', 'in_progress'].includes(o.status)).length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
        totalServices: servicesData?.length || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-gray-400">
            Bienvenue {profile?.full_name || 'sur votre tableau de bord'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Commandes</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="bg-teal-500/20 p-3 rounded-lg">
                <svg className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">En cours</p>
                <p className="text-3xl font-bold text-white">{stats.activeOrders}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Terminées</p>
                <p className="text-3xl font-bold text-white">{stats.completedOrders}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Mes Services</p>
                <p className="text-3xl font-bold text-white">{stats.totalServices}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('orders')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
              >
                Voir mes commandes
              </button>
              <button
                onClick={() => onNavigate('messages')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
              >
                Mes messages
              </button>
              {profile?.is_seller && (
                <>
                  <button
                    onClick={() => onNavigate('seller-account')}
                    className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    Gérer mes services
                  </button>
                  <button
                    onClick={() => onNavigate('create-service')}
                    className="w-full text-left px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white font-semibold"
                  >
                    Créer un nouveau service
                  </button>
                </>
              )}
              {!profile?.is_seller && (
                <button
                  onClick={() => onNavigate('become-seller')}
                  className="w-full text-left px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white font-semibold"
                >
                  Devenir vendeur
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Informations du profil</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Nom complet</p>
                <p className="text-white font-medium">{profile?.full_name || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Type de compte</p>
                <p className="text-white font-medium">
                  {profile?.is_seller ? 'Vendeur' : 'Acheteur'}
                  {profile?.is_seller && profile?.seller_level && (
                    <span className="ml-2 text-teal-400">({profile.seller_level})</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Membre depuis</p>
                <p className="text-white font-medium">
                  {profile?.member_since
                    ? new Date(profile.member_since).toLocaleDateString('fr-FR')
                    : 'N/A'
                  }
                </p>
              </div>
              {profile?.is_seller && (
                <div>
                  <p className="text-gray-400 text-sm">Commandes complétées</p>
                  <p className="text-white font-medium">{profile?.orders_completed || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
