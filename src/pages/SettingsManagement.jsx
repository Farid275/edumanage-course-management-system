import React, { useState } from 'react';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@edumanage.edu',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    twoFactorAuth: false,
    theme: 'system',
    language: 'en'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-section-margin relative">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-card-gap">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary">Settings</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your account preferences and system configurations.</p>
          </div>
          <button 
            onClick={handleSave}
            className="bg-primary text-white font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
            Save Settings
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-2">
            {[
              { id: 'Profile', icon: 'person' },
              { id: 'Security', icon: 'lock' },
              { id: 'Notifications', icon: 'notifications' },
              { id: 'Preferences', icon: 'settings' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md transition-colors text-left ${activeTab === tab.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-variant'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.02)] min-h-[500px]">
            <form onSubmit={handleSave} className="space-y-6">
              
              {activeTab === 'Profile' && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Profile Information</h3>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary font-headline-lg">
                      AU
                    </div>
                    <div>
                      <button type="button" className="bg-surface border border-outline text-primary font-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors">
                        Change Photo
                      </button>
                      <p className="font-body-sm text-on-surface-variant mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Current Password</label>
                      <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">New Password</label>
                      <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                    </div>
                  </div>

                  <h3 className="font-headline-md text-primary mt-10 mb-6 border-b border-surface-container-highest pb-2">Two-Factor Authentication</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" name="twoFactorAuth" checked={formData.twoFactorAuth} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <div>
                      <div className="font-body-md text-on-surface">Enable Two-Factor Authentication</div>
                      <div className="font-body-sm text-on-surface-variant">Adds an extra layer of security to your account.</div>
                    </div>
                  </label>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <div>
                        <div className="font-body-md text-on-surface">Email Notifications</div>
                        <div className="font-body-sm text-on-surface-variant">Receive daily summaries and critical alerts via email.</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="smsNotifications" checked={formData.smsNotifications} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <div>
                        <div className="font-body-md text-on-surface">SMS Notifications</div>
                        <div className="font-body-sm text-on-surface-variant">Get text messages for urgent system outages.</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="systemAlerts" checked={formData.systemAlerts} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <div>
                        <div className="font-body-md text-on-surface">In-App System Alerts</div>
                        <div className="font-body-sm text-on-surface-variant">Show red notification dots on the dashboard.</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'Preferences' && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">System Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Theme</label>
                      <select name="theme" value={formData.theme} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none">
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">Use System Default</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant block mb-1">Language</label>
                      <select name="language" value={formData.language} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none">
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="id">Indonesian</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
  );
};

export default SettingsManagement;
