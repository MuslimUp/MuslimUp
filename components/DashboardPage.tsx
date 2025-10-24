import React from 'react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('profile')}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-teal-400 text-3xl mb-3">👤</div>
            <h3 className="text-xl font-bold text-white mb-2">Mon profil</h3>
            <p className="text-gray-400">Gérer vos informations personnelles</p>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-teal-400 text-3xl mb-3">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Mes commandes</h3>
            <p className="text-gray-400">Suivre vos commandes en cours</p>
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-teal-400 text-3xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">Messages</h3>
            <p className="text-gray-400">Communiquer avec vos clients</p>
          </button>

          <button
            onClick={() => onNavigate('seller-account')}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <div className="text-teal-400 text-3xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold text-white mb-2">Compte vendeur</h3>
            <p className="text-gray-400">Gérer vos services et statistiques</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
