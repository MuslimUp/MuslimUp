import React from 'react';

const FloatingChatButton: React.FC = () => {
  return (
    <button
      className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-all hover:scale-110 flex items-center justify-center z-40"
      onClick={() => alert('Chat non disponible en ce moment')}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );
};

export default FloatingChatButton;
