import React from 'react';
import { Freelancer } from '../types';
import { StarIcon } from './icons';

interface FreelancerCardProps {
  freelancer: Freelancer;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
  return (
    <div className="group relative flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <a href="#" className="absolute inset-0 z-10" aria-label={`Voir le profil de ${freelancer.name}`}></a>
      <img
        className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-gray-100 group-hover:ring-teal-500 transition-all"
        src={freelancer.avatarUrl}
        alt={`Avatar de ${freelancer.name}`}
      />
      <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
      <p className="text-sm text-teal-600 font-medium">{freelancer.title}</p>
      <div className="mt-3 flex items-center justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="text-xs text-gray-500">(+100 avis)</span>
      </div>
    </div>
  );
};

export default FreelancerCard;
