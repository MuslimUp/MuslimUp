import React from 'react';
import { Service, Freelancer } from '../types';

interface ServiceCardProps {
  service: Service;
  freelancer: Freelancer;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, freelancer, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer group border border-white/10"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={freelancer.avatarUrl}
            alt={freelancer.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-400">{freelancer.name}</span>
        </div>
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{service.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-300">{service.rating}</span>
            <span className="text-sm text-gray-500">({service.reviewCount})</span>
          </div>
          <span className="text-teal-400 font-bold">{service.price}€</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
