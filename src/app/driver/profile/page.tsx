'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  licenseExpiry: string
  vehicleType: string
  vehicleMake: string
  vehicleYear: string
  licensePlate: string
  capacity: number
  insuranceExpiry: string
  bio: string
  yearsExperience: number
  ratePerKm: number
  specializations: string[]
  rating: number
  totalReviews: number
  memberSince: string
  totalTrips: number
  successRate: number
}

export default function DriverProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: 'Truck (7 tonnes)',
    vehicleMake: '',
    vehicleYear: '',
    licensePlate: '',
    capacity: 7,
    insuranceExpiry: '',
    bio: '',
    yearsExperience: 0,
    ratePerKm: 1.85,
    specializations: [],
    rating: 0,
    totalReviews: 0,
    memberSince: '',
    totalTrips: 0,
    successRate: 0
  })

  const allSpecializations = [
    'General Freight',
    'Refrigerated',
    'Fragile Items',
    'Bulk Cargo',
    'Construction Materials',
    'Agricultural Products'
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

      // Get driver profile data
      const { data: driverData } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Get completed trips count
      const { count: tripCount } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('driver_id', user.id)
        .eq('status', 'delivered')

      // Calculate success rate (delivered vs total assigned)
      const { count: totalAssigned } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('driver_id', user.id)

      const successRate = totalAssigned && totalAssigned > 0 
        ? Math.round((tripCount || 0) / totalAssigned * 100) 
        : 100

      // Parse name
      const nameParts = userData?.name?.split(' ') || ['', '']
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Format member since date
      const memberSince = userData?.created_at 
        ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A'

      setProfile({
        firstName,
        lastName,
        email: userData?.email || user.email || '',
        phone: userData?.phone || driverData?.phone || '',
        address: driverData?.address || '',
        licenseNumber: driverData?.license_number || '',
        licenseExpiry: driverData?.license_expiry || '',
        vehicleType: driverData?.vehicle_type || 'Truck (7 tonnes)',
        vehicleMake: driverData?.vehicle_make || '',
        vehicleYear: driverData?.vehicle_year || '',
        licensePlate: driverData?.license_plate || '',
        capacity: driverData?.capacity || 7,
        insuranceExpiry: driverData?.insurance_expiry || '',
        bio: driverData?.bio || '',
        yearsExperience: driverData?.years_experience || 0,
        ratePerKm: driverData?.rate_per_km || 1.85,
        specializations: driverData?.specializations || [],
        rating: driverData?.rating || 4.5,
        totalReviews: driverData?.total_reviews || 0,
        memberSince,
        totalTrips: tripCount || 0,
        successRate
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
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          email: profile.email,
          phone: profile.phone
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Upsert driver profile
      const { error: profileError } = await supabase
        .from('driver_profiles')
        .upsert({
          user_id: user.id,
          phone: profile.phone,
          address: profile.address,
          license_number: profile.licenseNumber,
          license_expiry: profile.licenseExpiry || null,
          vehicle_type: profile.vehicleType,
          vehicle_make: profile.vehicleMake,
          vehicle_year: profile.vehicleYear,
          license_plate: profile.licensePlate,
          capacity: profile.capacity,
          insurance_expiry: profile.insuranceExpiry || null,
          bio: profile.bio,
          years_experience: profile.yearsExperience,
          rate_per_km: profile.ratePerKm,
          specializations: profile.specializations,
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

  const handleSpecializationChange = (spec: string) => {
    setProfile(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }))
  }

  const getInitials = () => {
    const firstInitial = profile.firstName?.[0] || ''
    const lastInitial = profile.lastName?.[0] || ''
    return (firstInitial + lastInitial).toUpperCase() || 'DR'
  }

  if (loading) {
    return (
      <DashboardLayout userType="driver">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="driver">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Manage your personal information and preferences</p>
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
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-content p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                      {getInitials()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Professional Driver</p>
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
                      <span className="text-gray-600">Total trips:</span>
                      <span className="font-medium">{profile.totalTrips}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Success rate:</span>
                      <span className="font-medium text-green-600">{profile.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Personal Information</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
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
                      placeholder="+263 77 123 4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea 
                      rows={3}
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      className="input-field"
                      placeholder="123 Main Street, Harare, Zimbabwe"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input 
                      type="text" 
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="input-field"
                      placeholder="DL12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Expiry
                    </label>
                    <input 
                      type="date" 
                      value={profile.licenseExpiry}
                      onChange={(e) => setProfile(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Vehicle Information</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select 
                      value={profile.vehicleType}
                      onChange={(e) => setProfile(prev => ({ ...prev, vehicleType: e.target.value }))}
                      className="input-field"
                    >
                      <option>Truck (7 tonnes)</option>
                      <option>Van (3 tonnes)</option>
                      <option>Pickup (1 tonne)</option>
                      <option>Heavy Truck (15+ tonnes)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make & Model
                    </label>
                    <input 
                      type="text" 
                      value={profile.vehicleMake}
                      onChange={(e) => setProfile(prev => ({ ...prev, vehicleMake: e.target.value }))}
                      className="input-field"
                      placeholder="Isuzu NPR 400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input 
                      type="text" 
                      value={profile.vehicleYear}
                      onChange={(e) => setProfile(prev => ({ ...prev, vehicleYear: e.target.value }))}
                      className="input-field"
                      placeholder="2019"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate
                    </label>
                    <input 
                      type="text" 
                      value={profile.licensePlate}
                      onChange={(e) => setProfile(prev => ({ ...prev, licensePlate: e.target.value }))}
                      className="input-field"
                      placeholder="ABC-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity (tonnes)
                    </label>
                    <input 
                      type="number" 
                      value={profile.capacity}
                      onChange={(e) => setProfile(prev => ({ ...prev, capacity: parseFloat(e.target.value) || 0 }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Expiry
                    </label>
                    <input 
                      type="date" 
                      value={profile.insuranceExpiry}
                      onChange={(e) => setProfile(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Professional Details</h2>
              </div>
              <div className="card-content p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea 
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="input-field"
                    placeholder="Tell potential clients about your experience..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input 
                      type="number" 
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate per KM (USD)
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={profile.ratePerKm}
                      onChange={(e) => setProfile(prev => ({ ...prev, ratePerKm: parseFloat(e.target.value) || 0 }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allSpecializations.map((specialization) => (
                      <label key={specialization} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profile.specializations.includes(specialization)}
                          onChange={() => handleSpecializationChange(specialization)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{specialization}</span>
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