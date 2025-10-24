import React from 'react';

const TrustAndSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Confiance et sécurité</h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Protection des paiements</h2>
            <p className="text-gray-300">
              Vos paiements sont sécurisés et conservés jusqu'à la validation de votre commande. Vous ne payez que pour un travail bien fait.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Vérification des vendeurs</h2>
            <p className="text-gray-300">
              Tous nos freelances sont vérifiés pour garantir la qualité et la fiabilité des services proposés.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Support client</h2>
            <p className="text-gray-300">
              Notre équipe est disponible pour vous aider à résoudre tout problème ou litige rapidement et équitablement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustAndSafetyPage;
