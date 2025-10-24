import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onAuthClick: () => void;
  isAuthenticated: boolean;
  isSeller: boolean;
  onLogout: () => void;
  onCreateServiceClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onAuthClick,
  isAuthenticated,
  isSeller,
  onLogout,
  onCreateServiceClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-white hover:text-teal-400 transition-colors"
          >
            MuslimUp
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('search')} className="text-gray-300 hover:text-white transition-colors">
              Explorer
            </button>
            <button onClick={() => onNavigate('how-it-works')} className="text-gray-300 hover:text-white transition-colors">
              Comment ça marche
            </button>

            {isAuthenticated ? (
              <>
                {isSeller && (
                  <>
                    <button onClick={() => onNavigate('dashboard')} className="text-gray-300 hover:text-white transition-colors">
                      Dashboard
                    </button>
                    <button
                      onClick={onCreateServiceClick}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Créer un service
                    </button>
                  </>
                )}
                {!isSeller && (
                  <button onClick={() => onNavigate('become-seller')} className="text-gray-300 hover:text-white transition-colors">
                    Devenir vendeur
                  </button>
                )}
                <button onClick={() => onNavigate('orders')} className="text-gray-300 hover:text-white transition-colors">
                  Commandes
                </button>
                <button onClick={() => onNavigate('messages')} className="text-gray-300 hover:text-white transition-colors">
                  Messages
                </button>
                <button onClick={() => onNavigate('profile')} className="text-gray-300 hover:text-white transition-colors">
                  Profil
                </button>
                <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('become-seller')} className="text-gray-300 hover:text-white transition-colors">
                  Devenir vendeur
                </button>
                <button
                  onClick={onAuthClick}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Connexion
                </button>
              </>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <button onClick={() => { onNavigate('search'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                Explorer
              </button>
              <button onClick={() => { onNavigate('how-it-works'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                Comment ça marche
              </button>
              {isAuthenticated ? (
                <>
                  {isSeller && (
                    <>
                      <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                        Dashboard
                      </button>
                      <button onClick={() => { onCreateServiceClick(); setIsMenuOpen(false); }} className="text-teal-400 hover:text-teal-300 transition-colors text-left">
                        Créer un service
                      </button>
                    </>
                  )}
                  {!isSeller && (
                    <button onClick={() => { onNavigate('become-seller'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                      Devenir vendeur
                    </button>
                  )}
                  <button onClick={() => { onNavigate('orders'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                    Commandes
                  </button>
                  <button onClick={() => { onNavigate('messages'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                    Messages
                  </button>
                  <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                    Profil
                  </button>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('become-seller'); setIsMenuOpen(false); }} className="text-gray-300 hover:text-white transition-colors text-left">
                    Devenir vendeur
                  </button>
                  <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="text-teal-400 hover:text-teal-300 transition-colors text-left">
                    Connexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
