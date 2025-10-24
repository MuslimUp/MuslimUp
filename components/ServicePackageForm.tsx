import React, { useState } from 'react';
import { ServicePackage } from '../types';

interface ServicePackageFormProps {
  tier: 'basic' | 'standard' | 'premium';
  tierLabel: string;
  onPackageChange: (packageData: Partial<ServicePackage>) => void;
  initialData?: Partial<ServicePackage>;
}

const ServicePackageForm: React.FC<ServicePackageFormProps> = ({
  tier,
  tierLabel,
  onPackageChange,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [deliveryDays, setDeliveryDays] = useState(initialData?.deliveryDays?.toString() || '');
  const [revisions, setRevisions] = useState(initialData?.revisions?.toString() || '1');
  const [features, setFeatures] = useState(initialData?.features?.join('\n') || '');

  const handleUpdate = () => {
    onPackageChange({
      tier,
      name,
      description,
      price: parseInt(price) || 0,
      deliveryDays: parseInt(deliveryDays) || 0,
      revisions: parseInt(revisions) || 1,
      features: features.split('\n').filter(f => f.trim()),
      isActive: true
    });
  };

  React.useEffect(() => {
    handleUpdate();
  }, [name, description, price, deliveryDays, revisions, features]);

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">{tierLabel}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nom du package</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Ex: ${tierLabel}`}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Description courte du package"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prix (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Livraison (jours)</label>
            <input
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              min="1"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Révisions</label>
            <input
              type="number"
              value={revisions}
              onChange={(e) => setRevisions(e.target.value)}
              min="0"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fonctionnalités incluses (une par ligne)
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            rows={4}
            placeholder="Ex: Design responsive&#10;3 pages incluses&#10;SEO de base"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicePackageForm;
