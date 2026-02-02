'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  companyName: string
  registrationNumber: string
  vatNumber: string
  industry: string
  companySize: string
  companyAddress: string
  companyDescription: string
  contactName: string
  jobTitle: string
  email: string
  phone: string
  altPhone: string
  website: string
  billingAddress: string
  paymentMethod: string
  creditLimit: number
  preferredCurrency: string
  paymentTerms: string
  loadTypes: string[]
  rating: number
  totalReviews: number
  memberSince: string
  totalLoads: number
  activeLoads: number
  completionRate: number
}

export default function ClientProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profile, setProfile] = useState<ProfileData>({
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    industry: 'Manufacturing',
    companySize: '1-10 employees',
    companyAddress: '',
    companyDescription: '',
    contactName: '',
    jobTitle: '',
    email: '',
    phone: '',
    altPhone: '',
    website: '',
    billingAddress: '',
    paymentMethod: 'Bank Transfer',
    creditLimit: 5000,
    preferredCurrency: 'USD - US Dollar',
    paymentTerms: 'Net 30 days',
    loadTypes: [],
    rating: 0,
    totalReviews: 0,
    memberSince: '',
    totalLoads: 0,
    activeLoads: 0,
    completionRate: 0
  })

  const allLoadTypes = [
    'General Cargo',
    'Electronics',
    'Furniture',
    'Food Products',
    'Construction Materials',
    'Raw Materials',
    'Vehicles',
    'Machinery',
    'Chemicals'
  ]

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Get user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      // Get client profile data
      const { data: clientData } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Get total loads count
      const { count: totalLoads } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)

      // Get active loads count
      const { count: activeLoads } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .in('status', ['pending', 'in_transit'])

      // Get completed loads count
      const { count: completedLoads } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .eq('status', 'delivered')

      const completionRate = totalLoads && totalLoads > 0
        ? Math.round((completedLoads || 0) / totalLoads * 100)
        : 100

      // Format member since date
      const memberSince = userData?.created_at 
        ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A'

      setProfile({
        companyName: clientData?.company_name || userData?.name || '',
        registrationNumber: clientData?.registration_number || '',
        vatNumber: clientData?.vat_number || '',
        industry: clientData?.industry || 'Manufacturing',
        companySize: clientData?.company_size || '1-10 employees',
        companyAddress: clientData?.company_address || '',
        companyDescription: clientData?.company_description || '',
        contactName: userData?.name || '',
        jobTitle: clientData?.job_title || '',
        email: userData?.email || user.email || '',
        phone: userData?.phone || clientData?.phone || '',
        altPhone: clientData?.alt_phone || '',
        website: clientData?.website || '',
        billingAddress: clientData?.billing_address || '',
        paymentMethod: clientData?.payment_method || 'Bank Transfer',
        creditLimit: clientData?.credit_limit || 5000,
        preferredCurrency: clientData?.preferred_currency || 'USD - US Dollar',
        paymentTerms: clientData?.payment_terms || 'Net 30 days',
        loadTypes: clientData?.load_types || [],
        rating: clientData?.rating || 4.5,
        totalReviews: clientData?.total_reviews || 0,
        memberSince,
        totalLoads: totalLoads || 0,
        activeLoads: activeLoads || 0,
        completionRate
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setMessage(null)

    try {
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: profile.contactName,
          email: profile.email,
          phone: profile.phone
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Upsert client profile
      const { error: profileError } = await supabase
        .from('client_profiles')
        .upsert({
          user_id: user.id,
          company_name: profile.companyName,
          registration_number: profile.registrationNumber,
          vat_number: profile.vatNumber,
          industry: profile.industry,
          company_size: profile.companySize,
          company_address: profile.companyAddress,
          company_description: profile.companyDescription,
          job_title: profile.jobTitle,
          phone: profile.phone,
          alt_phone: profile.altPhone,
          website: profile.website,
          billing_address: profile.billingAddress,
          payment_method: profile.paymentMethod,
          credit_limit: profile.creditLimit,
          preferred_currency: profile.preferredCurrency,
          payment_terms: profile.paymentTerms,
          load_types: profile.loadTypes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (profileError) throw profileError

      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleLoadTypeChange = (type: string) => {
    setProfile(prev => ({
      ...prev,
      loadTypes: prev.loadTypes.includes(type)
        ? prev.loadTypes.filter(t => t !== type)
        : [...prev.loadTypes, type]
    }))
  }

  const getInitials = () => {
    const words = profile.companyName?.split(' ') || []
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return profile.companyName?.substring(0, 2).toUpperCase() || 'CL'
  }

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Manage your company information and preferences</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="btn-primary mt-4 lg:mt-0 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Company Logo and Basic Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-content p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                      {getInitials()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{profile.companyName || 'Your Company'}</h3>
                  <p className="text-sm text-gray-600 mb-2">Transport Company</p>
                  <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-4">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{profile.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">({profile.totalReviews} reviews)</span>
                  </div>
                  <div className="text-left space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Member since:</span>
                      <span className="font-medium">{profile.memberSince}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total loads posted:</span>
                      <span className="font-medium">{profile.totalLoads}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completion rate:</span>
                      <span className="font-medium text-green-600">{profile.completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active loads:</span>
                      <span className="font-medium text-orange-600">{profile.activeLoads}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Company Information</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      value={profile.companyName}
                      onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                      className="input-field"
                      placeholder="Your Company Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input 
                      type="text" 
                      value={profile.registrationNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
                      className="input-field"
                      placeholder="REG123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VAT Number
                    </label>
                    <input 
                      type="text" 
                      value={profile.vatNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, vatNumber: e.target.value }))}
                      className="input-field"
                      placeholder="VAT987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select 
                      value={profile.industry}
                      onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className="input-field"
                    >
                      <option>Manufacturing</option>
                      <option>Retail</option>
                      <option>Agriculture</option>
                      <option>Construction</option>
                      <option>Mining</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select 
                      value={profile.companySize}
                      onChange={(e) => setProfile(prev => ({ ...prev, companySize: e.target.value }))}
                      className="input-field"
                    >
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address
                    </label>
                    <textarea 
                      rows={3}
                      value={profile.companyAddress}
                      onChange={(e) => setProfile(prev => ({ ...prev, companyAddress: e.target.value }))}
                      className="input-field"
                      placeholder="456 Industrial Road, Msasa, Harare, Zimbabwe"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea 
                      rows={4}
                      value={profile.companyDescription}
                      onChange={(e) => setProfile(prev => ({ ...prev, companyDescription: e.target.value }))}
                      className="input-field"
                      placeholder="Describe your company and services..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Contact Information</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Contact Name
                    </label>
                    <input 
                      type="text" 
                      value={profile.contactName}
                      onChange={(e) => setProfile(prev => ({ ...prev, contactName: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input 
                      type="text" 
                      value={profile.jobTitle}
                      onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="input-field"
                      placeholder="Operations Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                      placeholder="+263 24 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative Phone
                    </label>
                    <input 
                      type="tel" 
                      value={profile.altPhone}
                      onChange={(e) => setProfile(prev => ({ ...prev, altPhone: e.target.value }))}
                      className="input-field"
                      placeholder="+263 77 987 6543"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input 
                      type="url" 
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Billing Information</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Address
                    </label>
                    <textarea 
                      rows={3}
                      value={profile.billingAddress}
                      onChange={(e) => setProfile(prev => ({ ...prev, billingAddress: e.target.value }))}
                      className="input-field"
                      placeholder="Same as company address"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select 
                      value={profile.paymentMethod}
                      onChange={(e) => setProfile(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="input-field"
                    >
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Mobile Money</option>
                      <option>Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Limit (USD)
                    </label>
                    <input 
                      type="number" 
                      value={profile.creditLimit}
                      onChange={(e) => setProfile(prev => ({ ...prev, creditLimit: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Currency
                    </label>
                    <select 
                      value={profile.preferredCurrency}
                      onChange={(e) => setProfile(prev => ({ ...prev, preferredCurrency: e.target.value }))}
                      className="input-field"
                    >
                      <option>USD - US Dollar</option>
                      <option>ZWL - Zimbabwean Dollar</option>
                      <option>ZAR - South African Rand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms
                    </label>
                    <select 
                      value={profile.paymentTerms}
                      onChange={(e) => setProfile(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="input-field"
                    >
                      <option>Net 30 days</option>
                      <option>Net 15 days</option>
                      <option>Net 7 days</option>
                      <option>Payment on delivery</option>
                      <option>Advance payment</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Load Preferences</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Load Types You Usually Ship
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allLoadTypes.map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profile.loadTypes.includes(type)}
                          onChange={() => handleLoadTypeChange(type)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}