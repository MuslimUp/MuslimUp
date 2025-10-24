import React, { useState } from 'react';
import { Category, Service } from '../types';
import { ArrowLeftIcon, PlusCircleIcon, XMarkIcon } from './icons';

interface CreateServicePageProps {
  categories: Category[];
  onServiceCreate: (serviceData: Omit<Service, 'id' | 'freelancerId' | 'rating' | 'reviewCount' | 'ordersInQueue'>) => void;
  onBack: () => void;
}

const CreateServicePage: React.FC<CreateServicePageProps> = ({ categories, onServiceCreate, onBack }) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [features, setFeatures] = useState<string[]>(['']);

    const handleAddFeature = () => {
        if (features.length < 10) {
            setFeatures([...features, '']);
        }
    };

    const handleRemoveFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index));
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onServiceCreate({
            title,
            categoryId,
            description,
            imageUrl,
            price: Number(price),
            features: features.filter(f => f.trim() !== ''),
        });
    };

    return (
        <div className="pt-24 bg-gray-950 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={onBack}
                    className="mb-8 inline-flex items-center gap-x-2 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Retour
                </button>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Créer un nouveau service</h1>
                    <p className="mt-2 text-lg text-gray-400">Décrivez le service que vous souhaitez proposer à la communauté.</p>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                        <div className="p-8 bg-gray-900 rounded-xl border border-gray-800 space-y-6">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Titre du service</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full h-12 px-4 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="Ex: Je vais créer votre logo professionnel" required />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="block w-full h-12 px-4 border border-white/10 rounded-lg bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" required>
                                    <option value="" disabled>Choisir une catégorie</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="block w-full p-4 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="Décrivez en détail votre service, ce qui est inclus, et pourquoi un client devrait vous choisir." required></textarea>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-900 rounded-xl border border-gray-800 space-y-6">
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">URL de l'image de présentation</label>
                                <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="block w-full h-12 px-4 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="https://exemple.com/image.jpg" required />
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Prix de base</label>
                                <div className="relative">
                                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="block w-full h-12 px-4 pl-7 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="150" required min="5" />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 sm:text-sm">€</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-900 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-medium text-white">Points clés du service (features)</h3>
                            <p className="text-sm text-gray-400 mt-1">Listez les éléments inclus dans votre offre de base.</p>
                            <div className="space-y-4 mt-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-grow h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder={`Ex: ${index+1} révision(s)`} />
                                        {features.length > 1 && (
                                          <button type="button" onClick={() => handleRemoveFeature(index)} className="flex-shrink-0 h-11 w-11 flex items-center justify-center text-gray-400 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                                            <span className="sr-only">Retirer</span>
                                            <XMarkIcon className="h-6 w-6" />
                                          </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={handleAddFeature} className="mt-4 inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
                                <PlusCircleIcon className="h-5 w-5 mr-2" />
                                Ajouter un point clé
                            </button>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="h-12 px-8 bg-teal-500 text-gray-900 font-semibold rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-teal-500 transition-colors">
                                Publier le service
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateServicePage;
