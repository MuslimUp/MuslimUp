import React, { useState } from 'react';
import { Service, Freelancer } from '../types';
import { StarIcon, ArrowLeftIcon, CheckIcon } from './icons';
import TestimonialCard from './TestimonialCard';
import FreelancerProfileCard from './FreelancerProfileCard';
import { TESTIMONIALS } from '../constants';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../lib/supabase';

interface ServiceDetailPageProps {
  service: Service;
  freelancer: Freelancer;
  onBack: () => void;
  onFreelancerClick: (freelancerId: string) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, freelancer, onBack, onFreelancerClick }) => {
  const relatedTestimonial = TESTIMONIALS[0];
  const { createOrder } = useOrders();
  const [isOrdering, setIsOrdering] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [requirements, setRequirements] = useState('');

  const handleOrderClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Vous devez être connecté pour commander');
      return;
    }
    setShowOrderModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsOrdering(true);
    try {
      await createOrder(service.id, service.freelancerId, service.price, requirements);
      alert('Commande créée avec succès !');
      setShowOrderModal(false);
      setRequirements('');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création de la commande');
    } finally {
      setIsOrdering(false);
    }
  }; // Placeholder for related testimonial logic

  return (
    <div className="pt-24 bg-gray-900">
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
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">{service.title}</h1>
                <button 
                  onClick={() => onFreelancerClick(freelancer.id)}
                  className="mt-4 flex items-center group text-left"
                >
                  <img className="h-10 w-10 rounded-full group-hover:ring-2 group-hover:ring-teal-400 transition-all" src={freelancer.avatarUrl} alt={freelancer.name} />
                  <div className="ml-3">
                    <p className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{freelancer.name}</p>
                    <p className="text-sm text-gray-400">{freelancer.title}</p>
                  </div>
                </button>
              </div>

              <div className="h-96 overflow-hidden rounded-xl border border-white/10">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-white/5 text-center">
                  <div className="p-4">
                      <div className="flex items-center justify-center">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <p className="ml-2 text-lg font-bold text-white">{service.rating.toFixed(1)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">({service.reviewCount} avis)</p>
                  </div>
                  <div className="p-4">
                      <p className="text-lg font-bold text-white">{service.ordersInQueue}</p>
                      <p className="mt-1 text-sm text-gray-400">Commandes en cours</p>
                  </div>
                   <div className="p-4">
                      <p className="text-lg font-bold text-white">~{freelancer.stats.responseTime}h</p>
                      <p className="mt-1 text-sm text-gray-400">Temps de réponse</p>
                  </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">À propos de ce service</h2>
                <div className="prose prose-invert prose-lg text-gray-300 whitespace-pre-line">
                  {service.description}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Ce que disent les clients</h2>
                <TestimonialCard testimonial={relatedTestimonial} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-white">Service de base</h3>
                    <p className="text-3xl font-bold text-white">{service.price}€</p>
                  </div>
                </div>
                <div className="border-t border-white/10 p-6">
                    <ul className="space-y-3 text-sm">
                        {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <CheckIcon className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0"/>
                                <span className="text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-t border-white/10 p-6 space-y-4">
                  <button
                    onClick={handleOrderClick}
                    className="w-full h-12 px-8 bg-teal-500 text-gray-900 font-semibold rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
                  >
                    Commander
                  </button>
                  <button className="w-full h-12 px-8 bg-white/5 text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors">
                    Contacter le vendeur
                  </button>
                </div>
              </div>
              <FreelancerProfileCard freelancer={freelancer} onViewProfile={onFreelancerClick} />
            </div>
          </div>
        </div>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={() => setShowOrderModal(false)}>
          <div
            className="relative w-full max-w-lg p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Commander ce service</h2>
            <p className="text-gray-300 mb-6">
              Service: <span className="font-semibold">{service.title}</span>
            </p>
            <p className="text-gray-300 mb-6">
              Prix: <span className="font-semibold text-teal-400">{service.price}€</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Décrivez vos besoins (optionnel)
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                placeholder="Détails supplémentaires pour le vendeur..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConfirmOrder}
                disabled={isOrdering}
                className="flex-1 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isOrdering ? 'En cours...' : 'Confirmer la commande'}
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;