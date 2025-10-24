import React from 'react';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Comment ça marche</h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Trouvez le service parfait</h2>
                <p className="text-gray-300">
                  Parcourez notre catalogue de services ou utilisez la recherche pour trouver exactement ce dont vous avez besoin.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Passez commande</h2>
                <p className="text-gray-300">
                  Sélectionnez votre forfait, fournissez les détails de votre projet et effectuez votre paiement en toute sécurité.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Recevez votre livraison</h2>
                <p className="text-gray-300">
                  Le freelance travaille sur votre projet et vous livre le résultat final. Validez quand vous êtes satisfait.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
