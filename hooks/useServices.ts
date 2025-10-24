import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          profiles:seller_id (
            id,
            full_name,
            avatar_url,
            is_seller,
            seller_level,
            orders_completed
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedServices: Service[] = (data || []).map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        category: service.category_id,
        price: parseFloat(service.price),
        imageUrl: service.image_url,
        freelancerId: service.seller_id,
        rating: 0,
        reviewCount: 0,
        features: Array.isArray(service.features) ? service.features : [],
        ordersInQueue: service.orders_in_queue || 0,
      }));

      setServices(transformedServices);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'freelancerId' | 'rating' | 'reviewCount' | 'ordersInQueue'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté pour créer un service');

      const { data, error: createError } = await supabase
        .from('services')
        .insert([{
          seller_id: user.id,
          category_id: serviceData.category,
          title: serviceData.title,
          description: serviceData.description,
          image_url: serviceData.imageUrl,
          price: serviceData.price,
          features: serviceData.features || [],
        }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchServices();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création du service');
    }
  };

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
  };
};
