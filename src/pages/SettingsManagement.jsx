import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [authUser, setAuthUser] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    email: '',
    
    theme: 'Light',
    language: 'English',
    timezone: 'Asia/Jakarta',
    dashboard_view: 'Default',
    email_notifications: true,
    push_notifications: false,
    
    // Mock UI fields
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    academicYear: '2023-2024'
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError) {
        console.error('Supabase get user error:', userError);
        setError(userError.message);
        return;
      }
  
      if (!user) {
        setError('No authenticated user found');
        return;
      }
  
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .eq('id', user.id)
        .single();
  
      if (profileError) {
        console.error('Supabase profile fetch error:', profileError);
        setError(profileError.message);
        return;
      }
  
      let { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
  
      if (preferencesError) {
        console.error('Supabase preferences fetch error:', preferencesError);
        setError(preferencesError.message);
        return;
      }
  
      if (!preferences) {
        const { data: createdPreferences, error: createPreferencesError } = await supabase
          .from('user_preferences')
          .insert([{
            user_id: user.id,
            theme: 'Light',
            language: 'English',
            timezone: 'Asia/Jakarta',
            email_notifications: true,
            push_notifications: false,
            dashboard_view: 'Default'
          }])
          .select()
          .single();
  
        if (createPreferencesError) {
          console.error('Supabase preferences create error:', createPreferencesError);
          setError(createPreferencesError.message);
          return;
        }
  
        preferences = createdPreferences;
      }
  
      setAuthUser(user);
      
      setFormData(prev => ({
        ...prev,
        full_name: profile?.full_name || '',
        role: profile?.role || '',
        email: user?.email || '',
        theme: preferences?.theme || 'Light',
        language: preferences?.language || 'English',
        timezone: preferences?.timezone || 'Asia/Jakarta',
        dashboard_view: preferences?.dashboard_view || 'Default',
        email_notifications: preferences?.email_notifications ?? true,
        push_notifications: preferences?.push_notifications ?? false,
      }));
  
    } catch (err) {
      console.error('Settings unexpected error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
  
    try {
      const fullName = String(formData.full_name || '').trim();
  
      if (!fullName) {
        alert('Full name is required');
        setSaving(false);
        return;
      }
  
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName
        })
        .eq('id', authUser.id);
  
      if (profileUpdateError) {
        console.error('Supabase profile update error:', profileUpdateError);
        alert(profileUpdateError.message);
        setSaving(false);
        return;
      }
  
      const { error: preferencesUpdateError } = await supabase
        .from('user_preferences')
        .update({
          theme: formData.theme || 'Light',
          language: formData.language || 'English',
          timezone: formData.timezone || 'Asia/Jakarta',
          email_notifications: Boolean(formData.email_notifications),
          push_notifications: Boolean(formData.push_notifications),
          dashboard_view: formData.dashboard_view || 'Default'
        })
        .eq('user_id', authUser.id);
  
      if (preferencesUpdateError) {
        console.error('Supabase preferences update error:', preferencesUpdateError);
        alert(preferencesUpdateError.message);
        setSaving(false);
        return;
      }
  
      await fetchSettings();
      alert('Settings saved successfully');
  
    } catch (err) {
      console.error('Settings save unexpected error:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEditPermissions = (role) => {
    alert(`Editing permissions for ${role} role (Dummy Action)`);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 mt-10">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary mb-4">refresh</span>
          <p className="font-label-lg text-on-surface-variant">Loading settings...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 mt-10 bg-error-container/10 rounded-xl border border-error/30">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <p className="font-label-lg text-error">Failed to load settings: {error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Settings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your account preferences and system configurations.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {[
            { id: 'Profile', label: 'Profile Settings', icon: 'person' },
            { id: 'Security', label: 'Account Security', icon: 'lock' },
            { id: 'Notifications', label: 'Notification Preferences', icon: 'notifications' },
            { id: 'Roles', label: 'Role and Permission', icon: 'admin_panel_settings' },
            { id: 'Preferences', label: 'System Preferences', icon: 'settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFormErrors({}); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md transition-colors text-left ${activeTab === tab.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white border border-surface-container-highest rounded-xl p-6 shadow-sm min-h-[500px]">
          
          {activeTab === 'Profile' && (
            <form onSubmit={saveSettings} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Profile Settings</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary font-headline-lg overflow-hidden">
                  <span className="material-symbols-outlined text-[40px]">person</span>
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
                  <label className="font-label-sm text-on-surface-variant block mb-1">Full Name *</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className={`w-full bg-surface border ${formErrors.full_name ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.full_name && <p className="text-error text-xs mt-1">{formErrors.full_name}</p>}
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Email Address (Read Only)</label>
                  <input type="email" name="email" value={formData.email} disabled className="w-full bg-surface-variant text-on-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-body-md outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Role (Read Only)</label>
                  <input type="text" name="role" value={formData.role} disabled className="w-full bg-surface-variant text-on-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-body-md outline-none cursor-not-allowed capitalize" />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-container-highest">
                <button disabled={saving} type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'Security' && (
            <form onSubmit={(e) => { e.preventDefault(); alert("Security credentials mock (non-functional for demo)."); }} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Account Security</h3>
              
              <div className="space-y-4 max-w-md mb-8">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Current Password *</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.currentPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">New Password *</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.newPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Confirm New Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.confirmPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                </div>
              </div>

              <div className="mb-8">
                <button type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  Change Password
                </button>
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
            </form>
          )}

          {activeTab === 'Notifications' && (
            <form onSubmit={saveSettings} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Notification Preferences</h3>
              
              <div className="space-y-6">
                {[
                  { name: 'email_notifications', label: 'Email Notifications', desc: 'Receive critical account and system updates via email.' },
                  { name: 'push_notifications', label: 'Push Notifications', desc: 'Get alerted via desktop push notifications.' }
                ].map(toggle => (
                  <label key={toggle.name} className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <input type="checkbox" name={toggle.name} checked={formData[toggle.name]} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <div>
                      <div className="font-body-md text-on-surface">{toggle.label}</div>
                      <div className="font-body-sm text-on-surface-variant">{toggle.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-surface-container-highest">
                <button disabled={saving} type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'Roles' && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Role and Permission Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Admin Role */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col h-full shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <h4 className="font-headline-sm text-primary">Admin</h4>
                  </div>
                  <ul className="text-body-sm text-on-surface-variant space-y-2 flex-grow mb-6 list-disc pl-5">
                    <li>Full system access</li>
                    <li>Manage all users and roles</li>
                    <li>Modify system configurations</li>
                    <li>Access all reports globally</li>
                  </ul>
                  <button onClick={() => handleEditPermissions('Admin')} className="w-full py-2 bg-surface-variant text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">
                    Edit Permissions
                  </button>
                </div>

                {/* Lecturer Role */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col h-full shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">school</span>
                    </div>
                    <h4 className="font-headline-sm text-primary">Lecturer</h4>
                  </div>
                  <ul className="text-body-sm text-on-surface-variant space-y-2 flex-grow mb-6 list-disc pl-5">
                    <li>Manage assigned courses</li>
                    <li>Input and edit grades</li>
                    <li>Upload learning materials</li>
                    <li>Generate course reports</li>
                  </ul>
                  <button onClick={() => handleEditPermissions('Lecturer')} className="w-full py-2 bg-surface-variant text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">
                    Edit Permissions
                  </button>
                </div>

                {/* Student Role */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col h-full shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <h4 className="font-headline-sm text-primary">Student</h4>
                  </div>
                  <ul className="text-body-sm text-on-surface-variant space-y-2 flex-grow mb-6 list-disc pl-5">
                    <li>View enrolled courses</li>
                    <li>Submit assignments</li>
                    <li>View own grades</li>
                    <li>Download materials</li>
                  </ul>
                  <button onClick={() => handleEditPermissions('Student')} className="w-full py-2 bg-surface-variant text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">
                    Edit Permissions
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <form onSubmit={saveSettings} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <SelectField
                  label="Language"
                  wrapperClassName="relative"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Indonesian">Indonesian</option>
                </SelectField>
                <SelectField
                  label="Timezone"
                  wrapperClassName="relative"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
                  <option value="America/New_York">Eastern Time (America/New_York)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="Asia/Jakarta">Western Indonesia Time (Asia/Jakarta)</option>
                </SelectField>
                <SelectField
                  label="Theme"
                  wrapperClassName="relative"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                >
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode</option>
                  <option value="System">Use System Default</option>
                </SelectField>
                <SelectField
                  label="Dashboard View"
                  wrapperClassName="relative"
                  name="dashboard_view"
                  value={formData.dashboard_view}
                  onChange={handleChange}
                >
                  <option value="Default">Default</option>
                  <option value="Compact">Compact</option>
                </SelectField>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-container-highest">
                <button disabled={saving} type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {saving ? 'Saving...' : 'Save System Preferences'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </PageContainer>
  );
};

export default SettingsManagement;
