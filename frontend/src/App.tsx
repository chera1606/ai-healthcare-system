import { useState, type FormEvent } from "react";
import ReportUpload from "./components/ReportUpload";

type ChatResponse = {
  ok: boolean;
  reply?: string;
  disclaimer?: string;
  error?: string;
};

type SearchResponse = {
  ok: boolean;
  results?: Array<{
    chunkId: number;
    chunkText: string;
    chunkIndex: number;
    originalName: string;
    similarity: number;
  }>;
  count?: number;
  error?: string;
};

const initialDisclaimer =
  "Informational support only. This system does not diagnose, treat, or replace professional medical advice.";

export default function App() {
  const [activeTab, setActiveTab] = useState<"upload" | "search" | "chat">("upload");
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResponse["results"]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  
  // Chat state
  const [message, setMessage] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [disclaimer, setDisclaimer] = useState<string>(initialDisclaimer);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string>("");

  // RAG Chat state
  const [ragMessage, setRagMessage] = useState<string>("");
  const [ragReply, setRagReply] = useState<string>("");
  const [ragDisclaimer, setRagDisclaimer] = useState<string>(initialDisclaimer);
  const [ragChatLoading, setRagChatLoading] = useState<boolean>(false);
  const [ragChatError, setRagChatError] = useState<string>("");

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.results || []);
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setChatError("Please type a message first.");
      return;
    }

    setChatLoading(true);
    setChatError("");
    setReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setReply(data.reply || "");
      setDisclaimer(data.disclaimer || initialDisclaimer);
      setMessage("");
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setChatLoading(false);
    }
  };

  const handleRagChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ragMessage.trim()) {
      setRagChatError("Please type a message first.");
      return;
    }

    setRagChatLoading(true);
    setRagChatError("");
    setRagReply("");

    try {
      const response = await fetch("/api/rag-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: ragMessage })
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setRagReply(data.reply || "");
      setRagDisclaimer(data.disclaimer || initialDisclaimer);
      setRagMessage("");
    } catch (err) {
      setRagChatError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setRagChatLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto min-h-screen max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm text-teal-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            AI-Powered Medical Intelligence
          </div>
          <h1 className="text-5xl font-bold text-white md:text-7xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Medical Report Intelligence
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Upload medical reports, search them with AI, or chat with the health assistant
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-700 bg-slate-900/50 p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("upload")}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "upload"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Upload Report
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "search"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Search Reports
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab("rag-chat")}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "rag-chat"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              RAG Chat
            </button>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReportUpload onUploadSuccess={(message) => setUploadSuccess(message)} />
            {uploadSuccess && (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-200 text-center">
                ✓ {uploadSuccess}
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white mb-6">Search Your Reports</h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ask about your medical reports..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-6 py-4 text-lg text-slate-100 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 placeholder:text-slate-500"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-teal-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-teal-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    "Search Reports"
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                  {error}
                </div>
              )}

              {results && results.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">
                    Found {results.length} relevant section{results.length !== 1 ? "s" : ""}
                  </h3>
                  {results.map((result, index) => (
                    <div
                      key={result.chunkId}
                      className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 hover:border-teal-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-teal-300">{result.originalName}</h4>
                          <p className="text-sm text-slate-400">Section {result.chunkIndex + 1}</p>
                        </div>
                        <div className="rounded-full bg-teal-500/10 px-3 py-1 text-sm text-teal-300">
                          {(result.similarity * 100).toFixed(1)}% match
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{result.chunkText}</p>
                    </div>
                  ))}
                </div>
              )}

              {results && results.length === 0 && !loading && query && (
                <div className="mt-6 text-center text-slate-400">
                  No relevant sections found. Try uploading more reports or rephrase your query.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Safety disclaimer
              </h3>
              <p className="text-slate-300 leading-relaxed">{initialDisclaimer}</p>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white mb-6">AI Chat Assistant</h2>
              <p className="text-slate-400 mb-6">Ask any question - this AI assistant can help with general knowledge, health information, and more.</p>
              
              <form onSubmit={handleChat} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-200">
                    Your question
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Example: What causes headaches?"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-6 py-4 text-lg text-slate-100 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={chatLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-teal-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-teal-500/25"
                >
                  {chatLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>

              {chatError && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                  {chatError}
                </div>
              )}

              {reply && (
                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-2">
                    Assistant reply
                  </h3>
                  <p className="text-slate-100 leading-relaxed">{reply}</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Safety disclaimer
                </h3>
                <p className="text-slate-300 leading-relaxed">{disclaimer}</p>
              </div>
            </div>
          </div>
        )}

        {/* RAG Chat Tab */}
        {activeTab === "rag-chat" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
              <h2 className="text-2xl font-semibold text-white mb-6">Document RAG Chat</h2>
              <p className="text-slate-400 mb-6">Ask questions about your uploaded medical reports - this AI will search your documents to find relevant answers.</p>
              
              <form onSubmit={handleRagChat} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-200">
                    Your question about uploaded reports
                  </label>
                  <input
                    type="text"
                    value={ragMessage}
                    onChange={(event) => setRagMessage(event.target.value)}
                    placeholder="Example: What medications were prescribed?"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-6 py-4 text-lg text-slate-100 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ragChatLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-purple-400 hover:to-pink-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-purple-500/25"
                >
                  {ragChatLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching documents...
                    </span>
                  ) : (
                    "Search & Answer"
                  )}
                </button>
              </form>

              {ragChatError && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                  {ragChatError}
                </div>
              )}

              {ragReply && (
                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-2">
                    Answer from your documents
                  </h3>
                  <p className="text-slate-100 leading-relaxed">{ragReply}</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Safety disclaimer
                </h3>
                <p className="text-slate-300 leading-relaxed">{ragDisclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
