'use client';

import { useState } from 'react';
import { User, Building, Mail, Lock, Palette, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'company', name: 'Company', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <p className="text-sm text-gray-600">Update your personal information and contact details</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="input"
              defaultValue="John Doe"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="input"
              defaultValue="johndoe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="input"
            defaultValue="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="input"
            defaultValue="+1 (555) 123-4567"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function CompanySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
        <p className="text-sm text-gray-600">Update your company details that appear on invoices</p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            className="input"
            placeholder="Your Company Name"
          />
        </div>

        <div>
          <label htmlFor="company_address" className="block text-sm font-medium text-gray-700 mb-1">
            Company Address
          </label>
          <textarea
            name="company_address"
            id="company_address"
            rows={4}
            className="input"
            placeholder="Enter your company address"
          />
        </div>

        <div>
          <label htmlFor="company_logo" className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-600">Choose when and how you want to be notified</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
          <div className="mt-4 space-y-3">
            {[
              { id: 'invoice_sent', label: 'When invoices are sent', description: 'Get notified when invoices are successfully sent to customers' },
              { id: 'invoice_paid', label: 'When invoices are paid', description: 'Receive notifications when customers pay their invoices' },
              { id: 'invoice_overdue', label: 'When invoices become overdue', description: 'Get reminded when invoices pass their due date' },
              { id: 'new_customer', label: 'When new customers are added', description: 'Be notified when new customers are added to your account' },
            ].map((setting) => (
              <div key={setting.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={setting.id}
                    name={setting.id}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked={true}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor={setting.id} className="text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
        <p className="text-sm text-gray-600">Customize the look and feel of your application</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-base font-medium text-gray-900">Theme</label>
          <p className="text-sm text-gray-600">Select your preferred theme</p>
          <div className="mt-4 space-y-2">
            {[
              { id: 'light', label: 'Light', description: 'Clean and bright interface' },
              { id: 'dark', label: 'Dark', description: 'Easy on the eyes in low light' },
              { id: 'auto', label: 'Auto', description: 'Matches your system preference' },
            ].map((theme) => (
              <div key={theme.id} className="flex items-center">
                <input
                  id={theme.id}
                  name="theme"
                  type="radio"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  defaultChecked={theme.id === 'light'}
                />
                <div className="ml-3">
                  <label htmlFor={theme.id} className="text-sm font-medium text-gray-700">
                    {theme.label}
                  </label>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security</h3>
        <p className="text-sm text-gray-600">Manage your account security and password</p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="current_password"
            id="current_password"
            className="input"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="new_password"
            id="new_password"
            className="input"
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className="input"
            placeholder="Confirm your new password"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button type="button" className="btn btn-secondary">
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}