import React, { useState } from 'react';
import { XMarkIcon, CheckBadgeIcon, StarIcon } from './icons';
import { supabase } from '../lib/supabase';

interface ReviewModalProps {
  orderId: string;
  serviceId: string;
  sellerId: string;
  onClose: () => void;
  onReviewSuccess: () => void;
}

const Spinner: React.FC = () => (
  <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ReviewModal: React.FC<ReviewModalProps> = ({ orderId, serviceId, sellerId, onClose, onReviewSuccess }) => {
  const [reviewState, setReviewState] = useState<'initial' | 'loading' | 'success'>('initial');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setError('');
    setReviewState('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Vous devez être connecté pour laisser un avis');
      }

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          service_id: serviceId,
          reviewer_id: session.user.id,
          seller_id: sellerId,
          rating: rating,
          comment: comment,
        });

      if (reviewError) throw reviewError;

      setReviewState('success');
      setTimeout(() => {
        onReviewSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'envoi de l\'avis');
      setReviewState('initial');
    }
  };

  const renderContent = () => {
    switch (reviewState) {
      case 'loading':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <Spinner />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Envoi de votre avis...</h3>
            <p className="text-gray-500">Veuillez patienter.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-16 transition-opacity duration-300">
            <CheckBadgeIcon className="h-20 w-20 text-teal-500 mx-auto animate-pulse" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Merci pour votre avis !</h3>
            <p className="text-gray-500">Votre retour aide la communauté à faire les bons choix.</p>
          </div>
        );
      case 'initial':
      default:
        return (
          <div className="transition-opacity duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Laisser un avis</h2>
              <p className="mt-2 text-gray-600">Partagez votre expérience avec ce service</p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleSubmitReview}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Note
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <StarIcon
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Partagez votre expérience avec ce vendeur et ce service..."
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
                  Publier l'avis
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
          disabled={reviewState !== 'initial'}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewModal;
