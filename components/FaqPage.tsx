import React from 'react';
import { FAQ_ITEMS } from '../constants';

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Questions fréquentes</h1>

        <div className="max-w-3xl mx-auto space-y-6">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
              <p className="text-gray-300">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
