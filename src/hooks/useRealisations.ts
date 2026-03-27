import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Realisation } from '../lib/database.types';

export function useRealisations() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRealisations() {
      try {
        const { data, error } = await supabase
          .from('realisations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRealisations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchRealisations();
  }, []);

  return { realisations, loading, error };
}
