import React from 'react';
import { 
    CheckIcon,
    PlusIcon,
    TableCellsIcon,
    RectangleStackIcon,
    RocketLaunchIcon,
    ShoppingBagIcon,
    WalletIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    ArrowTopRightOnSquareIcon,
    // Fix: Add missing icon imports
    UserIcon,
    IdentificationIcon,
} from './icons';

const SidebarNavItem: React.FC<{
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    isActive?: boolean;
    isSubItem?: boolean;
}> = ({ icon: Icon, label, isActive = false, isSubItem = false }) => (
  <a href="#" className={`flex items-center gap-x-3 p-3 rounded-lg text-left transition-colors text-base font-normal ${
    isSubItem ? 'pl-11' : ''
  } ${
    isActive
      ? 'bg-yellow-300 text-gray-900 font-semibold'
      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
  }`}>
    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-gray-800' : 'text-gray-500'}`} />
    <span>{label}</span>
  </a>
);

const SidebarHeader: React.FC<{ label: string }> = ({ label }) => (
    <h3 className="px-3 pt-6 pb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
);

const RequirementItem: React.FC<{
    label: string;
    status: 'complete' | 'incomplete' | 'recommended';
    actionText?: string;
    progress?: string;
}> = ({ label, status, actionText, progress }) => {
  const isComplete = status === 'complete' || status === 'recommended';
  const Icon = isComplete ? CheckIcon : PlusIcon;

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      isComplete ? 'bg-gray-800/20 border-gray-800' : 'bg-transparent border-gray-800'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
          isComplete ? 'bg-gray-700' : 'bg-gray-700'
        }`}>
          <Icon className={`h-5 w-5 ${isComplete ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        <p className={`font-medium ${isComplete ? 'text-gray-400' : 'text-white'}`}>
          {status === 'recommended' && <span className="font-semibold text-gray-400">Recommandé - </span>}
          {label}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {progress && <span className="text-sm font-medium text-gray-400">{progress}</span>}
        {actionText && (
          <button className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors">
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

const ProgressSection: React.FC<{
    title: string;
    description: React.ReactNode;
    completed: number;
    total: number;
    requirements: React.ComponentProps<typeof RequirementItem>[];
}> = ({ title, description, completed, total, requirements }) => {
    const progressPercentage = (completed / total) * 100;
    
    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 sm:p-8">
            <div className="flex items-center gap-4">
                 <div className="flex items-center justify-center h-10 w-10 rounded-md bg-black border border-gray-700 text-white">
                    <PlusIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="flex-1 flex items-center gap-3 ml-auto">
                    <span className="text-sm font-mono text-gray-400">{completed}/{total}</span>
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-gray-400 max-w-2xl">{description}</p>
            <div className="mt-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Conditions requises</h4>
                <div className="space-y-3">
                    {requirements.map(req => <RequirementItem key={req.label} {...req} />)}
                </div>
            </div>
        </div>
    );
};


const SellerAccountPage: React.FC = () => {

    // Fix: Explicitly type the array to match component props
    const sellerRequirements: React.ComponentProps<typeof RequirementItem>[] = [
        { label: "Valider mon adresse e-mail", status: "incomplete", actionText: "Demander un lien de validation" },
        { label: "Choisir mon nom d'utilisateur", status: "complete" },
        { label: "Remplir la photo et description sur mon profil public", status: "incomplete", actionText: "Modifier" },
        { label: "Faire valider mes coordonnées par ComeUp", status: "incomplete", actionText: "Modifier" },
        { label: "Avoir suivi une formation de ComeUp", status: "recommended", actionText: "Voir" },
        { label: "Avoir lu la charte du vendeur", status: "recommended", actionText: "Voir" }
    ];

    // Fix: Explicitly type the array to match component props
    const verifiedSellerRequirements: React.ComponentProps<typeof RequirementItem>[] = [
        { label: "Obtenir le niveau vendeur", status: "incomplete" },
        { label: "Bénéficier de l'offre ComeUp Plus Premium", status: "incomplete", actionText: "Modifier" },
        { label: "Avoir terminé plus de 10 ventes sur ComeUp", status: "incomplete", progress: "0 / 10" },
        { label: "Avoir une photo de profil vérifiée par ComeUp", status: "incomplete", actionText: "Modifier" },
    ];

    return (
        <div className="bg-gray-950 min-h-screen pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-12">
                    <aside className="lg:col-span-1 xl:col-span-1 bg-gray-900 p-4 rounded-xl border border-gray-800 self-start sticky top-24">
                        <nav className="space-y-1">
                            <SidebarNavItem icon={TableCellsIcon} label="Tableau de bord" />
                            <SidebarNavItem icon={RectangleStackIcon} label="Services" />
                            <SidebarNavItem icon={RocketLaunchIcon} label="Services sponsorisés" />
                            <SidebarNavItem icon={ShoppingBagIcon} label="Commandes" />
                            <SidebarNavItem icon={WalletIcon} label="Portefeuille" />
                            <SidebarNavItem icon={DocumentTextIcon} label="Factures" />
                            <SidebarNavItem icon={AcademicCapIcon} label="Formations" />
                            <SidebarNavItem icon={ChatBubbleLeftRightIcon} label="Coaching" />
                            
                            <div className="!my-4 border-t border-gray-800"></div>
                            
                            <SidebarHeader label="Paramètres de vente" />
                            <SidebarNavItem icon={UserIcon} label="Mon compte vendeur" isActive={true} isSubItem={false} />
                            <SidebarNavItem icon={UserIcon} label="Mon profil public" isSubItem={true} />
                            <SidebarNavItem icon={IdentificationIcon} label="Mes coordonnées" isSubItem={true} />
                            
                            <div className="!my-4 border-t border-gray-800"></div>

                            <div className="bg-black rounded-lg p-3">
                                <SidebarNavItem icon={SparklesIcon} label="ComeUp Plus" />
                                <a href="#" className="flex items-center justify-between mt-2 pl-11 text-sm text-gray-300 hover:text-teal-400">
                                    Gérer mon offre
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                </a>
                            </div>

                        </nav>
                    </aside>

                    <main className="lg:col-span-3 xl:col-span-4 space-y-10">
                         <div>
                            <h1 className="text-3xl font-bold text-white">Mon compte vendeur</h1>
                            <p className="text-gray-400 mt-2 max-w-3xl">
                                Le niveau de votre compte vous permet d'accéder à différentes fonctionnalités sur MuslimUp. Pour obtenir le niveau désiré, il vous suffit de compléter toutes les conditions requises. Attention cependant : à tout moment, si une condition n'est plus remplie, celui-ci peut être invalidé. <a href="#" className="text-teal-400 font-medium underline">Plus d'informations</a>
                            </p>
                        </div>
                        
                        <ProgressSection
                            title="Vendeur"
                            completed={3}
                            total={6}
                            description="Il s'agit du niveau minimum nécessaire pour pouvoir créer des services sur MuslimUp, recevoir des commandes de la part de clients, ainsi que retirer vos gains."
                            requirements={sellerRequirements}
                        />

                        <ProgressSection
                            title="Vendeur vérifié"
                            completed={0}
                            total={4}
                            description={
                                <>
                                Si vous souhaitez devenir vendeur vérifié et afficher sur votre profil et vos services ce statut privilégié, il vous faut remplir plusieurs conditions supplémentaires. Ce niveau n'est pas obligatoire pour vendre. <a href="#" className="text-teal-400 font-medium underline">Plus d'informations</a>.
                                </>
                            }
                            requirements={verifiedSellerRequirements}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SellerAccountPage;
