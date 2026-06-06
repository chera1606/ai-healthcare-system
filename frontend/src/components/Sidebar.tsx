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
    <aside className="h-screen flex-shrink-0 bg-surfaceContainerLow border-r border-outlineVariant flex flex-col py-lg px-md space-y-2 z-30" style={{ width: '260px' }}>
      <div className="mb-xl px-2">
        <h1 className="font-headlineLg text-headlineLg font-black text-primary">CareIntel AI</h1>
        <div className="flex items-center gap-2 mt-sm">
          <span className="w-2 h-2 rounded-full bg-secondary status-pill-pulse"></span>
          <span className="font-labelSm text-labelSm text-secondary uppercase tracking-wider">AI Agent Active</span>
        </div>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-md p-md rounded-xl font-labelMd transition-all scale-95 active:scale-90 ${
              activeTab === item.id
                ? "bg-primaryContainer text-onPrimaryContainer"
                : "text-onSurfaceVariant hover:bg-surfaceContainerHigh"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-labelMd text-labelMd">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-lg border-t border-outlineVariant space-y-1">
        <button className="w-full flex items-center justify-center gap-2 py-md px-lg bg-error text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          <span>Emergency Help</span>
        </button>
        <div className="mt-md space-y-1">
          <button className="w-full flex items-center gap-md p-md text-onSurfaceVariant hover:bg-surfaceContainerHigh rounded-xl transition-all font-labelMd">
            <span className="material-symbols-outlined">help</span>
            <span className="font-labelMd text-labelMd">Support</span>
          </button>
          <button className="w-full flex items-center gap-md p-md text-onSurfaceVariant hover:bg-surfaceContainerHigh rounded-xl transition-all font-labelMd">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-labelMd text-labelMd">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
