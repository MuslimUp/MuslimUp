import React from 'react';
import { Service, Freelancer } from '../types';

interface ServiceDetailPageProps {
  service: Service;
  freelancer: Freelancer;
  onBack: () => void;
  onFreelancerClick: (id: string) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, freelancer, onBack, onFreelancerClick }) => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img src={service.imageUrl} alt={service.title} className="w-full rounded-xl mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">{service.title}</h1>
            <p className="text-gray-300 mb-6">{service.description}</p>

            {service.features && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Ce qui est inclus</h2>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-24">
              <div className="text-3xl font-bold text-teal-400 mb-6">{service.price}€</div>

              <button className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold mb-4">
                Commander maintenant
              </button>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => onFreelancerClick(freelancer.id)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img src={freelancer.avatarUrl} alt={freelancer.name} className="w-12 h-12 rounded-full" />
                  <div className="text-left">
                    <p className="text-white font-semibold">{freelancer.name}</p>
                    <p className="text-sm text-gray-400">{freelancer.title}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
