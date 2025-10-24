import React, { useState, useEffect } from 'react';
import { Order, OrderMessage, Service } from '../types';
import { supabase } from '../lib/supabase';

interface OrderDetailPageProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<Order & { service?: Service; sellerName?: string; buyerName?: string } | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    subscribeToMessages();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      setUserId(session.user.id);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          services (*),
          buyer:profiles!orders_buyer_id_fkey (name, avatar_url),
          seller:profiles!orders_seller_id_fkey (name, avatar_url)
        `)
        .eq('id', orderId)
        .maybeSingle();

      if (orderError) throw orderError;

      if (orderData) {
        setOrder({
          id: orderData.id,
          buyerId: orderData.buyer_id,
          sellerId: orderData.seller_id,
          serviceId: orderData.service_id,
          packageId: orderData.package_id,
          status: orderData.status,
          amount: orderData.amount,
          commission: orderData.commission,
          deliveryDate: orderData.delivery_date,
          requirements: orderData.requirements,
          deliveryMessage: orderData.delivery_message,
          deliveryFiles: orderData.delivery_files,
          cancellationReason: orderData.cancellation_reason,
          completedAt: orderData.completed_at,
          createdAt: orderData.created_at,
          updatedAt: orderData.updated_at,
          service: orderData.services ? {
            id: orderData.services.id,
            freelancerId: orderData.services.seller_id,
            sellerId: orderData.services.seller_id,
            categoryId: orderData.services.category_id,
            title: orderData.services.title,
            imageUrl: orderData.services.image_url,
            rating: orderData.services.rating,
            reviewCount: orderData.services.review_count,
            price: 0,
            ordersInQueue: 0,
            description: orderData.services.description
          } : undefined,
          sellerName: orderData.seller?.name || 'Vendeur',
          buyerName: orderData.buyer?.name || 'Acheteur'
        });
      }

      const { data: messagesData } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData.map(m => ({
          id: m.id,
          orderId: m.order_id,
          senderId: m.sender_id,
          message: m.message,
          attachments: m.attachments,
          isSystemMessage: m.is_system_message,
          createdAt: m.created_at
        })));
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!supabase) return;

    const subscription = supabase
      .channel(`order_messages:${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'order_messages',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        const newMsg = payload.new as any;
        setMessages(prev => [...prev, {
          id: newMsg.id,
          orderId: newMsg.order_id,
          senderId: newMsg.sender_id,
          message: newMsg.message,
          attachments: newMsg.attachments,
          isSystemMessage: newMsg.is_system_message,
          createdAt: newMsg.created_at
        }]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !supabase) return;

    setSending(true);
    try {
      await supabase
        .from('order_messages')
        .insert({
          order_id: orderId,
          sender_id: userId,
          message: newMessage,
          is_system_message: false
        });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string, message?: string) => {
    if (!supabase || !order) return;

    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };

      if (newStatus === 'delivered' && deliveryMessage) {
        updates.delivery_message = deliveryMessage;
      }

      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (message) {
        await supabase
          .from('order_messages')
          .insert({
            order_id: orderId,
            sender_id: userId,
            message,
            is_system_message: true
          });
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: userId === order.buyerId ? order.sellerId : order.buyerId,
          type: 'order_status_update',
          title: 'Mise à jour de commande',
          message: `La commande "${order.service?.title}" a été mise à jour`,
          link: `/orders/${orderId}`
        });

      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  const isSeller = userId === order.sellerId;
  const isBuyer = userId === order.buyerId;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <button onClick={onBack} className="text-teal-400 hover:text-teal-300 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h1 className="text-2xl font-bold text-white mb-4">{order.service?.title}</h1>

              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400">
                  Commande #{orderId.slice(0, 8)}
                </div>
                <div className="text-teal-400 font-bold text-xl">{order.amount}€</div>
              </div>

              {order.requirements && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Détails de la commande</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{order.requirements}</p>
                </div>
              )}
            </div>

            {order.status === 'delivered' && order.deliveryMessage && (
              <div className="bg-green-500/10 border border-green-500 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">✓ Livraison</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{order.deliveryMessage}</p>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Messages</h2>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.isSystemMessage
                        ? 'bg-blue-500/10 border border-blue-500/50'
                        : msg.senderId === userId
                        ? 'bg-teal-500/10 ml-8'
                        : 'bg-white/5 mr-8'
                    }`}
                  >
                    <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(msg.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>

              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrivez un message..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                  >
                    Envoyer
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 sticky top-24 space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Statut</h3>
                <p className="text-white font-semibold capitalize">{order.status.replace('_', ' ')}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-1">Livraison prévue</h3>
                <p className="text-white">
                  {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>

              {isSeller && order.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('in_progress', 'Le vendeur a commencé à travailler sur votre commande')}
                  className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold"
                >
                  Commencer la commande
                </button>
              )}

              {isSeller && order.status === 'in_progress' && (
                <div className="space-y-3">
                  <textarea
                    value={deliveryMessage}
                    onChange={(e) => setDeliveryMessage(e.target.value)}
                    rows={4}
                    placeholder="Message de livraison..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => handleStatusUpdate('delivered', deliveryMessage || 'Le vendeur a livré la commande')}
                    disabled={!deliveryMessage.trim()}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
                  >
                    Livrer la commande
                  </button>
                </div>
              )}

              {isBuyer && order.status === 'delivered' && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusUpdate('completed', 'L\'acheteur a validé la commande')}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    Valider la commande
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('in_revision', 'L\'acheteur demande des révisions')}
                    className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Demander des révisions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
