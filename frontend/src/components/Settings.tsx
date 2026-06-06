interface SettingsProps {
  activeTab: string;
}

export default function Settings({ activeTab }: SettingsProps) {
  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">Settings</h1>
          <p className="text-onSurfaceVariant font-bodyMd">Manage your account preferences and application settings.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">Profile Information</h2>
          <div className="flex items-start gap-lg mb-lg">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[40px]">account_circle</span>
            </div>
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
                <div>
                  <label className="block text-labelSm text-onSurfaceVariant mb-xs">Full Name</label>
                  <input 
                    className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent" 
                    defaultValue="Alex Johnson" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-onSurfaceVariant mb-xs">Email</label>
                  <input 
                    className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent" 
                    defaultValue="alex.johnson@email.com" 
                    type="email" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-onSurfaceVariant mb-xs">Phone</label>
                  <input 
                    className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent" 
                    defaultValue="+1 (555) 123-4567" 
                    type="tel" 
                  />
                </div>
                <div>
                  <label className="block text-labelSm text-onSurfaceVariant mb-xs">Date of Birth</label>
                  <input 
                    className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent" 
                    defaultValue="1990-05-15" 
                    type="date" 
                  />
                </div>
              </div>
              <button className="px-lg py-md bg-primary text-white rounded-lg font-labelMd hover:opacity-90 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">Notification Preferences</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Medication Reminders</span>
                <p className="text-labelSm text-onSurfaceVariant">Get notified when it's time to take your medication</p>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Appointment Reminders</span>
                <p className="text-labelSm text-onSurfaceVariant">Receive reminders for upcoming appointments</p>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Health Alerts</span>
                <p className="text-labelSm text-onSurfaceVariant">Get alerts for important health updates</p>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Email Notifications</span>
                <p className="text-labelSm text-onSurfaceVariant">Receive notifications via email</p>
              </div>
              <button className="w-12 h-6 bg-outlineVariant rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">Privacy & Security</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Two-Factor Authentication</span>
                <p className="text-labelSm text-onSurfaceVariant">Add an extra layer of security to your account</p>
              </div>
              <button className="px-lg py-md bg-surfaceContainer text-onSurface rounded-lg font-labelMd hover:bg-surfaceContainerHigh transition-all">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Change Password</span>
                <p className="text-labelSm text-onSurfaceVariant">Update your password regularly</p>
              </div>
              <button className="px-lg py-md bg-surfaceContainer text-onSurface rounded-lg font-labelMd hover:bg-surfaceContainerHigh transition-all">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-sm border border-outlineVariant rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Data Export</span>
                <p className="text-labelSm text-onSurfaceVariant">Download your health data</p>
              </div>
              <button className="px-lg py-md bg-surfaceContainer text-onSurface rounded-lg font-labelMd hover:bg-surfaceContainerHigh transition-all">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm mb-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">App Preferences</h2>
          <div className="space-y-md">
            <div>
              <label className="block text-labelSm text-onSurfaceVariant mb-xs">Language</label>
              <select className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-labelSm text-onSurfaceVariant mb-xs">Time Zone</label>
              <select className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Eastern Time (ET)</option>
                <option>Pacific Time (PT)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
            <div>
              <label className="block text-labelSm text-onSurfaceVariant mb-xs">Units</label>
              <select className="w-full border border-outlineVariant rounded-lg px-lg py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Metric (kg, cm)</option>
                <option>Imperial (lbs, in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-crimsonRed rounded-xl p-lg shadow-sm">
          <h2 className="font-labelMd font-semibold text-crimsonRed mb-lg">Danger Zone</h2>
          <div className="space-y-md">
            <div className="flex items-center justify-between p-sm border border-crimsonRed/30 rounded-lg">
              <div>
                <span className="font-bodySm font-medium text-onSurface">Delete Account</span>
                <p className="text-labelSm text-onSurfaceVariant">Permanently delete your account and all data</p>
              </div>
              <button className="px-lg py-md bg-crimsonRed text-white rounded-lg font-labelMd hover:opacity-90 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
