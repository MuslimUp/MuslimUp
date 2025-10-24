import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Freelancer } from '../types';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, Freelancer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_seller', true);

      if (fetchError) throw fetchError;

      const profilesMap = (data || []).reduce((acc, profile) => {
        acc[profile.id] = {
          id: profile.id,
          name: profile.full_name,
          avatar: profile.avatar_url || '',
          bio: profile.bio || '',
          rating: 5.0,
          reviewCount: 0,
          level: profile.seller_level || 'new',
          skills: [],
          languages: [],
          responseTime: '1h',
          memberSince: profile.member_since || profile.created_at,
          ordersCompleted: profile.orders_completed || 0,
          onTimeDeliveryRate: profile.on_time_delivery_rate || 100,
        };
        return acc;
      }, {} as Record<string, Freelancer>);

      setProfiles(profilesMap);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Freelancer>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          avatar_url: profileData.avatar,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchProfiles();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  const becomeSeller = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_seller: true,
          seller_level: 'new',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchProfiles();
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de l\'activation du compte vendeur');
    }
  };

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    updateProfile,
    becomeSeller,
  };
};
