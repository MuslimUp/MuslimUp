import React, { useState, useEffect } from 'react';
import { GoogleIcon, AppleIcon, FacebookIcon, XMarkIcon, MuslimUpLogoIcon, CheckBadgeIcon } from './icons';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [authState, setAuthState] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthState('success');
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    try {
      setAuthProvider('Google');
      setAuthState('loading');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthState('error');
      setErrorMessage(error.message || 'Erreur lors de la connexion avec Google');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    try {
      setAuthProvider('votre e-mail');
      setAuthState('loading');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthState('error');
      setErrorMessage(error.message || 'Erreur lors de la connexion');
    }
  };

  const renderContent = () => {
    switch (authState) {
        case 'loading':
            return (
                <div className="text-center py-16 transition-opacity duration-300">
                    <Spinner />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">Connexion avec {authProvider}...</h3>
                    <p className="text-gray-500">Veuillez patienter.</p>
                </div>
            );
        case 'success':
            return (
                <div className="text-center py-16 transition-opacity duration-300">
                    <CheckBadgeIcon className="h-20 w-20 text-teal-500 mx-auto animate-pulse" />
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">Connexion réussie !</h3>
                    <p className="text-gray-500">Bienvenue sur MuslimUp. Vous allez être redirigé.</p>
                </div>
            );
        case 'error':
            return (
                <div className="transition-opacity duration-300">
                    <div className="text-center">
                        <MuslimUpLogoIcon className="h-16 w-16 mx-auto" />
                        <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenue !</h2>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        <SocialButton provider="Google" icon={GoogleIcon} onClick={handleGoogleLogin} />
                        <SocialButton provider="Facebook" icon={FacebookIcon} onClick={() => {}} disabled />
                        <SocialButton provider="Apple" icon={AppleIcon} onClick={() => {}} disabled />
                    </div>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-sm text-gray-500">ou</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="camille@exemple.com"
                                className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 px-8 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                            Continuer avec mon adresse e-mail
                        </button>
                    </form>

                    <button
                        onClick={() => {
                            setAuthState('initial');
                            setErrorMessage('');
                        }}
                        className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
                        Réessayer
                    </button>
                </div>
            );
        case 'initial':
        default:
            return (
                <div className="transition-opacity duration-300">
                    <div className="text-center">
                        <MuslimUpLogoIcon className="h-16 w-16 mx-auto" />
                        <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenue !</h2>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    <div className="mt-8 space-y-4">
                        <SocialButton provider="Google" icon={GoogleIcon} onClick={handleGoogleLogin} />
                        <SocialButton provider="Facebook" icon={FacebookIcon} onClick={() => {}} disabled />
                        <SocialButton provider="Apple" icon={AppleIcon} onClick={() => {}} disabled />
                    </div>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-sm text-gray-500">ou</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="camille@exemple.com"
                                className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 px-8 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                            Continuer avec mon adresse e-mail
                        </button>
                    </form>
                </div>
            )
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm p-8 bg-white rounded-2xl text-black shadow-2xl font-sans" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors" disabled={authState !== 'initial'}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

interface SocialButtonProps {
    provider: string;
    icon: React.FC<any>;
    onClick: () => void;
    disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, icon: Icon, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full h-12 flex items-center justify-center px-4 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
    >
        <Icon className="h-5 w-5 mr-3" />
        Continuer avec {provider}
    </button>
);

export default AuthModal;