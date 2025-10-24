import React from 'react';

interface FooterProps {
  onCategoryClick: () => void;
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-950 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">MuslimUp</h3>
            <p className="text-gray-400">
              La marketplace des freelances musulmans
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">À propos</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="text-gray-400 hover:text-white transition-colors">
                  Comment ça marche
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('values')} className="text-gray-400 hover:text-white transition-colors">
                  Nos valeurs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Vendeurs</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('become-seller')} className="text-gray-400 hover:text-white transition-colors">
                  Devenir vendeur
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('faq')} className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trust-and-safety')} className="text-gray-400 hover:text-white transition-colors">
                  Confiance et sécurité
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('help-center')} className="text-gray-400 hover:text-white transition-colors">
                  Centre d'aide
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2024 MuslimUp. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
