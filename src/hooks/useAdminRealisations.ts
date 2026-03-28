import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Realisation } from '../lib/database.types';
import { uploadImage } from '../lib/cloudinary';

export function useAdminRealisations() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRealisations = async () => {
    try {
      setLoading(true);
      const response = await supabase
        .from('realisations')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response (useAdminRealisations):', response);

      if (response.error) throw response.error;
      setRealisations(response.data || []);
    } catch (err) {
      console.error('Supabase error (useAdminRealisations):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealisations();
  }, []);

  useEffect(() => {
    console.log('State realisations (useAdminRealisations):', realisations);
  }, [realisations]);

  const addRealisation = async (
    data: Omit<Realisation, 'id' | 'created_at'>,
    imageFile: File | null
  ) => {
    let image_url = data.image_url || null;
    
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }

    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      stack: data.stack || [],
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      is_confidential: data.is_confidential || false,
      image_url: image_url
    };

    const result = await supabase
      .from('realisations')
      .insert([payload])
      .select();

    if (result.error) {
      console.error('Insert error:', result.error);
      throw new Error(`Erreur d'insertion: ${result.error.message}`);
    }
    await fetchRealisations();
  };

  const updateRealisation = async (
    id: string,
    data: Partial<Realisation>,
    imageFile?: File | null
  ) => {
    let image_url = data.image_url;
    
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }

    const payload = {
      ...data,
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      image_url
    };

    const { error } = await supabase
      .from('realisations')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
      throw new Error(`Erreur de mise à jour: ${error.message}`);
    }
    await fetchRealisations();
  };

  const deleteRealisation = async (id: string) => {
    const { error } = await supabase
      .from('realisations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchRealisations();
  };

  return {
    realisations,
    loading,
    addRealisation,
    updateRealisation,
    deleteRealisation,
    refresh: fetchRealisations
  };
}
