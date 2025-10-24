import React from 'react';
import { Freelancer, Service } from '../types';
import { ArrowLeftIcon, StarIcon } from './icons';
import ServiceCard from './ServiceCard';
import FreelancerProfileCard from './FreelancerProfileCard';
import { REVIEWS } from '../constants'; 
import ReviewCard from './ReviewCard';

interface FreelancerDetailPageProps {
  freelancer: Freelancer;
  services: Service[];
  freelancersMap: Record<string, Freelancer>;
  onBack: () => void;
  onServiceClick: (serviceId: string) => void;
}

const FreelancerDetailPage: React.FC<FreelancerDetailPageProps> = ({ freelancer, services, freelancersMap, onBack, onServiceClick }) => {
  // Placeholder for freelancer-specific reviews
  const freelancerReviews = REVIEWS; 

  return (
    <div className="pt-24 bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-x-2 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-12">
              {/* Freelancer Header */}
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
                <img className="h-24 w-24 rounded-full" src={freelancer.avatarUrl} alt={freelancer.name} />
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-white">{freelancer.name}</h1>
                  <p className="mt-1 text-xl text-gray-300">{freelancer.title}</p>
                  <div className="mt-2 flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1.5 font-bold text-gray-100">{freelancer.rating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-400">({freelancer.reviewCount} avis)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">À propos de moi</h2>
                <div className="prose prose-invert prose-lg text-gray-300 whitespace-pre-line">
                  {freelancer.description}
                </div>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Mes services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              
              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Ce que disent les clients ({freelancer.reviewCount} avis)</h2>
                <div className="space-y-6">
                  {freelancerReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <FreelancerProfileCard freelancer={freelancer} onViewProfile={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetailPage;
