interface SettingsProps {
  activeTab: string;
}

export default function Settings({ activeTab }: SettingsProps) {
  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">Settings</h1>
          <p className="text-slate-500 font-bodyMd">Manage your account preferences and application settings.</p>
        </div>

        {/* Profile Section */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">Profile Information</h2>
          <div className="flex items-start gap-lg mb-lg flex-wrap md:flex-nowrap">
            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-500 flex-shrink-0 mx-auto md:mx-0">
              <span className="material-symbols-outlined text-[40px]">account_circle</span>
            </div>
            <div className="flex-grow w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
                <div>
                  <label className="block text-labelSm text-slate-500 mb-xs">Full Name</label>
                  <input 
                    className="w-full glass-input rounded-lg px-lg py-md text-bodyMd" 
                    defaultValue="Alex Johnson" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-slate-500 mb-xs">Email</label>
                  <input 
                    className="w-full glass-input rounded-lg px-lg py-md text-bodyMd" 
                    defaultValue="alex.johnson@email.com" 
                    type="email" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-slate-500 mb-xs">Phone</label>
                  <input 
                    className="w-full glass-input rounded-lg px-lg py-md text-bodyMd" 
                    defaultValue="+1 (555) 123-4567" 
                    type="tel" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-slate-500 mb-xs">Date of Birth</label>
                  <input 
                    className="w-full glass-input rounded-lg px-lg py-md text-bodyMd" 
                    defaultValue="1990-05-15" 
                    type="date" 
                  />
                </div>
              </div>
              <button className="px-lg py-md bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-labelMd hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/15">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">Notification Preferences</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Medication Reminders</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Get notified when it's time to take your medication</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-all duration-300 shadow-sm shadow-blue-500/20">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Appointment Reminders</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Receive reminders for upcoming appointments</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-all duration-300 shadow-sm shadow-blue-500/20">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Health Alerts</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Get alerts for important health updates</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-all duration-300 shadow-sm shadow-blue-500/20">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Email Notifications</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Receive notifications via email</p>
              </div>
              <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-all duration-300">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">Privacy & Security</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Two-Factor Authentication</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
              </div>
              <button className="px-lg py-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/60 rounded-lg font-labelMd transition-all active:scale-[0.98]">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Change Password</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Update your password regularly</p>
              </div>
              <button className="px-lg py-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/60 rounded-lg font-labelMd transition-all active:scale-[0.98]">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-slate-200/60 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Data Export</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Download your health data</p>
              </div>
              <button className="px-lg py-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/60 rounded-lg font-labelMd transition-all active:scale-[0.98]">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">App Preferences</h2>
          <div className="space-y-md">
            <div>
              <label className="block text-labelSm text-slate-500 mb-xs">Language</label>
              <select className="w-full glass-input rounded-lg px-lg py-md text-bodyMd cursor-pointer appearance-none">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-labelSm text-slate-500 mb-xs">Time Zone</label>
              <select className="w-full glass-input rounded-lg px-lg py-md text-bodyMd cursor-pointer appearance-none">
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
            <div>
              <label className="block text-labelSm text-slate-500 mb-xs">Units</label>
              <select className="w-full glass-input rounded-lg px-lg py-md text-bodyMd cursor-pointer appearance-none">
                <option>Metric (kg, cm)</option>
                <option>Imperial (lbs, in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-lg shadow-sm">
          <h2 className="font-labelMd font-semibold text-rose-600 mb-lg">Danger Zone</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-rose-200/40 rounded-lg flex-wrap gap-4">
              <div>
                <span className="font-bodySm font-medium text-slate-800">Delete Account</span>
                <p className="text-labelSm text-slate-500 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button className="px-lg py-md bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-labelMd transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-500/20">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
