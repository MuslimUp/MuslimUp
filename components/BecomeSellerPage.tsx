import React, { useState } from 'react';
import { UsersIcon, ShieldCheckIcon, ChevronDownIcon, StarIcon, ScaleIcon, ClockIcon } from './icons';
import { FREELANCERS, SELLER_FAQ_ITEMS } from '../constants';
import { Freelancer } from '../types';

interface BecomeSellerPageProps {
    onStartSelling: () => void;
}

const FaqItem: React.FC<{ item: { q: string; a: string; }; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => (
  <div className="border-b border-gray-800">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left py-6 focus:outline-none"
    >
      <span className="text-lg font-semibold text-white">{item.q}</span>
      <ChevronDownIcon
        className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="pb-6 prose prose-invert prose-lg text-gray-300">
        <p>{item.a}</p>
      </div>
    </div>
  </div>
);

const SellerTestimonialCard: React.FC<{ freelancer: Freelancer }> = ({ freelancer }) => (
    <div className="flex flex-col h-full bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
        <div className="flex-grow">
            <StarIcon className="w-8 h-8 text-teal-400" />
            <blockquote className="mt-4 text-lg text-gray-300">
                <p>"{freelancer.sellerTestimonial}"</p>
            </blockquote>
        </div>
        <footer className="mt-6 flex items-center gap-4">
            <img className="h-14 w-14 rounded-full object-cover" src={freelancer.avatarUrl} alt={freelancer.name} />
            <div>
                <div className="font-bold text-white">{freelancer.name}</div>
                <div className="text-gray-400">{freelancer.title}</div>
            </div>
        </footer>
    </div>
);

const BecomeSellerPage: React.FC<BecomeSellerPageProps> = ({ onStartSelling }) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const benefits = [
        {
            icon: ScaleIcon,
            title: "Commission simple de 20%",
            description: "Nous prélevons une commission de 20% sur chaque vente. C'est clair, transparent et nous ne gagnons que lorsque vous gagnez.",
        },
        {
            icon: ClockIcon,
            title: "Flexibilité totale",
            description: "Soyez votre propre patron. Travaillez d'où et quand vous voulez. Vous avez la liberté de vendre selon votre propre emploi du temps.",
        },
        {
            icon: ShieldCheckIcon,
            title: "Paiements sécurisés & rapides",
            description: "Le paiement est sécurisé à la commande. Une fois le travail validé, retirez vos gains quand vous le souhaitez, en toute simplicité.",
        },
        {
            icon: UsersIcon,
            title: "Une communauté de confiance",
            description: "Accédez à des clients qui recherchent des talents partageant des valeurs communes d'éthique et d'excellence.",
        },
    ];

    const featuredSellers = FREELANCERS.filter(f => f.sellerTestimonial).slice(0, 3);

    return (
        <div className="bg-gray-900 text-white pt-20">
            {/* Hero Section */}
            <section className="bg-gray-950 pt-20 pb-24 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
                        Vous avez un talent. <br/>Maintenant, vous avez une <span className="text-teal-400">communauté</span>.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                        Rejoignez la première marketplace pour freelances musulmans et transformez vos compétences en une activité florissante, basée sur des valeurs partagées.
                    </p>
                    <div className="mt-10">
                        <button
                          onClick={onStartSelling}
                          className="inline-block px-10 py-4 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
                        >
                          Commencer à vendre
                        </button>
                        <p className="mt-4 text-sm text-gray-400">L'inscription est gratuite. Pas de frais cachés.</p>
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            <section className="py-24 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold">Pourquoi vendre sur MuslimUp ?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                            Nous avons créé un environnement où vous pouvez non seulement travailler, mais aussi vous épanouir.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {benefits.map((benefit) => (
                            <div key={benefit.title}>
                                <div className="flex items-center justify-center h-14 w-14 mx-auto rounded-xl bg-gray-800 text-teal-400 border border-gray-700">
                                    <benefit.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-center">{benefit.title}</h3>
                                <p className="mt-2 text-gray-400 text-center">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seller Testimonials */}
             <section className="py-24 bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold">Ils ont réussi sur MuslimUp</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                            Découvrez les histoires de freelances qui, comme vous, ont trouvé le succès au sein de notre communauté.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {featuredSellers.map(freelancer => (
                           <SellerTestimonialCard key={freelancer.id} freelancer={freelancer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold">Vos questions, nos réponses</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Tout ce que vous devez savoir pour démarrer votre activité sur MuslimUp en toute sérénité.
                        </p>
                    </div>
                    <div className="mt-12">
                        {SELLER_FAQ_ITEMS.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                isOpen={openFaqIndex === index}
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="bg-teal-500">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Prêt à rejoindre l'aventure ?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-900">
                       Votre prochaine commande est à portée de clic. Créez votre profil de vendeur dès aujourd'hui.
                    </p>
                    <div className="mt-10">
                        <button
                            onClick={onStartSelling}
                            className="inline-block px-10 py-4 text-lg font-semibold text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-gray-900 transition-all duration-300 transform hover:scale-105"
                        >
                            Créer mon premier service
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeSellerPage;