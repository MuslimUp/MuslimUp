import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { SparklesIcon, ScaleIcon, HeartIcon } from './icons';

const ValuesPage: React.FC = () => {
    const values = [
        {
            icon: SparklesIcon,
            name: 'Excellence (Ihsan)',
            description: "Nous encourageons nos freelances à viser l'excellence dans chaque projet, en fournissant un travail de haute qualité qui dépasse les attentes. Pour nous, le professionnalisme est une manifestation de notre foi.",
        },
        {
            icon: ScaleIcon,
            name: 'Intégrité (Amana)',
            description: "La confiance est le fondement de notre communauté. Nous promouvons des échanges honnêtes, une communication transparente et un respect scrupuleux des engagements, tant pour les acheteurs que pour les vendeurs.",
        },
        {
            icon: HeartIcon,
            name: 'Communauté (Oumma)',
            description: "MuslimUp est plus qu'une marketplace, c'est un lieu de rencontre et d'entraide. Nous cherchons à renforcer les liens au sein de la communauté en facilitant la collaboration et en célébrant les succès de chacun.",
        },
    ];

  return (
    <InfoPageLayout
      title="Nos Valeurs"
      subtitle="Les principes qui guident notre communauté et façonnent chaque interaction sur notre plateforme."
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {values.map((value) => (
                <div key={value.name} className="bg-white/5 p-8 rounded-xl border border-white/10">
                    <value.icon className="h-12 w-12 mx-auto text-teal-400 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">{value.name}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
            ))}
        </div>
    </InfoPageLayout>
  );
};

export default ValuesPage;