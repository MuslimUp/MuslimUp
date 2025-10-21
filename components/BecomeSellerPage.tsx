import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { UserCircleIcon, MegaphoneIcon, CurrencyDollarIcon, UsersIcon, ShieldCheckIcon, SparklesIcon } from './icons';

interface BecomeSellerPageProps {
    onStartSelling: () => void;
}

const BecomeSellerPage: React.FC<BecomeSellerPageProps> = ({ onStartSelling }) => {
    const steps = [
        {
            icon: UserCircleIcon,
            title: "1. Créez votre profil",
            description: "Présentez-vous à la communauté. Mettez en avant vos compétences, votre expérience et ce qui vous rend unique.",
        },
        {
            icon: MegaphoneIcon,
            title: "2. Publiez votre service",
            description: "Décrivez clairement ce que vous proposez, fixez vos tarifs et ajoutez des images attractives pour attirer vos premiers clients.",
        },
        {
            icon: CurrencyDollarIcon,
            title: "3. Commencez à gagner",
            description: "Répondez aux demandes, livrez un travail de qualité et soyez payé en toute sécurité pour chaque commande terminée.",
        },
    ];

    const benefits = [
        {
            icon: UsersIcon,
            title: "Une communauté ciblée",
            description: "Accédez à des clients qui recherchent spécifiquement des talents partageant des valeurs communes.",
        },
        {
            icon: ShieldCheckIcon,
            title: "Paiements sécurisés",
            description: "Travaillez l'esprit tranquille. Nous sécurisons le paiement du client et vous le libérons une fois la commande validée.",
        },
        {
            icon: SparklesIcon,
            title: "Outils simples",
            description: "Notre plateforme est conçue pour être intuitive, vous permettant de vous concentrer sur ce que vous faites de mieux.",
        },
    ]

  return (
    <InfoPageLayout
      title="Vous avez un talent ? Partagez-le."
      subtitle="Rejoignez notre communauté de freelances musulmans et transformez vos compétences en une activité florissante."
    >
      <div className="text-center">
        <button
          onClick={onStartSelling}
          className="inline-block px-10 py-4 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
        >
          Commencer à vendre
        </button>
        <p className="mt-4 text-sm text-gray-400">L'inscription est gratuite et rapide.</p>
      </div>

      <div className="my-24">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {steps.map((step) => (
            <div key={step.title}>
              <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-gray-800 text-teal-400 border border-gray-700 mb-6">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="my-24 bg-gray-900/50 rounded-2xl p-12 border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Pourquoi vendre sur MuslimUp ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 text-teal-400 mt-1"><benefit.icon className="h-6 w-6" /></div>
              <div>
                <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Prêt à rejoindre l'aventure ?</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Inscrivez-vous aujourd'hui et commencez à proposer vos services à une communauté qui n'attend que vous.
        </p>
         <div className="mt-8">
            <button
              onClick={onStartSelling}
              className="inline-block px-10 py-4 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
            >
              Créer mon premier service
            </button>
        </div>
      </div>

    </InfoPageLayout>
  );
};

export default BecomeSellerPage;