import React from 'react';
import { Freelancer } from '../types';
import { StarIcon, ClockIcon, ArchiveBoxIcon, CheckBadgeIcon, CalendarDaysIcon } from './icons';

interface FreelancerProfileCardProps {
  freelancer: Freelancer;
  onViewProfile: (freelancerId: string) => void;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({ freelancer, onViewProfile }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center">
          <img className="h-16 w-16 rounded-full" src={freelancer.avatarUrl} alt={freelancer.name} />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-white">{freelancer.name}</h3>
            <span className="text-sm font-semibold text-teal-400">{freelancer.level}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-300">{freelancer.description}</p>
        <button className="mt-4 w-full h-11 px-6 bg-white/5 text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors">
          Contacter
        </button>
      </div>
      <div className="border-t border-white/10 p-6">
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between items-center">
            <span className="flex items-center text-gray-400">
              <StarIcon className="h-4 w-4 mr-2.5" />
              Note moyenne
            </span>
            <span className="font-semibold text-white flex items-center">
              {freelancer.rating.toFixed(1)}
              <span className="text-gray-400 ml-1">({freelancer.reviewCount} avis)</span>
            </span>
          </li>
           <li className="flex justify-between items-center">
            <span className="flex items-center text-gray-400">
              <ClockIcon className="h-4 w-4 mr-2.5" />
              Temps de réponse
            </span>
            <span className="font-semibold text-white">~ {freelancer.stats.responseTime}h</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center text-gray-400">
              <ArchiveBoxIcon className="h-4 w-4 mr-2.5" />
              Commandes terminées
            </span>
            <span className="font-semibold text-white">{freelancer.stats.ordersCompleted}+</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center text-gray-400">
              <CheckBadgeIcon className="h-4 w-4 mr-2.5" />
              Respect des délais
            </span>
            <span className="font-semibold text-white">{freelancer.stats.onTimeDeliveryRate}%</span>
          </li>
        </ul>
      </div>
       <div className="border-t border-white/10 p-6">
         <div className="flex justify-between items-center text-sm">
             <span className="flex items-center text-gray-400">
                <CalendarDaysIcon className="h-4 w-4 mr-2.5" />
                Membre depuis
             </span>
             <span className="font-semibold text-white">{freelancer.memberSince}</span>
         </div>
          <button 
            onClick={() => onViewProfile(freelancer.id)} 
            className="mt-4 block w-full text-center text-sm font-semibold text-teal-400 hover:text-teal-300"
          >
            Voir le profil complet
          </button>
       </div>
    </div>
  );
};

export default FreelancerProfileCard;