import React from 'react';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Centre d'aide</h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Besoin d'aide ?</h2>
            <p className="text-gray-300 mb-6">
              Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans votre expérience sur MuslimUp.
            </p>
            <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold">
              Contacter le support
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Catégories d'aide</h3>
            {['Passer une commande', 'Gérer mon compte', 'Problèmes de paiement', 'Litiges', 'Créer un service', 'Gérer mes commandes'].map((category, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-white">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
