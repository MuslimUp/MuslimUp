import React from 'react';

const SellerAccountPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Compte vendeur</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Commandes en cours</div>
            <div className="text-3xl font-bold text-white">0</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Revenus du mois</div>
            <div className="text-3xl font-bold text-teal-400">0€</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Note moyenne</div>
            <div className="text-3xl font-bold text-white">-</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Mes services</h2>
          <p className="text-gray-400">Aucun service publié pour le moment</p>
        </div>
      </div>
    </div>
  );
};

export default SellerAccountPage;
