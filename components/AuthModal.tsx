import React from 'react';
import { GoogleIcon, AppleIcon, FacebookIcon, XMarkIcon, MuslimUpLogoIcon } from './icons';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm p-8 bg-white rounded-2xl text-black shadow-2xl font-sans" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="text-center">
            <MuslimUpLogoIcon className="h-16 w-16 mx-auto" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenue !</h2>
        </div>

        <div className="mt-8 space-y-4">
            <SocialButton provider="Google" icon={GoogleIcon} />
            <SocialButton provider="Facebook" icon={FacebookIcon} />
            <SocialButton provider="Apple" icon={AppleIcon} />
        </div>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                <input 
                    type="email" 
                    id="email" 
                    placeholder="camille@exemple.com"
                    className="mt-1 block w-full border-gray-300 rounded-lg h-12 px-4 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <button 
                type="submit" 
                className="w-full h-12 px-8 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                Continuer avec mon adresse e-mail
            </button>
        </form>
      </div>
    </div>
  );
};

const SocialButton: React.FC<{provider: string, icon: React.FC<any>}> = ({ provider, icon: Icon }) => (
    <button className="w-full h-12 flex items-center justify-center px-4 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
        <Icon className="h-5 w-5 mr-3" />
        Continuer avec {provider}
    </button>
);

export default AuthModal;