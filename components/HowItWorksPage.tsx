import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { SearchIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, ShieldCheckIcon } from './icons';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: SearchIcon,
      title: "1. Découvrez le service parfait",
      description: "Utilisez notre barre de recherche intuitive ou parcourez nos catégories pour trouver le freelance qui correspond exactement à vos besoins. Lisez les descriptions des services, consultez les portfolios et les avis des clients précédents pour faire un choix éclairé.",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "2. Collaborez en toute simplicité",
      description: "Une fois que vous avez passé commande, un espace de travail privé est créé. Vous pouvez y échanger des fichiers, donner vos instructions et suivre l'avancement de votre projet en temps réel. La communication est la clé d'un projet réussi.",
    },
    {
      icon: CheckBadgeIcon,
      title: "3. Révisez et validez la livraison",
      description: "Le vendeur vous livrera le travail final dans les délais convenus. Prenez le temps de l'examiner. Si tout est parfait, vous validez la commande. Si des ajustements sont nécessaires, vous pouvez demander des révisions.",
    },
    {
        icon: ShieldCheckIcon,
        title: "4. Paiement sécurisé",
        description: "Votre paiement est sécurisé dès le début de la commande. Les fonds ne sont transférés au vendeur qu'après votre validation finale. Votre satisfaction déclenche le paiement, garantissant une transaction juste et sans risque pour les deux parties.",
    }
  ];

  return (
    <InfoPageLayout
      title="Comment ça marche"
      subtitle="Un processus simple, transparent et sécurisé pour donner vie à vos projets en toute confiance."
    >
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gray-800 text-teal-400 border border-gray-700">
              <step.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
};

export default HowItWorksPage;