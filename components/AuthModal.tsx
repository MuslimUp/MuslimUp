import React, { useState } from 'react';
import { XMarkIcon, MuslimUpLogoIcon, CheckBadgeIcon } from './icons';
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
  const [authState, setAuthState] = useState<'initial' | 'loading' | 'success'>('initial');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthState('loading');

    try {
      if (isSignUp) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: fullName,
              avatar_url: `https://picsum.photos/seed/${authData.user.id}/128/128`,
            });

          if (profileError) throw profileError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
      }

      setAuthState('success');
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setAuthState('initial');
    }
  };

  const renderContent = () => {
    switch (authState) {
        case 'loading':
            return (
                <div className="text-center py-16 transition-opacity duration-300">
                    <Spinner />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">Connexion en cours...</h3>
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
        case 'initial':
        default:
            return (
                <div className="transition-opacity duration-300">
                    <div className="text-center">
                        <MuslimUpLogoIcon className="h-16 w-16 mx-auto" />
                        <h2 className="mt-4 text-3xl font-bold text-gray-900">{isSignUp ? 'Créer un compte' : 'Connexion'}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isSignUp ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                className="ml-1 text-teal-600 hover:text-teal-700 font-semibold"
                            >
                                {isSignUp ? 'Se connecter' : 'Créer un compte'}
                            </button>
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleAuth}>
                        {isSignUp && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Votre nom"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="camille@exemple.com"
                                required
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
                                required
                                minLength={6}
                                className="mt-1 block w-full border border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 px-8 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                            {isSignUp ? 'Créer mon compte' : 'Se connecter'}
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

export default AuthModal;