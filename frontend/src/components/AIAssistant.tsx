import { useState } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import { formatDateTime } from '../utils/formatDate';

interface AIAssistantProps {
  activeTab: string;
}

export default function AIAssistant({ activeTab }: AIAssistantProps) {
  const { messages, loading, sendMessage, clearMessages } = useAIChat();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const message = inputValue;
    setInputValue('');
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">AI Assistant</h1>
          <p className="text-onSurfaceVariant font-bodyMd">Your intelligent health companion for personalized insights and support.</p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white border border-outlineVariant rounded-xl shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="p-md border-b border-outlineVariant flex justify-between items-center bg-surfaceContainerLowest/50">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </div>
              <div>
                <span className="font-labelMd font-semibold text-onSurface">Health Assistant AI</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emeraldGreen rounded-full"></span>
                  <span className="text-labelSm text-emeraldGreen">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-labelSm text-secondary bg-secondaryContainer/30 px-sm py-0.5 rounded">98% Confidence</span>
              <span className="text-labelSm text-outline">v2.4</span>
              {messages.length > 0 && (
                <button 
                  onClick={clearMessages}
                  className="text-labelSm text-onSurfaceVariant hover:text-error transition-colors ml-2"
                  title="Clear chat"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] p-lg overflow-y-auto flex flex-col gap-lg custom-scrollbar bg-slate-50">
            {messages.length === 0 ? (
              /* Welcome Message */
              <div className="flex gap-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex-grow bg-white p-md rounded-2xl rounded-tl-none shadow-sm border border-outlineVariant">
                  <p className="font-bodySm text-onSurface leading-relaxed">
                    Hello! I'm your AI health assistant. I can help you with:
                  </p>
                  <ul className="mt-3 space-y-2 text-bodySm text-onSurfaceVariant">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Understanding your medical reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Medication reminders and adherence
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Health trend analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Personalized care plan recommendations
                    </li>
                  </ul>
                  <p className="mt-3 font-bodySm text-onSurface leading-relaxed">
                    How can I assist you today?
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex gap-md max-w-[80%] ${message.role === 'user' ? 'self-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                  )}
                  <div className={`flex-grow p-md rounded-2xl shadow-sm border ${
                    message.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none border-primary' 
                      : 'bg-white text-onSurface rounded-tl-none border-outlineVariant'
                  }`}>
                    {message.role === 'assistant' && loading && messages.indexOf(message) === messages.length - 1 ? (
                      <span className="italic text-onSurfaceVariant flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                        Thinking...
                      </span>
                    ) : (
                      <p className="font-bodySm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.confidence && message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-outlineVariant/20">
                        <span className="text-labelSm text-onSurfaceVariant">
                          Confidence: {Math.round(message.confidence * 100)}%
                        </span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-outlineVariant/20">
                      <span className="text-labelSm text-onSurfaceVariant">
                        {formatDateTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && messages.length > 0 && (
              <div className="flex gap-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex-grow bg-white p-md rounded-2xl rounded-tl-none shadow-sm border border-outlineVariant">
                  <span className="italic text-onSurfaceVariant flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-md border-t border-outlineVariant flex gap-md items-center bg-white">
            <input 
              className="flex-grow border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="Ask about your health, medications, or reports..." 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
            >
              <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'send'}</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-xl">
          <h2 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide mb-lg">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-lg bg-white border border-outlineVariant rounded-xl shadow-sm hover:shadow-md transition-all text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-primary group-hover:scale-110 transition-transform">description</span>
                <span className="font-labelMd font-semibold text-onSurface">Analyze Report</span>
              </div>
              <p className="text-bodySm text-onSurfaceVariant">Upload and get AI insights on your medical reports</p>
            </button>
            <button className="p-lg bg-white border border-outlineVariant rounded-xl shadow-sm hover:shadow-md transition-all text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-secondary group-hover:scale-110 transition-transform">pill</span>
                <span className="font-labelMd font-semibold text-onSurface">Medication Help</span>
              </div>
              <p className="text-bodySm text-onSurfaceVariant">Get help with medication schedules and interactions</p>
            </button>
            <button className="p-lg bg-white border border-outlineVariant rounded-xl shadow-sm hover:shadow-md transition-all text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-tertiary group-hover:scale-110 transition-transform">timeline</span>
                <span className="font-labelMd font-semibold text-onSurface">Health Trends</span>
              </div>
              <p className="text-bodySm text-onSurfaceVariant">View your health trends and predictions</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
