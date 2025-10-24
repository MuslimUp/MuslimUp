import React from 'react';
import { Freelancer, Service } from '../types';
import ServiceCard from './ServiceCard';

interface FreelancerDetailPageProps {
  freelancer: Freelancer;
  services: Service[];
  freelancersMap: Record<string, Freelancer>;
  onBack: () => void;
  onServiceClick: (id: string) => void;
}

const FreelancerDetailPage: React.FC<FreelancerDetailPageProps> = ({
  freelancer,
  services,
  freelancersMap,
  onBack,
  onServiceClick
}) => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={freelancer.avatarUrl} alt={freelancer.name} className="w-32 h-32 rounded-full" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{freelancer.name}</h1>
              <p className="text-xl text-teal-400 mb-4">{freelancer.title}</p>
              <p className="text-gray-300 mb-4">{freelancer.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <div className="text-sm text-gray-400">Note</div>
                  <div className="text-white font-semibold">{freelancer.rating} ⭐</div>
                </div>
                {freelancer.stats && (
                  <>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-sm text-gray-400">Commandes</div>
                      <div className="text-white font-semibold">{freelancer.stats.ordersCompleted}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <div className="text-sm text-gray-400">Réponse</div>
                      <div className="text-white font-semibold">{freelancer.stats.responseTime}h</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Services proposés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              freelancer={freelancersMap[service.freelancerId]}
              onClick={() => onServiceClick(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetailPage;
