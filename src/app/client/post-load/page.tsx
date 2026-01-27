'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function PostLoadPage() {
  const [formData, setFormData] = useState({
    loadType: '',
    weight: '',
    origin: '',
    destination: '',
    pickupDate: '',
    deliveryDate: '',
    specialRequirements: '',
    maxRate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Post A Load</h1>
              <p className="page-subtitle">Create a new load posting and connect with verified drivers</p>
            </div>
          </div>
        </div>
        <div className="card max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              {/* Simple truck representation */}
              <div className="w-8 h-6 border-2 border-white rounded-sm"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Your Load</h2>
            <p className="text-gray-600">Fill out the details below to post your load and get competitive bids from verified drivers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Load Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Load Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="loadType" className="block text-sm font-medium text-gray-700 mb-2">
                    Load Type *
                  </label>
                  <select
                    id="loadType"
                    name="loadType"
                    required
                    value={formData.loadType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select load type</option>
                    <option value="agricultural">Agricultural Products</option>
                    <option value="building">Building Materials</option>
                    <option value="mining">Mining Equipment</option>
                    <option value="general">General Freight</option>
                    <option value="hazardous">Hazardous Materials</option>
                    <option value="machinery">Heavy Machinery</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (tons) *
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    required
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. 5.5"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    required
                    value={formData.origin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Harare, Zimbabwe"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Bulawayo, Zimbabwe"
                  />
                </div>

                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    required
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Rate (USD) *
                  </label>
                  <input
                    type="number"
                    id="maxRate"
                    name="maxRate"
                    required
                    min="0"
                    value={formData.maxRate}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. 1000"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum amount you're willing to pay for this load</p>
                </div>

                <div>
                  <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <input
                    type="text"
                    id="specialRequirements"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Refrigerated truck, Crane required, etc."
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Load Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Provide additional details about the load..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+263 XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="btn-secondary"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8"
                >
                  Post Load
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}