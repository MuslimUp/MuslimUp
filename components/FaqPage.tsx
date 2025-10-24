import React, { useState } from 'react';
import InfoPageLayout from './InfoPageLayout';
import { FAQ_ITEMS } from '../constants';
import { ChevronDownIcon } from './icons';

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <InfoPageLayout
      title="Foire Aux Questions"
      subtitle="Trouvez les réponses aux questions les plus fréquemment posées sur MuslimUp."
    >
      <div className="divide-y divide-gray-800 border-t border-b border-gray-800">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center text-left py-6 px-2 focus:outline-none"
            >
              <span className="text-lg font-semibold text-white">{item.q}</span>
              <ChevronDownIcon
                className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className="pb-6 px-2 prose prose-invert prose-lg text-gray-300">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
};

export default FaqPage;