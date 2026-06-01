import { useEffect, useState } from "react";

const safetyText =
  "Informational support only. This system does not diagnose, treat, or replace professional medical advice.";

export default function App() {
  const [health, setHealth] = useState({ status: "loading" });
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`);
        const data = await response.json();
        setHealth({ status: "ready", data });
      } catch (error) {
        setHealth({
          status: "error",
          message: error instanceof Error ? error.message : "Failed to reach backend"
        });
      }
    };

    loadHealth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="mb-6 inline-flex w-fit rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm text-teal-200">
          Phase 1 foundation
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              AI Patient Care Intelligence System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We are building a modular healthcare support platform with AI chat, medical RAG,
              doctor voice analysis, hospital discovery, memory, automation, and agentic workflows.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-teal-950/20">
              <h2 className="text-lg font-medium text-white">Safety disclaimer</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{safetyText}</p>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Backend connection</h2>
            <div className="mt-4 rounded-2xl bg-slate-950 p-5">
              {health.status === "loading" && <p className="text-slate-300">Checking API status...</p>}

              {health.status === "ready" && (
                <div className="space-y-2">
                  <p className="text-emerald-400">Connected successfully</p>
                  <pre className="overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-slate-200">
                    {JSON.stringify(health.data, null, 2)}
                  </pre>
                </div>
              )}

              {health.status === "error" && (
                <div className="space-y-2">
                  <p className="text-red-400">Connection failed</p>
                  <p className="text-sm text-slate-300">{health.message}</p>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                Frontend: React + Vite
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                Backend: Express + PostgreSQL ready
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                Next phase: AI chat assistant
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
