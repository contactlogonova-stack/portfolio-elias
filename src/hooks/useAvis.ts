import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Avis } from '../lib/database.types';

export function useAvis() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched avis:', data);
      setAvis(data || []);
    } catch (err: any) {
      console.error('Error fetching avis (useAvis):', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useAvis hook initialized');
    fetchAvis();
  }, []);

  return { avis, loading, error, refresh: fetchAvis };
}
