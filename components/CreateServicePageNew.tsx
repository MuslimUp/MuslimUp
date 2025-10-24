import React, { useState } from 'react';
import { Category, ServicePackage } from '../types';
import ServicePackageForm from './ServicePackageForm';
import { supabase } from '../lib/supabase';

interface CreateServicePageNewProps {
  categories: Category[];
  onBack: () => void;
  onSuccess: () => void;
}

const CreateServicePageNew: React.FC<CreateServicePageNewProps> = ({ categories, onBack, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [basicPackage, setBasicPackage] = useState<Partial<ServicePackage>>({});
  const [standardPackage, setStandardPackage] = useState<Partial<ServicePackage>>({});
  const [premiumPackage, setPremiumPackage] = useState<Partial<ServicePackage>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!basicPackage.price || basicPackage.price <= 0) {
      setError('Le package de base est obligatoire');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase non configuré');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté');
      }

      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      const categoryName = categories.find(c => c.id === categoryId)?.name || '';

      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert({
          seller_id: session.user.id,
          title,
          slug,
          description,
          category_id: categoryId,
          category: categoryName,
          image_url: imageUrl || 'https://picsum.photos/600/400',
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          rating: 0,
          review_count: 0,
          orders_in_queue: 0,
          total_sales: 0,
          is_active: true
        })
        .select()
        .single();

      if (serviceError) throw serviceError;

      const packagesToInsert = [];

      if (basicPackage.price && basicPackage.price > 0) {
        packagesToInsert.push({
          service_id: service.id,
          name: basicPackage.name || 'Basique',
          tier: 'basic',
          description: basicPackage.description || '',
          price: basicPackage.price,
          delivery_days: basicPackage.deliveryDays || 3,
          revisions: basicPackage.revisions || 1,
          features: basicPackage.features || [],
          is_active: true
        });
      }

      if (standardPackage.price && standardPackage.price > 0) {
        packagesToInsert.push({
          service_id: service.id,
          name: standardPackage.name || 'Standard',
          tier: 'standard',
          description: standardPackage.description || '',
          price: standardPackage.price,
          delivery_days: standardPackage.deliveryDays || 2,
          revisions: standardPackage.revisions || 2,
          features: standardPackage.features || [],
          is_active: true
        });
      }

      if (premiumPackage.price && premiumPackage.price > 0) {
        packagesToInsert.push({
          service_id: service.id,
          name: premiumPackage.name || 'Premium',
          tier: 'premium',
          description: premiumPackage.description || '',
          price: premiumPackage.price,
          delivery_days: premiumPackage.deliveryDays || 1,
          revisions: premiumPackage.revisions || 5,
          features: premiumPackage.features || [],
          is_active: true
        });
      }

      const { error: packagesError } = await supabase
        .from('service_packages')
        .insert(packagesToInsert);

      if (packagesError) throw packagesError;

      onSuccess();
    } catch (err: any) {
      console.error('Error creating service:', err);
      setError(err.message || 'Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Créer un nouveau service</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Informations générales</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Titre du service *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Je vais créer votre site web moderne avec React"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Décrivez votre service en détail..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de l'image</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, web, design"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-6">Packages de service</h2>
            <p className="text-gray-400 mb-6">Définissez au moins un package pour votre service</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServicePackageForm
                tier="basic"
                tierLabel="Package Basique"
                onPackageChange={setBasicPackage}
                initialData={basicPackage}
              />

              <ServicePackageForm
                tier="standard"
                tierLabel="Package Standard"
                onPackageChange={setStandardPackage}
                initialData={standardPackage}
              />

              <ServicePackageForm
                tier="premium"
                tierLabel="Package Premium"
                onPackageChange={setPremiumPackage}
                initialData={premiumPackage}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer le service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePageNew;
