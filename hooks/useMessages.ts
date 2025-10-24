import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  order_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  created_at: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (fetchError) throw fetchError;

      setConversations(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (otherUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté');

      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
        .maybeSingle();

      if (existingConv) return existingConv;

      const { data, error: createError } = await supabase
        .from('conversations')
        .insert([{
          user1_id: user.id,
          user2_id: otherUserId,
        }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchConversations();
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de la conversation');
    }
  };

  const sendMessage = async (conversationId: string, recipientId: string, content: string, orderId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vous devez être connecté');

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          order_id: orderId || null,
        }])
        .select()
        .single();

      if (sendError) throw sendError;

      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      await fetchMessages(conversationId);
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de l\'envoi du message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('Erreur lors du marquage du message comme lu:', err);
    }
  };

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    createConversation,
    sendMessage,
    markAsRead,
  };
};
