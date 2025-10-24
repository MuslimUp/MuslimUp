import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setServices(data as Service[]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'freelancerId' | 'rating' | 'reviewCount' | 'ordersInQueue'>) => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Vous devez être connecté');
    }

    const { data, error } = await supabase
      .from('services')
      .insert([{
        ...serviceData,
        freelancer_id: session.user.id,
        rating: 0,
        review_count: 0,
        orders_in_queue: 0,
      }])
      .select()
      .single();

    if (error) throw error;

    await fetchServices();
    return data;
  };

  return { services, loading, createService };
};
