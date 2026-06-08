interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "ai-assistant", label: "AI Assistant", icon: "smart_toy" },
    { id: "medical-reports", label: "Medical Reports", icon: "description" },
    { id: "medication", label: "Medication", icon: "pill" },
    { id: "health-timeline", label: "Health Timeline", icon: "timeline" },
    { id: "hospital-finder", label: "Hospital Finder", icon: "map" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="h-screen flex-shrink-0 glass-panel border-r border-white/50 flex flex-col py-lg px-md space-y-2 z-30" style={{ width: '260px' }}>
      <div className="mb-xl px-2">
        <h1 className="font-headlineLg text-headlineLg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">CareIntel AI</h1>
        <div className="flex items-center gap-2 mt-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-pill-pulse"></span>
          <span className="font-labelSm text-labelSm text-emerald-600 font-semibold uppercase tracking-wider">AI Agent Active</span>
        </div>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-md p-md rounded-xl font-labelMd transition-all scale-95 active:scale-90 ${
              activeTab === item.id
                ? "bg-blue-500/10 text-blue-600 border border-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.06)] font-bold"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-labelMd text-labelMd">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-lg border-t border-slate-200 space-y-1">
        <button className="w-full flex items-center justify-center gap-2 py-md px-lg bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          <span>Emergency Help</span>
        </button>
        <div className="mt-md space-y-1">
          <button className="w-full flex items-center gap-md p-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all font-labelMd">
            <span className="material-symbols-outlined">help</span>
            <span className="font-labelMd text-labelMd">Support</span>
          </button>
          <button className="w-full flex items-center gap-md p-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all font-labelMd">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-labelMd text-labelMd">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
