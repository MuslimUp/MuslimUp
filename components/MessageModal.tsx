import React, { useState } from 'react';
import { XMarkIcon, CheckBadgeIcon } from './icons';
import { Freelancer } from '../types';
import { supabase } from '../lib/supabase';

interface MessageModalProps {
  freelancer: Freelancer;
  onClose: () => void;
  onMessageSuccess: () => void;
}

const Spinner: React.FC = () => (
  <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const MessageModal: React.FC<MessageModalProps> = ({ freelancer, onClose, onMessageSuccess }) => {
  const [messageState, setMessageState] = useState<'initial' | 'loading' | 'success'>('initial');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessageState('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté pour envoyer un message');
      }

      const userId = session.user.id;
      const sellerId = freelancer.id;

      const user1Id = userId < sellerId ? userId : sellerId;
      const user2Id = userId < sellerId ? sellerId : userId;

      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user1_id', user1Id)
        .eq('user2_id', user2Id)
        .maybeSingle();

      let conversationId = existingConv?.id;

      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user1_id: user1Id,
            user2_id: user2Id,
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          recipient_id: sellerId,
          content: message,
        });

      if (messageError) throw messageError;

      setMessageState('success');
      setTimeout(() => {
        onMessageSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'envoi du message');
      setMessageState('initial');
    }
  };

  const renderContent = () => {
    switch (messageState) {
      case 'loading':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <Spinner />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Envoi du message...</h3>
            <p className="text-gray-500">Veuillez patienter.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <CheckBadgeIcon className="h-20 w-20 text-teal-500 mx-auto animate-pulse" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Message envoyé !</h3>
            <p className="text-gray-500">{freelancer.name} répondra dans les {freelancer.stats.responseTime}h.</p>
          </div>
        );
      case 'initial':
      default:
        return (
          <div className="transition-opacity duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Contacter {freelancer.name}</h2>
              <p className="mt-2 text-gray-600">{freelancer.title}</p>
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
              <img
                src={freelancer.avatarUrl}
                alt={freelancer.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{freelancer.name}</p>
                <p className="text-sm text-gray-600">Répond en moyenne en {freelancer.stats.responseTime}h</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSendMessage}>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Bonjour, j'aimerais en savoir plus sur vos services..."
                  required
                  className="block w-full p-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 px-8 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 px-8 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg p-8 bg-white rounded-2xl text-black shadow-2xl font-sans max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
          disabled={messageState !== 'initial'}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageModal;
