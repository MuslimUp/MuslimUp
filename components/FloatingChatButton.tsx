import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleBottomCenterTextIcon, XMarkIcon, PaperAirplaneIcon, CheckBadgeIcon } from './icons';

const FloatingChatButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !subject || !message) return;

        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            setTimeout(() => {
                setIsOpen(false);
                // Reset form after a small delay to allow for fade-out animation
                setTimeout(() => {
                    setStatus('idle');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                }, 500);
            }, 2000);
        }, 1500);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="fixed bottom-6 left-6 z-50">
            {/* Widget */}
            <div 
                className={`w-80 sm:w-96 bg-gray-900 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ease-in-out origin-bottom-left ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                {status === 'sent' ? (
                    <div className="flex flex-col items-center justify-center p-8 h-[436px] text-center">
                        <CheckBadgeIcon className="h-16 w-16 text-teal-400 mb-4" />
                        <h3 className="text-xl font-bold text-white">Message envoyé !</h3>
                        <p className="text-gray-400 mt-2">Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center p-5 border-b border-white/10">
                            <h3 className="font-bold text-lg text-white">Contactez-nous</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label htmlFor="chat-email" className="block text-sm font-medium text-gray-300 mb-1.5">Votre email</label>
                                <input type="email" id="chat-email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full h-11 px-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="votre.email@exemple.com" />
                            </div>
                            <div>
                                <label htmlFor="chat-subject" className="block text-sm font-medium text-gray-300 mb-1.5">Sujet</label>
                                <input type="text" id="chat-subject" value={subject} onChange={e => setSubject(e.target.value)} required className="block w-full h-11 px-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="Question sur un service" />
                            </div>
                            <div>
                                <label htmlFor="chat-message" className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                                <textarea id="chat-message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required className="block w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" placeholder="Bonjour, j'aimerais savoir..."></textarea>
                            </div>
                            <button type="submit" disabled={status === 'sending'} className="w-full h-12 px-6 bg-teal-500 text-gray-900 font-semibold rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors flex items-center justify-center disabled:bg-teal-800 disabled:cursor-not-allowed">
                                {status === 'sending' ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        Envoyer
                                        <PaperAirplaneIcon className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-16 w-16 bg-teal-500 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-200 transform hover:scale-110 mt-4 relative overflow-hidden"
                aria-label="Ouvrir le chat"
            >
                <div className={`transition-transform duration-300 absolute ${isOpen ? 'rotate-45 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                    <ChatBubbleBottomCenterTextIcon className="h-8 w-8" />
                </div>
                <div className={`transition-transform duration-300 absolute ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-0 opacity-0'}`}>
                    <XMarkIcon className="h-8 w-8" />
                </div>
            </button>
        </div>
    );
};

export default FloatingChatButton;
