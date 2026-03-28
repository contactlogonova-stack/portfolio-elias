import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Realisation, Message } from '../lib/database.types';

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    realisationsCount: 0,
    unreadMessagesCount: 0,
    avisCount: 0,
    totalMessagesCount: 0,
    latestRealisations: [] as Realisation[],
    latestMessages: [] as Message[]
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        { count: realisationsCount, error: realisationsError },
        { count: unreadMessagesCount, error: unreadMessagesError },
        { count: avisCount, error: avisError },
        { count: totalMessagesCount, error: totalMessagesError },
        { data: latestRealisations, error: latestRealisationsError },
        { data: latestMessages, error: latestMessagesError }
      ] = await Promise.all([
        supabase.from('realisations').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('avis').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('realisations').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (realisationsError) throw realisationsError;
      if (unreadMessagesError) throw unreadMessagesError;
      if (avisError) throw avisError;
      if (totalMessagesError) throw totalMessagesError;
      if (latestRealisationsError) throw latestRealisationsError;
      if (latestMessagesError) throw latestMessagesError;

      setStats({
        realisationsCount: realisationsCount || 0,
        unreadMessagesCount: unreadMessagesCount || 0,
        avisCount: avisCount || 0,
        totalMessagesCount: totalMessagesCount || 0,
        latestRealisations: latestRealisations || [],
        latestMessages: latestMessages || []
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...stats,
    loading,
    refresh: fetchDashboardData
  };
}
