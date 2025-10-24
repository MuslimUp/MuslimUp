import React, { useState } from 'react';
import { UserIcon, IdentificationIcon, CheckBadgeIcon, PlusIcon, CheckIcon, XCircleIcon, BriefcaseIcon, RocketLaunchIcon, WalletIcon, DocumentTextIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, ArrowTopRightOnSquareIcon, ShoppingCartIcon, ChartBarIcon } from './icons';

type RequirementStatus = 'complete' | 'incomplete' | 'recommended';

interface Requirement {
    name: string;
    status: RequirementStatus;
    action?: 'validate' | 'modify' | 'view';
    actionText?: string;
    progress?: {
        current: number;
        total: number;
    };
}

const RequirementItem: React.FC<Requirement> = ({ name, status, action, progress, actionText }) => {
    const isComplete = status === 'complete' || status === 'recommended';
    
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg border ${isComplete ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex items-center">
                <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                    isComplete ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                    {isComplete ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </div>
                <p className={`ml-4 font-medium ${isComplete ? 'text-gray-300' : 'text-white'}`}>{name}</p>
            </div>
            <div className="flex items-center">
                {progress && (
                    <span className="text-sm text-gray-400 mr-4">{progress.current}/{progress.total}</span>
                )}
                {action && (
                    <button className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                        {actionText || action.charAt(0).toUpperCase() + action.slice(1)}
                    </button>
                )}
            </div>
        </div>
    );
}


const Sidebar: React.FC<{ activeItem: string, setActiveItem: (item: string) => void }> = ({ activeItem, setActiveItem }) => {
    
    const mainNavItems = [
      { name: 'Tableau de bord', icon: ChartBarIcon, href: '#dashboard' },
      { name: 'Services', icon: BriefcaseIcon, href: '#services' },
      { name: 'Services sponsorisés', icon: RocketLaunchIcon, href: '#sponsored' },
      { name: 'Commandes', icon: ShoppingCartIcon, href: '#orders' },
      { name: 'Portefeuille', icon: WalletIcon, href: '#wallet' },
      { name: 'Factures', icon: DocumentTextIcon, href: '#invoices' },
      { name: 'Formations', icon: AcademicCapIcon, href: '#training' },
      { name: 'Coaching', icon: ChatBubbleLeftRightIcon, href: '#coaching' },
    ];

    const settingsNavItems = [
      { name: 'Mon compte vendeur', href: '#account' },
      { name: 'Mon profil public', href: '#profile' },
      { name: 'Mes coordonnées', href: '#contact' },
    ];

    const muslimUpPlusItems = [
      { name: 'Gérer mon offre', href: '#offer', icon: ArrowTopRightOnSquareIcon },
    ];

    return (
        <div className="bg-gray-900 text-gray-300 rounded-lg p-4 space-y-4">
            {/* Main Navigation */}
            <div className="space-y-1">
                {mainNavItems.map((item) => (
                    <button
                        key={item.name}
                        className={`w-full text-left flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-gray-800 hover:text-white`}
                    >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        {item.name}
                    </button>
                ))}
            </div>
            
            {/* Settings Navigation */}
            <div className="pt-4 border-t border-gray-800">
                <div className="bg-black rounded-md mb-2">
                    <h3 className="w-full text-left flex items-center px-3 py-2.5 text-sm font-medium text-white">
                        Paramètres de vente
                    </h3>
                </div>
                <div className="space-y-1">
                    {settingsNavItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveItem(item.name)}
                            className={`w-full text-left flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                activeItem === item.name
                                    ? 'bg-teal-500 text-white'
                                    : 'hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* MuslimUp Plus Navigation */}
            <div className="pt-4">
                 <div className="bg-black rounded-md mb-2">
                    <h3 className="w-full text-left flex items-center px-3 py-2.5 text-sm font-medium text-white">
                        MuslimUp Plus
                    </h3>
                </div>
                <div className="mt-2 space-y-1">
                    {muslimUpPlusItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {}}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-gray-800 hover:text-white"
                        >
                            <span>{item.name}</span>
                            <item.icon className="h-4 w-4" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const SellerAccountPage: React.FC = () => {
    const [activeItem, setActiveItem] = useState('Mon compte vendeur');

    const sellerRequirements: Requirement[] = [
      { name: 'Valider mon adresse e-mail', status: 'incomplete', action: 'validate', actionText: 'Demander un lien de validation' },
      { name: 'Choisir mon nom d\'utilisateur', status: 'complete' },
      { name: 'Remplir la photo et description sur mon profil public', status: 'incomplete', action: 'modify', actionText: 'Modifier' },
      { name: 'Faire valider mes coordonnées par MuslimUp', status: 'incomplete', action: 'modify', actionText: 'Modifier' },
      { name: 'Recommandé - Avoir suivi une formation de MuslimUp', status: 'recommended', action: 'view', actionText: 'Voir' },
      { name: 'Recommandé - Avoir lu la charte du vendeur', status: 'recommended', action: 'view', actionText: 'Voir' },
    ];

    const verifiedSellerRequirements: Requirement[] = [
        { name: 'Obtenir le niveau vendeur', status: 'incomplete' },
        { name: 'Bénéficier de l\'offre MuslimUp Plus Premium', status: 'incomplete', action: 'modify', actionText: 'Modifier' },
        { name: 'Avoir terminé plus de 10 ventes sur MuslimUp', status: 'incomplete', progress: { current: 0, total: 10 } },
        { name: 'Avoir une photo de profil vérifiée par MuslimUp', status: 'incomplete', action: 'modify', actionText: 'Modifier' },
    ];


    const completedSellerTasks = sellerRequirements.filter(r => r.status === 'complete' || r.status === 'recommended').length;
    const completedVerifiedTasks = verifiedSellerRequirements.filter(r => r.status === 'complete').length;

    return (
        <div className="pt-24 bg-gray-950 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                       <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
                    </aside>
                    <main className="lg:col-span-3">
                        <div className="bg-gray-900 p-8 rounded-lg">
                            <h1 className="text-3xl font-bold text-white">Mon compte vendeur</h1>
                            <p className="mt-2 text-gray-400">
                                Le niveau de votre compte vous permet d'accéder à différentes fonctionnalités sur MuslimUp. Pour obtenir le niveau désiré, il vous suffit de compléter toutes les conditions requises. Attention cependant : à tout moment, si une condition n'est plus remplie, celui-ci peut être invalidé. <a href="#" className="text-teal-400 font-semibold hover:underline">Plus d'informations</a>
                            </p>

                            <section className="mt-10">
                                <div className="flex items-center justify-between p-4 rounded-t-lg bg-gray-800 border border-gray-700 border-b-0">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 text-white">
                                            <PlusIcon className="h-5 w-5" />
                                        </div>
                                        <h2 className="ml-4 text-xl font-bold text-white">Vendeur</h2>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-300">{completedSellerTasks}/{sellerRequirements.length}</span>
                                        <div className="w-24 h-2 bg-gray-700 rounded-full">
                                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${(completedSellerTasks / sellerRequirements.length) * 100}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-b-lg bg-gray-800/50 border border-gray-700 border-t-0">
                                    <p className="text-gray-400 mb-6">
                                        Il s'agit du niveau minimum nécessaire pour pouvoir créer des services sur MuslimUp, recevoir des commandes de la part de clients, ainsi que retirer vos gains.
                                    </p>
                                    <h3 className="font-semibold text-white mb-4">Conditions requises</h3>
                                    <div className="space-y-3">
                                        {sellerRequirements.map(req => <RequirementItem key={req.name} {...req} />)}
                                    </div>
                                </div>
                            </section>

                             <section className="mt-10">
                                <div className="flex items-center justify-between p-4 rounded-t-lg bg-gray-800 border border-gray-700 border-b-0">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 text-white">
                                            <PlusIcon className="h-5 w-5" />
                                        </div>
                                        <h2 className="ml-4 text-xl font-bold text-white">Vendeur vérifié</h2>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-300">{completedVerifiedTasks}/{verifiedSellerRequirements.length}</span>
                                        <div className="w-24 h-2 bg-gray-700 rounded-full">
                                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${(completedVerifiedTasks / verifiedSellerRequirements.length) * 100}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-b-lg bg-gray-800/50 border border-gray-700 border-t-0">
                                    <p className="text-gray-400 mb-6">
                                       Si vous souhaitez devenir vendeur vérifié et afficher sur votre profil et vos services ce statut privilégié, il vous faut remplir plusieurs conditions supplémentaires. Ce niveau n'est pas obligatoire pour vendre. <a href="#" className="text-teal-400 font-semibold hover:underline">Plus d'informations</a>.
                                    </p>
                                    <h3 className="font-semibold text-white mb-4">Conditions requises</h3>
                                    <div className="space-y-3">
                                        {verifiedSellerRequirements.map(req => <RequirementItem key={req.name} {...req} />)}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SellerAccountPage;