import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  order_id: string;
  service_id: string;
  reviewer_id: string;
  seller_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const useReviews = (serviceId?: string, sellerId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId || sellerId) {
      fetchReviews();
    }
  }, [serviceId, sellerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('reviews').select('*');

      if (serviceId) {
        query = query.eq('service_id', serviceId);
      } else if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setReviews(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (orderId: string, serviceId: string, sellerId: string, rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté pour laisser un avis');

      const { data, error: createError } = await supabase
        .from('reviews')
        .insert([{
          order_id: orderId,
          service_id: serviceId,
          reviewer_id: user.id,
          seller_id: sellerId,
          rating,
          comment,
        }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchReviews();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de l\'avis');
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
  };
};
