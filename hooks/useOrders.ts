import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  service_id: string;
  buyer_id: string;
  seller_id: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  price: number;
  delivery_date: string | null;
  requirements: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (serviceId: string, sellerId: string, price: number, requirements: string = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté pour passer une commande');

      const { data, error: createError } = await supabase
        .from('orders')
        .insert([{
          service_id: serviceId,
          buyer_id: user.id,
          seller_id: sellerId,
          price,
          requirements,
          status: 'pending',
        }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchOrders();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de la commande');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      await fetchOrders();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la mise à jour de la commande');
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
};
