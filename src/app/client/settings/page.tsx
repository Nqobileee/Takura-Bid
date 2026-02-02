'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface UserSettings {
  email_notifications: boolean
  sms_alerts: boolean
  push_notifications: boolean
  profile_visible: boolean
  auto_match_drivers: boolean
  preferred_payment: 'cash' | 'ecocash' | 'bank_transfer'
  dark_mode: boolean
  language: string
  currency: 'USD' | 'ZWL'
}

const defaultSettings: UserSettings = {
  email_notifications: true,
  sms_alerts: false,
  push_notifications: true,
  profile_visible: true,
  auto_match_drivers: true,
  preferred_payment: 'ecocash',
  dark_mode: false,
  language: 'en',
  currency: 'USD'
}

export default function ClientSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'account' | 'privacy'>('notifications')

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setSettings({
          email_notifications: data.email_notifications ?? true,
          sms_alerts: data.sms_alerts ?? false,
          push_notifications: data.push_notifications ?? true,
          profile_visible: data.profile_visible ?? true,
          auto_match_drivers: data.auto_match_drivers ?? true,
          preferred_payment: data.preferred_payment ?? 'ecocash',
          dark_mode: data.dark_mode ?? false,
          language: data.language ?? 'en',
          currency: data.currency ?? 'USD'
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!user) return
    setSaving(true)
    setSaved(false)

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleSetting = (key: keyof UserSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account preferences and notifications</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                saved 
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </span>
              ) : saved ? (
                <span className="flex items-center space-x-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Saved!</span>
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl border border-gray-200 p-2 sticky top-24">
              {[
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                { id: 'account', label: 'Account', icon: '👤' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-6">
                  <ToggleSetting
                    title="Email Notifications"
                    description="Receive updates about your loads and driver responses"
                    enabled={settings.email_notifications}
                    onToggle={() => toggleSetting('email_notifications')}
                  />
                  <ToggleSetting
                    title="SMS Alerts"
                    description="Get SMS alerts when drivers accept your loads"
                    enabled={settings.sms_alerts}
                    onToggle={() => toggleSetting('sms_alerts')}
                  />
                  <ToggleSetting
                    title="Push Notifications"
                    description="Enable browser push notifications for real-time updates"
                    enabled={settings.push_notifications}
                    onToggle={() => toggleSetting('push_notifications')}
                  />
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Load Preferences</h2>
                  <div className="space-y-6">
                    <ToggleSetting
                      title="Auto-Match Drivers"
                      description="Automatically suggest best-matched drivers for your loads"
                      enabled={settings.auto_match_drivers}
                      onToggle={() => toggleSetting('auto_match_drivers')}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Preferred Payment Method
                      </label>
                      <p className="text-sm text-gray-500 mb-4">
                        Default payment method for new loads
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { id: 'cash', label: 'Cash', icon: '💵' },
                          { id: 'ecocash', label: 'EcoCash', icon: '📱' },
                          { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' }
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => updateSetting('preferred_payment', method.id as typeof settings.preferred_payment)}
                            className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all border ${
                              settings.preferred_payment === method.id
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-medium">{method.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Display Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Preferred Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value as 'USD' | 'ZWL')}
                        className="w-full md:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="ZWL">ZWL (ZiG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full md:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="sn">Shona</option>
                        <option value="nd">Ndebele</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Address</h3>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <button className="text-sm text-gray-900 font-medium hover:underline">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Password</h3>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                      <button className="text-sm text-gray-900 font-medium hover:underline">
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add extra security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                        Enable
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h3 className="font-medium text-red-900">Danger Zone</h3>
                    <p className="text-sm text-red-600 mt-1 mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <ToggleSetting
                    title="Profile Visibility"
                    description="Allow drivers to view your company profile"
                    enabled={settings.profile_visible}
                    onToggle={() => toggleSetting('profile_visible')}
                  />

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <h3 className="font-medium text-orange-900 flex items-center space-x-2">
                      <span>ℹ️</span>
                      <span>Data Privacy</span>
                    </h3>
                    <p className="text-sm text-orange-700 mt-2">
                      Your data is securely stored and never shared with third parties without your consent.
                      We comply with Zimbabwe&apos;s data protection regulations.
                    </p>
                  </div>

                  <div>
                    <button className="text-sm text-gray-900 font-medium hover:underline">
                      Download My Data
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Get a copy of all data associated with your account
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Toggle Setting Component
function ToggleSetting({ 
  title, 
  description, 
  enabled, 
  onToggle 
}: { 
  title: string
  description: string
  enabled: boolean
  onToggle: () => void 
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
          enabled ? 'bg-green-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
