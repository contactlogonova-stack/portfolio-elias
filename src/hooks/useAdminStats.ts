import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Stat } from '../lib/database.types';

export function useAdminStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const addStat = async (data: Omit<Stat, 'id'>) => {
    try {
      const { error } = await supabase.from('stats').insert([data]);
      if (error) throw error;
      await fetchStats(); // Recharge la liste après insertion
      return { success: true };
    } catch (err) {
      console.error('Error adding stat:', err);
      return { success: false, error: err };
    }
  };

  const updateStat = async (id: string, data: Partial<Omit<Stat, 'id'>>) => {
    try {
      const { error } = await supabase.from('stats').update(data).eq('id', id);
      if (error) throw error;
      await fetchStats(); // Recharge la liste après mise à jour
      return { success: true };
    } catch (err) {
      console.error('Error updating stat:', err);
      return { success: false, error: err };
    }
  };

  const deleteStat = async (id: string) => {
    try {
      const { error } = await supabase.from('stats').delete().eq('id', id);
      if (error) throw error;
      await fetchStats(); // Recharge la liste après suppression
      return { success: true };
    } catch (err) {
      console.error('Error deleting stat:', err);
      return { success: false, error: err };
    }
  };

  return {
    stats,
    loading,
    error,
    addStat,
    updateStat,
    deleteStat,
    refresh: fetchStats
  };
}
