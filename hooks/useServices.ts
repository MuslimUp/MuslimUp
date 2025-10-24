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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const servicesWithPackages = await Promise.all(
          data.map(async (s) => {
            const { data: packages } = await supabase
              .from('service_packages')
              .select('price')
              .eq('service_id', s.id)
              .eq('is_active', true)
              .order('price', { ascending: true })
              .limit(1);

            return {
              id: s.id,
              freelancerId: s.seller_id,
              sellerId: s.seller_id,
              categoryId: s.category_id,
              category: s.category,
              title: s.title,
              slug: s.slug,
              imageUrl: s.image_url,
              tags: s.tags,
              rating: s.rating,
              reviewCount: s.review_count,
              price: packages && packages.length > 0 ? packages[0].price : 0,
              ordersInQueue: s.orders_in_queue,
              totalSales: s.total_sales,
              description: s.description,
              isActive: s.is_active,
              createdAt: s.created_at
            };
          })
        );

        setServices(servicesWithPackages);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading };
};
