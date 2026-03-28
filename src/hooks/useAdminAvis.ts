import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Avis } from '../lib/database.types';

export function useAdminAvis() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvis(data || []);
    } catch (err: any) {
      console.error('Error fetching avis:', err);
      setError(err.message || 'Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvis();
  }, [fetchAvis]);

  const addAvis = async (data: Omit<Avis, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('avis').insert([data]);
      if (error) throw error;
      await fetchAvis();
      return { success: true };
    } catch (err) {
      console.error('Error adding avis:', err);
      return { success: false, error: err };
    }
  };

  const updateAvis = async (id: string, data: Partial<Omit<Avis, 'id' | 'created_at'>>) => {
    try {
      const { error } = await supabase.from('avis').update(data).eq('id', id);
      if (error) throw error;
      await fetchAvis();
      return { success: true };
    } catch (err) {
      console.error('Error updating avis:', err);
      return { success: false, error: err };
    }
  };

  const deleteAvis = async (id: string) => {
    try {
      const { error } = await supabase.from('avis').delete().eq('id', id);
      if (error) throw error;
      await fetchAvis();
      return { success: true };
    } catch (err) {
      console.error('Error deleting avis:', err);
      return { success: false, error: err };
    }
  };

  return {
    avis,
    loading,
    error,
    addAvis,
    updateAvis,
    deleteAvis,
    refresh: fetchAvis
  };
}
