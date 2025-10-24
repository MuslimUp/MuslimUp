import React, { useState } from 'react';
import { SearchIcon, ChevronRightIcon } from './icons';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: { id: string; title: string }[];
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Démarrer sur MuslimUp',
    description: 'Tout ce qu\'il faut savoir pour bien commencer',
    icon: '🚀',
    articles: [
      { id: '1', title: 'Comment créer un compte ?' },
      { id: '2', title: 'Comment rechercher un service ?' },
      { id: '3', title: 'Qu\'est-ce que MuslimUp ?' },
      { id: '4', title: 'Comment fonctionne la plateforme ?' },
      { id: '5', title: 'Quels sont les frais de service ?' },
    ],
  },
  {
    id: 'buying',
    title: 'Acheter un service',
    description: 'Guides pour commander et gérer vos achats',
    icon: '🛒',
    articles: [
      { id: '6', title: 'Comment commander un service ?' },
      { id: '7', title: 'Comment payer en toute sécurité ?' },
      { id: '8', title: 'Quels modes de paiement sont acceptés ?' },
      { id: '9', title: 'Comment contacter un vendeur ?' },
      { id: '10', title: 'Que faire si je ne suis pas satisfait ?' },
      { id: '11', title: 'Comment demander une modification ?' },
    ],
  },
  {
    id: 'selling',
    title: 'Vendre ses services',
    description: 'Conseils pour créer et gérer vos services',
    icon: '💼',
    articles: [
      { id: '12', title: 'Comment devenir vendeur ?' },
      { id: '13', title: 'Comment créer une annonce efficace ?' },
      { id: '14', title: 'Comment fixer mes prix ?' },
      { id: '15', title: 'Comment gérer mes commandes ?' },
      { id: '16', title: 'Comment retirer mes gains ?' },
      { id: '17', title: 'Conseils pour réussir en tant que vendeur' },
    ],
  },
  {
    id: 'account',
    title: 'Mon compte',
    description: 'Gérer votre profil et vos paramètres',
    icon: '👤',
    articles: [
      { id: '18', title: 'Comment modifier mon profil ?' },
      { id: '19', title: 'Comment changer mon mot de passe ?' },
      { id: '20', title: 'Comment supprimer mon compte ?' },
      { id: '21', title: 'Gestion des notifications' },
      { id: '22', title: 'Paramètres de confidentialité' },
    ],
  },
  {
    id: 'payments',
    title: 'Paiements et facturation',
    description: 'Tout sur les transactions et la facturation',
    icon: '💳',
    articles: [
      { id: '23', title: 'Comment ajouter une carte bancaire ?' },
      { id: '24', title: 'Quand suis-je débité ?' },
      { id: '25', title: 'Comment obtenir une facture ?' },
      { id: '26', title: 'Problèmes de paiement' },
      { id: '27', title: 'Remboursements et litiges' },
    ],
  },
  {
    id: 'trust-safety',
    title: 'Confiance et sécurité',
    description: 'Protégez-vous et achetez en toute confiance',
    icon: '🛡️',
    articles: [
      { id: '28', title: 'Comment signaler un problème ?' },
      { id: '29', title: 'Conseils de sécurité pour les acheteurs' },
      { id: '30', title: 'Conseils de sécurité pour les vendeurs' },
      { id: '31', title: 'Règles de la communauté' },
      { id: '32', title: 'Politique de confidentialité' },
    ],
  },
  {
    id: 'reviews',
    title: 'Avis et notations',
    description: 'Comprendre le système d\'évaluation',
    icon: '⭐',
    articles: [
      { id: '33', title: 'Comment laisser un avis ?' },
      { id: '34', title: 'Comment répondre à un avis ?' },
      { id: '35', title: 'Puis-je modifier mon avis ?' },
      { id: '36', title: 'Signaler un avis inapproprié' },
    ],
  },
  {
    id: 'technical',
    title: 'Problèmes techniques',
    description: 'Résoudre les soucis techniques',
    icon: '⚙️',
    articles: [
      { id: '37', title: 'Problèmes de connexion' },
      { id: '38', title: 'Erreur lors du paiement' },
      { id: '39', title: 'Le site ne s\'affiche pas correctement' },
      { id: '40', title: 'Problèmes de téléchargement de fichiers' },
    ],
  },
];

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category =>
    searchQuery === '' ||
    category.articles.length > 0 ||
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Centre d'aide
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Comment pouvons-nous vous aider aujourd'hui ?
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans l'aide..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <ChevronRightIcon
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedCategory === category.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {category.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {category.description}
              </p>

              {expandedCategory === category.id && (
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {category.articles.map((article) => (
                    <button
                      key={article.id}
                      className="w-full text-left text-sm text-gray-300 hover:text-teal-400 transition-colors py-2 px-3 rounded hover:bg-white/5"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              )}

              {expandedCategory !== category.id && (
                <div className="text-sm text-teal-400 font-medium">
                  {category.articles.length} article{category.articles.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              Aucun résultat trouvé pour "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-gray-400 mb-8">
            Notre équipe de support est là pour vous aider
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 transition-colors">
            Contacter le support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
