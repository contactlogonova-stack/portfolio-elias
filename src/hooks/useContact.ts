import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useContact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (data: ContactData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('messages')
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          }
        ]);

      if (supabaseError) throw supabaseError;

      // Appeler la Edge Function pour envoyer la notification push (silencieusement)
      try {
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ name: data.name })
        }).catch(err => console.error('Edge Function error (silent):', err));
      } catch (e) {
        console.error('Failed to trigger push notification:', e);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { loading, success, error, sendMessage };
}
