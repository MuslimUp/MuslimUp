import React from 'react';
import InfoPageLayout from './InfoPageLayout';

interface HelpCenterPageProps {
  onNavigate: (page: string) => void;
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const helpCategories = [
    {
      title: 'Débuter sur MuslimUp',
      icon: '🚀',
      links: [
        { label: 'Comment créer un compte', id: 'create-account' },
        { label: 'Comment passer une commande', id: 'place-order' },
        { label: 'Comment contacter un vendeur', id: 'contact-seller' },
        { label: 'Comment rechercher un service', id: 'search-service' },
      ]
    },
    {
      title: 'Gestion de compte',
      icon: '👤',
      links: [
        { label: 'Modifier mon profil', id: 'edit-profile' },
        { label: 'Gérer mes notifications', id: 'manage-notifications' },
        { label: 'Sécurité et confidentialité', id: 'security' },
        { label: 'Supprimer mon compte', id: 'delete-account' },
      ]
    },
    {
      title: 'Commandes et paiements',
      icon: '💳',
      links: [
        { label: 'Modes de paiement acceptés', id: 'payment-methods' },
        { label: 'Suivre ma commande', id: 'track-order' },
        { label: 'Annuler une commande', id: 'cancel-order' },
        { label: 'Demander un remboursement', id: 'refund' },
      ]
    },
    {
      title: 'Devenir vendeur',
      icon: '💼',
      links: [
        { label: 'Comment créer un service', id: 'create-service' },
        { label: 'Tarifs et commissions', id: 'pricing' },
        { label: 'Gérer mes services', id: 'manage-services' },
        { label: 'Recevoir mes paiements', id: 'get-paid' },
      ]
    },
    {
      title: 'Problèmes et litiges',
      icon: '⚖️',
      links: [
        { label: 'Signaler un problème', id: 'report-issue' },
        { label: 'Résolution de litiges', id: 'dispute-resolution' },
        { label: 'Contacter le support', id: 'contact-support' },
        { label: 'Politiques de la plateforme', id: 'policies' },
      ]
    },
    {
      title: 'Sécurité',
      icon: '🔒',
      links: [
        { label: 'Confiance et sécurité', id: 'trust-safety', page: 'trust-and-safety' },
        { label: 'Signaler un contenu inapproprié', id: 'report-content' },
        { label: 'Prévention des arnaques', id: 'scam-prevention' },
        { label: 'Protection des données', id: 'data-protection' },
      ]
    }
  ];

  const handleLinkClick = (categoryId: string, page?: string) => {
    if (page) {
      onNavigate(page);
    }
  };

  return (
    <InfoPageLayout
      title="Centre d'aide"
      onNavigate={onNavigate}
    >
      <div className="mb-12">
        <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-2xl p-8 border border-teal-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Comment pouvons-nous vous aider ?</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              className="w-full px-6 py-4 bg-gray-900/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-teal-400 text-gray-900 font-semibold rounded-lg hover:bg-teal-300 transition-colors">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpCategories.map((category, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-teal-400/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">{category.icon}</span>
              <h3 className="text-lg font-bold text-white">{category.title}</h3>
            </div>
            <ul className="space-y-3">
              {category.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <button
                    onClick={() => handleLinkClick(link.id, link.page)}
                    className="text-gray-300 hover:text-teal-400 transition-colors text-left w-full flex items-center space-x-2 group"
                  >
                    <span className="text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl p-8 border border-teal-500/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Vous ne trouvez pas ce que vous cherchez ?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Notre équipe de support est disponible pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
          </p>
          <button className="px-8 py-4 bg-teal-400 text-gray-900 font-semibold rounded-xl hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 transition-all duration-300 shadow-lg shadow-teal-400/20">
            Contacter le support
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default HelpCenterPage;
