import React, { useState, useEffect } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useProfiles } from '../hooks/useProfiles';
import { supabase } from '../lib/supabase';
import { ChevronLeftIcon, PaperAirplaneIcon } from './icons';

const MessagesPage: React.FC = () => {
  const { conversations, messages, loading, fetchMessages, sendMessage, markAsRead } = useMessages();
  const { profiles } = useProfiles();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId || !currentUserId) return;

    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return;

    const recipientId = conversation.user1_id === currentUserId
      ? conversation.user2_id
      : conversation.user1_id;

    try {
      await sendMessage(selectedConversationId, recipientId, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const getOtherUserFromConversation = (conversation: any) => {
    if (!currentUserId) return null;
    const otherUserId = conversation.user1_id === currentUserId
      ? conversation.user2_id
      : conversation.user1_id;
    return profiles[otherUserId] || { name: 'Utilisateur', avatar: '' };
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-800 rounded-xl overflow-hidden" style={{ height: '70vh' }}>
          <div className="lg:col-span-1 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-4">Conversations</h2>
              {conversations.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucune conversation</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => {
                    const otherUser = getOtherUserFromConversation(conv);
                    if (!otherUser) return null;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`w-full p-4 rounded-lg text-left transition-colors ${
                          selectedConversationId === conv.id
                            ? 'bg-teal-500/20 border border-teal-500'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{otherUser.name}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(conv.last_message_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            {selectedConversationId ? (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-teal-100' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
