import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  
  // Local state for all forms
  const [formData, setFormData] = useState({
    // Profile
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@edumanage.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    role: 'System Administrator',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    
    // Notifications
    emailNotifications: true,
    assignmentDeadline: true,
    attendanceAlert: false,
    gradeUpdate: true,
    systemAnnouncement: true,
    
    // Preferences
    theme: 'system',
    language: 'en',
    timezone: 'UTC-5',
    academicYear: '2023-2024'
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSecurity = () => {
    const errors = {};
    if (!formData.currentPassword.trim()) errors.currentPassword = 'Required';
    if (!formData.newPassword.trim()) errors.newPassword = 'Required';
    if (formData.newPassword !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (validateProfile()) {
      alert('Profile Settings saved successfully to local state!');
    }
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (validateSecurity()) {
      alert('Security Settings updated successfully to local state!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    alert('Notification Preferences saved successfully to local state!');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    alert('System Preferences saved successfully to local state!');
  };

  const handleEditPermissions = (role) => {
    alert(`Editing permissions for ${role} role (Dummy Action)`);
  };

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
            <form onSubmit={handleSaveProfile} className="animate-in fade-in duration-300 space-y-6">
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
                  <label className="font-label-sm text-on-surface-variant block mb-1">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full bg-surface border ${formErrors.firstName ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.firstName && <p className="text-error text-xs mt-1">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full bg-surface border ${formErrors.lastName ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.lastName && <p className="text-error text-xs mt-1">{formErrors.lastName}</p>}
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-surface border ${formErrors.email ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.email && <p className="text-error text-xs mt-1">{formErrors.email}</p>}
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
                  <input type="text" name="role" value={formData.role} disabled className="w-full bg-surface-variant text-on-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-body-md outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-container-highest">
                <button type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === 'Security' && (
            <form onSubmit={handleSaveSecurity} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Account Security</h3>
              
              <div className="space-y-4 max-w-md mb-8">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Current Password *</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.currentPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.currentPassword && <p className="text-error text-xs mt-1">{formErrors.currentPassword}</p>}
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">New Password *</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.newPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.newPassword && <p className="text-error text-xs mt-1">{formErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Confirm New Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full bg-surface border ${formErrors.confirmPassword ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none`} />
                  {formErrors.confirmPassword && <p className="text-error text-xs mt-1">{formErrors.confirmPassword}</p>}
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
            <form onSubmit={handleSaveNotifications} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">Notification Preferences</h3>
              
              <div className="space-y-6">
                {[
                  { name: 'emailNotifications', label: 'Email Notifications', desc: 'Receive critical account and system updates via email.' },
                  { name: 'assignmentDeadline', label: 'Assignment Deadline Reminders', desc: 'Get alerted 24 hours before an assignment is due.' },
                  { name: 'attendanceAlert', label: 'Attendance Alerts', desc: 'Notify when attendance drops below the required threshold.' },
                  { name: 'gradeUpdate', label: 'Grade Update Notifications', desc: 'Alert when a new grade is published.' },
                  { name: 'systemAnnouncement', label: 'System Announcements', desc: 'Receive notifications about maintenance and updates.' }
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
                <button type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Notification Settings
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
            <form onSubmit={handleSavePreferences} className="animate-in fade-in duration-300 space-y-6">
              <h3 className="font-headline-md text-primary mb-6 border-b border-surface-container-highest pb-2">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <SelectField
                  label="Language"
                  wrapperClassName="relative"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="id">Indonesian</option>
                </SelectField>
                <SelectField
                  label="Timezone"
                  wrapperClassName="relative"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="UTC-8">Pacific Time (PT) UTC-8</option>
                  <option value="UTC-5">Eastern Time (ET) UTC-5</option>
                  <option value="UTC+0">Coordinated Universal Time (UTC)</option>
                  <option value="UTC+7">Western Indonesia Time (WIB) UTC+7</option>
                </SelectField>
                <SelectField
                  label="Theme"
                  wrapperClassName="relative"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">Use System Default</option>
                </SelectField>
                <SelectField
                  label="Academic Year"
                  wrapperClassName="relative"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                >
                  <option value="2022-2023">2022 - 2023</option>
                  <option value="2023-2024">2023 - 2024</option>
                  <option value="2024-2025">2024 - 2025</option>
                </SelectField>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-container-highest">
                <button type="submit" className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save System Preferences
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
