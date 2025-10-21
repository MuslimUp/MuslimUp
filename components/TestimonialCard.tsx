import React from 'react';
import { Testimonial } from '../types';
import { ChatBubbleBottomCenterTextIcon } from './icons';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="flex h-full flex-col justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl">
      <div>
        <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-teal-400 mb-6" />
        <blockquote className="text-gray-300 italic text-lg">
          <p>"{testimonial.quote}"</p>
        </blockquote>
      </div>
      <footer className="mt-8">
        <div className="flex items-center">
          <img 
            src={testimonial.clientAvatarUrl} 
            alt={testimonial.clientName} 
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />
          <div className="ml-4">
            <div className="text-base font-bold text-white">{testimonial.clientName}</div>
            <div className="text-base text-gray-400">{testimonial.clientTitle}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestimonialCard;