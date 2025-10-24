import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ReviewSubmissionModalProps {
  orderId: string;
  serviceId: string;
  sellerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  orderId,
  serviceId,
  sellerId,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length < 10) {
      setError('Votre avis doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase non configuré');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté');
      }

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          service_id: serviceId,
          reviewer_id: session.user.id,
          seller_id: sellerId,
          rating,
          comment
        });

      if (reviewError) throw reviewError;

      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('service_id', serviceId);

      if (reviews) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await supabase
          .from('services')
          .update({
            rating: avgRating,
            review_count: reviews.length
          })
          .eq('id', serviceId);
      }

      const { data: sellerReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('seller_id', sellerId);

      if (sellerReviews) {
        const avgRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;

        await supabase
          .from('profiles')
          .update({
            rating: avgRating,
            review_count: sellerReviews.length
          })
          .eq('id', sellerId);
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: sellerId,
          type: 'new_review',
          title: 'Nouvel avis',
          message: `Vous avez reçu un nouvel avis ${rating}★`,
          link: `/services/${serviceId}`
        });

      onSuccess();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Erreur lors de la soumission de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl p-8 max-w-lg w-full border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Laisser un avis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Note</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="text-white font-semibold ml-2">{rating}/5</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Votre commentaire *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              placeholder="Partagez votre expérience avec ce service..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 10 caractères</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Publier mon avis'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
