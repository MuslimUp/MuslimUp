import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Freelancer } from '../types';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, Freelancer>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      if (data) {
        const profilesMap = data.reduce((acc, profile) => {
          acc[profile.id] = {
            id: profile.id,
            name: profile.name || 'Utilisateur',
            title: profile.title || 'Freelance',
            avatarUrl: profile.avatar_url || 'https://picsum.photos/128/128',
            level: profile.level || 'Nouveau vendeur',
            description: profile.description || '',
            rating: profile.rating || 0,
            reviewCount: profile.review_count || 0,
            stats: profile.stats || {
              responseTime: 24,
              ordersCompleted: 0,
              onTimeDeliveryRate: 100,
            },
            memberSince: profile.member_since || new Date().toLocaleDateString(),
          };
          return acc;
        }, {} as Record<string, Freelancer>);

        setProfiles(profilesMap);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const becomeSeller = async () => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Vous devez être connecté');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ is_seller: true })
      .eq('id', session.user.id);

    if (error) throw error;

    await fetchProfiles();
  };

  return { profiles, loading, becomeSeller };
};
