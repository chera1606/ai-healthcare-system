import { useState } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import { formatDateTime } from '../utils/formatDate';
import { SourceCitation } from '../types';

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
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">AI Assistant</h1>
          <p className="text-slate-500 font-bodyMd">Your intelligent health companion for personalized insights and support.</p>
        </div>

        {/* Chat Interface */}
        <div className="glass-card rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="p-md border-b border-slate-200/50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </div>
              <div>
                <span className="font-labelMd font-semibold text-slate-800">Health Assistant AI</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full status-pill-pulse"></span>
                  <span className="text-labelSm text-emerald-600 font-semibold uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-labelSm text-emerald-600 bg-emerald-500/10 border border-emerald-500/15 px-sm py-0.5 rounded font-semibold">98% Confidence</span>
              <span className="text-labelSm text-slate-400">v2.4</span>
              {messages.length > 0 && (
                <button 
                  onClick={clearMessages}
                  className="text-labelSm text-slate-500 hover:text-rose-600 transition-colors ml-2 p-1 hover:bg-slate-100 rounded"
                  title="Clear chat"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] p-lg overflow-y-auto flex flex-col gap-lg custom-scrollbar bg-slate-50/50">
            {messages.length === 0 ? (
              /* Welcome Message */
              <div className="flex gap-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex-grow bg-white p-md rounded-2xl rounded-tl-none border border-slate-200/50 shadow-sm">
                  <p className="font-bodySm text-slate-800 leading-relaxed font-medium">
                    Hello! I'm your AI health assistant. I can help you with:
                  </p>
                  <ul className="mt-3 space-y-2 text-bodySm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check_circle</span>
                      Understanding your medical reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check_circle</span>
                      Medication reminders and adherence
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check_circle</span>
                      Health trend analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check_circle</span>
                      Personalized care plan recommendations
                    </li>
                  </ul>
                  <p className="mt-3 font-bodySm text-slate-800 leading-relaxed font-medium">
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
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                  )}
                  <div className={`flex-grow p-md rounded-2xl shadow-sm border ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none border-blue-500 shadow-md shadow-blue-100' 
                      : 'bg-white text-slate-800 rounded-tl-none border-slate-200/50'
                  }`}>
                    {message.role === 'assistant' && loading && messages.indexOf(message) === messages.length - 1 ? (
                      <span className="italic text-blue-600 flex items-center gap-sm font-bold text-xs">
                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                        THINKING...
                      </span>
                    ) : (
                      <p className="font-bodySm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.confidence && message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <span className="text-labelSm text-slate-400">
                          Confidence: {Math.round(message.confidence * 100)}%
                        </span>
                      </div>
                    )}
                    {message.sources && message.sources.length > 0 && message.role === 'assistant' && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-sm mb-2">
                          <span className="material-symbols-outlined text-[16px] text-blue-600">source</span>
                          <span className="text-labelSm font-semibold text-slate-700">Sources</span>
                        </div>
                        <div className="space-y-2">
                          {message.sources.map((source: SourceCitation, index: number) => (
                            <div key={`${source.sourceType}-${source.reportId}-${index}`} className="p-sm bg-slate-50 border border-slate-100 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className="text-labelSm text-blue-600 font-bold">[{index + 1}]</span>
                                <div className="flex-1">
                                  <p className="text-bodySm text-slate-600 mb-1">{source.textPreview}</p>
                                  <div className="flex items-center gap-2 text-labelSm text-slate-400">
                                    {source.sourceType === 'chunk' && source.fileName && (
                                      <>
                                        <span className="material-symbols-outlined text-[14px]">description</span>
                                        <span className="truncate max-w-[150px]">{source.fileName}</span>
                                        {source.similarity && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-600">Similarity: {(source.similarity * 100).toFixed(0)}%</span>
                                          </>
                                        )}
                                      </>
                                    )}
                                    {source.sourceType === 'observation' && source.observationKey && (
                                      <>
                                        <span className="material-symbols-outlined text-[14px]">medical_services</span>
                                        <span>{source.observationKey}</span>
                                        {source.confidence && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-600">Confidence: {(source.confidence * 100).toFixed(0)}%</span>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && messages.length > 0 && (
              <div className="flex gap-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex-grow bg-white p-md rounded-2xl rounded-tl-none border border-slate-200/50 shadow-sm">
                  <span className="italic text-blue-600 flex items-center gap-sm font-bold text-xs">
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    THINKING...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-md border-t border-slate-200/50 flex gap-md items-center bg-slate-50/50">
            <input 
              className="flex-grow glass-input rounded-lg px-lg py-md text-bodyMd border-slate-200 focus:ring-1 focus:ring-blue-500" 
              placeholder="Ask about your health, medications, or reports..." 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
            >
              <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'send'}</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-xl">
          <h2 className="font-labelMd text-slate-500 uppercase tracking-wide mb-lg">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-lg glass-card glass-card-hover rounded-xl shadow-sm text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-blue-600 group-hover:scale-110 transition-transform">description</span>
                <span className="font-labelMd font-semibold text-slate-800">Analyze Report</span>
              </div>
              <p className="text-bodySm text-slate-500">Upload and get AI insights on your medical reports</p>
            </button>
            <button className="p-lg glass-card glass-card-hover rounded-xl shadow-sm text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-indigo-600 group-hover:scale-110 transition-transform">pill</span>
                <span className="font-labelMd font-semibold text-slate-800">Medication Help</span>
              </div>
              <p className="text-bodySm text-slate-500">Get help with medication schedules and interactions</p>
            </button>
            <button className="p-lg glass-card glass-card-hover rounded-xl shadow-sm text-left group">
              <div className="flex items-center gap-3 mb-sm">
                <span className="material-symbols-outlined text-2xl text-blue-600 group-hover:scale-110 transition-transform">timeline</span>
                <span className="font-labelMd font-semibold text-slate-800">Health Trends</span>
              </div>
              <p className="text-bodySm text-slate-500">View your health trends and predictions</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
