import React from 'react';
import { Review } from '../types';
import { StarIcon } from './icons';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <div className="flex items-start">
        <img className="h-12 w-12 rounded-full object-cover" src={review.authorAvatarUrl} alt={review.authorName} />
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="font-bold text-white">{review.authorName}</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 flex-shrink-0 ml-4">{review.date}</p>
          </div>
          <p className="mt-3 text-gray-300 leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
