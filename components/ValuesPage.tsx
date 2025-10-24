import React from 'react';

const ValuesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Nos valeurs</h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Transparence</h2>
            <p className="text-gray-300">
              Nous croyons en une communication claire et honnête entre clients et freelances. Pas de frais cachés, pas de surprises.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Qualité</h2>
            <p className="text-gray-300">
              Nous sélectionnons soigneusement nos freelances pour garantir un niveau de qualité élevé dans tous les services proposés.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Communauté</h2>
            <p className="text-gray-300">
              MuslimUp est plus qu'une plateforme, c'est une communauté qui partage des valeurs communes et s'entraide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesPage;
