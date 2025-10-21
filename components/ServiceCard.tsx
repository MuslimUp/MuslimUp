import React from 'react';
import { Service, Freelancer } from '../types';
import { StarIcon } from './icons';

interface ServiceCardProps {
  service: Service;
  freelancer: Freelancer;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, freelancer, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-300 hover:shadow-teal-400/20 hover:-translate-y-1.5 hover:border-white/20"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-md font-semibold text-white flex-1 leading-tight group-hover:text-teal-400 transition-colors">
          {service.title}
        </h3>
        <div className="flex items-center text-sm mt-2">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 font-bold text-gray-100">{service.rating.toFixed(1)}</span>
          <span className="ml-1.5 text-gray-400">({service.reviewCount} avis)</span>
        </div>
      </div>
      <div className="border-t border-white/10 p-4 flex items-center justify-between bg-black/10">
        <div className="flex items-center">
          <img className="h-8 w-8 rounded-full object-cover" src={freelancer.avatarUrl} alt={freelancer.name} />
          <p className="ml-2.5 text-sm font-medium text-gray-300">{freelancer.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Dès</p>
          <p className="text-lg font-bold text-white">{service.price}€</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;