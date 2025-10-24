import React from 'react';

interface BecomeSellerPageProps {
  onStartSelling: () => void;
}

const BecomeSellerPage: React.FC<BecomeSellerPageProps> = ({ onStartSelling }) => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Devenez vendeur sur MuslimUp</h1>
          <p className="text-xl text-gray-300">
            Rejoignez notre communauté de freelances talentueux et développez votre activité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-teal-400 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">Développez votre activité</h3>
            <p className="text-gray-300">Accédez à une clientèle ciblée et fidèle</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-teal-400 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">Fixez vos prix</h3>
            <p className="text-gray-300">Vous contrôlez vos tarifs et vos offres</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-teal-400 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-white mb-2">Paiements sécurisés</h3>
            <p className="text-gray-300">Recevez vos paiements de manière sûre et rapide</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartSelling}
            className="px-8 py-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold text-lg"
          >
            Commencer à vendre
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;
