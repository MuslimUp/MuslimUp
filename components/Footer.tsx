import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon } from './icons';
import { CATEGORIES } from '../constants';

interface FooterProps {
  onCategoryClick: (categoryId: string) => void;
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onCategoryClick, onNavigate }) => {
  const muslimUpLinks = [
    { label: 'Comment ça marche', page: 'how-it-works' },
    { label: 'Nos valeurs', page: 'values' },
    { label: 'Devenir vendeur', page: 'become-seller' },
    { label: 'FAQ', page: 'faq' },
  ];
  const supportLinks = [
    { label: 'Confiance & Sécurité', page: 'trust-and-safety' },
  ];

  return (
    <footer className="bg-gray-950 text-white border-t border-white/10">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <button onClick={() => onNavigate('home')} className="text-3xl font-bold text-white text-left focus:outline-none">
              Muslim<span className="text-teal-400">Up</span>
            </button>
            <p className="mt-4 text-gray-400 text-sm">
              Connecter les talents, inspirer la communauté.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">Catégories</h3>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button onClick={() => onCategoryClick(cat.id)} className="text-base text-left text-gray-300 hover:text-teal-400 transition-colors">{cat.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-400">MuslimUp</h3>
            <ul className="mt-4 space-y-3">
              {muslimUpLinks.map(link => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-teal-400 transition-colors">{link.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">Support</h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map(link => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-base text-gray-300 hover:text-teal-400 transition-colors">{link.label}</button>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onNavigate('trust-and-safety')}
              className="mt-6 w-full text-center px-5 py-2.5 text-sm font-semibold text-teal-300 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-teal-400 transition-all duration-300">
              Centre d'aide
            </button>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 order-2 md:order-1 mt-4 md:mt-0">&copy; {new Date().getFullYear()} MuslimUp. Tous droits réservés.</p>
          <div className="flex space-x-6 order-1 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Facebook</span><FacebookIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Instagram</span><InstagramIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">LinkedIn</span><LinkedInIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;