import React from 'react';
import { UserCircleIcon } from './icons';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onAuthClick: () => void;
  isAuthenticated: boolean;
  isSeller: boolean;
  onLogout: () => void;
  onCreateServiceClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onAuthClick, isAuthenticated, isSeller, onLogout, onCreateServiceClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/60 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="text-3xl font-bold text-white focus:outline-none">
              Muslim<span className="text-teal-400">Up</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {isSeller ? (
                   <button
                      onClick={() => onNavigate('become-seller')}
                      className="hidden md:inline-block px-5 py-2.5 text-sm font-semibold text-teal-400 bg-transparent rounded-lg border border-teal-400 hover:bg-teal-400 hover:text-gray-900 transition-colors"
                    >
                      Devenir vendeur
                    </button>
                ) : (
                   <button
                      onClick={onCreateServiceClick}
                      className="hidden md:inline-block px-5 py-2.5 text-sm font-semibold text-gray-900 bg-teal-400 rounded-lg hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 transition-colors"
                    >
                      Créer un service
                    </button>
                )}
                <button 
                  onClick={() => { /* Gérer la navigation vers le tableau de bord */}} 
                  className="flex items-center space-x-2 text-base font-medium text-gray-300 hover:text-teal-400 transition-colors px-3 py-2"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="hidden sm:inline">Mon Compte</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('become-seller')}
                  className="hidden md:inline-block px-5 py-2.5 text-sm font-semibold text-teal-400 bg-transparent rounded-lg border border-teal-400 hover:bg-teal-400 hover:text-gray-900 transition-colors"
                >
                  Devenir vendeur
                </button>
                <button onClick={onAuthClick} className="hidden sm:inline-block text-base font-medium text-gray-300 hover:text-teal-400 transition-colors px-3 py-2">
                  Connexion
                </button>
                <button
                  onClick={onAuthClick}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-teal-400 rounded-lg hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 transition-colors"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;