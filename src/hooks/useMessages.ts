import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../lib/database.types';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [payload.new as Message, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
      
      // Optimistic update
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: false })
        .eq('id', id);
      if (error) throw error;
      
      // Optimistic update
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, is_read: false } : msg));
    } catch (err) {
      console.error('Error marking message as unread:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('is_read', false);
      if (error) throw error;
      
      // Optimistic update
      setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));
    } catch (err) {
      console.error('Error marking all messages as read:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      // Optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteMessage
  };
}
