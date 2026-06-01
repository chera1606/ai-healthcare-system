import { useState } from "react";

const initialDisclaimer =
  "Informational support only. This system does not diagnose, treat, or replace professional medical advice.";

export default function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [disclaimer, setDisclaimer] = useState(initialDisclaimer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setError("Please type a message first.");
      return;
    }

    setLoading(true);
    setError("");
    setReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setReply(data.reply);
      setDisclaimer(data.disclaimer || initialDisclaimer);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <div className="mb-6 inline-flex w-fit rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm text-teal-200">
          Phase 2: Basic AI Chat Foundation
        </div>

        <h1 className="text-4xl font-semibold text-white md:text-6xl">
          Talk to the Health Assistant
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          This version does not use real AI yet. It teaches the full request flow from React to
          Express and back again.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Your health question
              </span>
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Example: What should I know about fever?"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-teal-500 px-5 py-3 font-medium text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          {reply && (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                Backend reply
              </h2>
              <p className="mt-2 leading-7 text-slate-100">{reply}</p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Safety disclaimer
            </h2>
            <p className="mt-2 leading-7 text-slate-300">{disclaimer}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
