import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { ShieldCheckIcon, CheckBadgeIcon, StarIcon, UsersIcon } from './icons';

const TrustAndSafetyPage: React.FC = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Paiement 100% Sécurisé',
      description: 'Votre paiement est détenu par MuslimUp dès la commande et n\'est versé au vendeur qu\'après votre validation. Cela garantit que le travail est effectué à votre satisfaction avant que l\'argent ne soit débloqué.',
    },
    {
      icon: CheckBadgeIcon,
      title: 'Vendeurs Vérifiés',
      description: 'Nous mettons en avant les vendeurs qui ont prouvé leur fiabilité et la qualité de leur travail. Recherchez les badges "Vendeur Vérifié" et "Top Vendeur" pour collaborer avec les meilleurs talents de la plateforme.',
    },
    {
      icon: StarIcon,
      title: 'Système d\'avis transparent',
      description: 'Après chaque commande, les acheteurs peuvent laisser un avis honnête sur leur expérience. Ce système de notation aide la communauté à choisir les freelances les plus compétents et les plus professionnels.',
    },
    {
      icon: UsersIcon,
      title: 'Support client réactif',
      description: 'En cas de désaccord ou de problème, notre équipe de support est disponible pour intervenir et trouver une solution juste et rapide. Nous sommes là pour assurer une expérience positive pour tous.',
    },
  ];

  return (
    <InfoPageLayout
      title="Confiance & Sécurité"
      subtitle="Votre tranquillité d'esprit est notre priorité. Découvrez les mesures que nous prenons pour garantir des transactions sûres et fiables."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 flex items-start gap-6">
            <div className="flex-shrink-0 text-teal-400">
                <feature.icon className="h-10 w-10" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
};

export default TrustAndSafetyPage;