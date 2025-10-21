import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Transaction, Wallet, Categories } from '../types';
import { getAIAssistantResponse } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

interface AIAssistantProps {
  wallets: Wallet[];
  categories: Categories;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  allData: any;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ wallets, categories, onAddTransaction, allData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleProcessPrompt = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    const currentPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    const historyForAPI = [...messages, userMessage].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    try {
      const response = await getAIAssistantResponse(historyForAPI.slice(-10), currentPrompt, allData); // send last 10 messages for history

      if (response?.functionCalls) {
        const functionCall = response.functionCalls[0];
        if (functionCall.name === 'addTransaction') {
            const args = functionCall.args;
            const wallet = wallets.find(w => w.name.toLowerCase() === args.walletName.toLowerCase()) || wallets[0];
            
            if (wallet) {
                const transactionData = {
                    description: args.description,
                    amount: args.amount,
                    type: args.type,
                    category: args.category,
                    walletId: wallet.id,
                };
                onAddTransaction(transactionData);
                
                const modelMessage: Message = { role: 'model', content: `✅ **Transaction Added:** ${args.description} for ${new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(args.amount)}.` };
                setMessages(prev => [...prev, modelMessage]);
            } else {
                 const modelMessage: Message = { role: 'model', content: `I tried to add the transaction, but I couldn't find a wallet named "${args.walletName}".` };
                 setMessages(prev => [...prev, modelMessage]);
            }
        }
      } else if (response?.text) {
        const modelMessage: Message = { role: 'model', content: response.text };
        setMessages(prev => [...prev, modelMessage]);
      } else {
         const modelMessage: Message = { role: 'model', content: "Sorry, I couldn't process that. Please try again." };
         setMessages(prev => [...prev, modelMessage]);
      }
    } catch (err) {
      console.error(err);
      const modelMessage: Message = { role: 'model', content: 'An error occurred. Please try again later.' };
      setMessages(prev => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="flex flex-col h-full max-h-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex-shrink-0">AI Assistant</h1>
      <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col min-h-0">
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
           {messages.length === 0 && !isLoading && (
               <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center">
                   <SparklesIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"/>
                   <p className="font-semibold">Welcome to AivoFinance AI</p>
                   <p className="text-sm">You can add a transaction or ask me anything about your finances.</p>
                   <p className="text-xs mt-4">e.g., "Spent 50 on lunch" or "What were my top 3 expenses this month?"</p>
               </div>
           )}
          {messages.map((msg, index) => (
             <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white"/></div>}
                <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-lg'}`}>
                   <div className="prose prose-sm dark:prose-invert max-w-none">
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                   </div>
                </div>
             </div>
          ))}
          {isLoading && (
              <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white"/></div>
                  <div className="max-w-xl p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                  </div>
              </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcessPrompt()}
            placeholder="Ask me anything or add a transaction..."
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            disabled={isLoading || wallets.length === 0}
          />
          <button
            onClick={handleProcessPrompt}
            disabled={isLoading || !prompt.trim() || wallets.length === 0}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        {wallets.length === 0 && <p className="text-xs text-center text-yellow-600 dark:text-yellow-400 mt-2">Please add a wallet first to use the AI Assistant.</p>}
      </div>
    </div>
  );
};

export default AIAssistant;