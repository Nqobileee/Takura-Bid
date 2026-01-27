'use client'

interface Driver {
  id: string
  name: string
  rating: number
  completedJobs: number
  speciality: string
  location: string
  available: boolean
  truckType: string
  image?: string
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Tendai Mukamuri',
    rating: 4.8,
    completedJobs: 156,
    speciality: 'Heavy Equipment',
    location: 'Harare',
    available: true,
    truckType: 'Flatbed Truck'
  },
  {
    id: '2',
    name: 'Sarah Chikwanha',
    rating: 4.9,
    completedJobs: 203,
    speciality: 'Agricultural Products',
    location: 'Bulawayo',
    available: true,
    truckType: 'Covered Truck'
  },
  {
    id: '3',
    name: 'James Mutsvangwa',
    rating: 4.7,
    completedJobs: 89,
    speciality: 'Construction Materials',
    location: 'Mutare',
    available: false,
    truckType: 'Dump Truck'
  },
  {
    id: '4',
    name: 'Grace Moyo',
    rating: 4.6,
    completedJobs: 124,
    speciality: 'General Freight',
    location: 'Gweru',
    available: true,
    truckType: 'Box Truck'
  },
]

interface DriverCardProps {
  driver: Driver
  onSelect: (driver: Driver) => void
}

function DriverCard({ driver, onSelect }: DriverCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {driver.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
            <p className="text-sm text-gray-500">{driver.location}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          driver.available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {driver.available ? 'Available' : 'Busy'}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Rating</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-medium">{driver.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Jobs Completed</span>
          <span className="text-sm font-medium">{driver.completedJobs}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Speciality</span>
          <span className="text-sm font-medium">{driver.speciality}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Truck Type</span>
          <span className="text-sm font-medium">{driver.truckType}</span>
        </div>
      </div>

      <button 
        onClick={() => onSelect(driver)}
        disabled={!driver.available}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          driver.available
            ? 'bg-primary-900 text-white hover:bg-primary-800 group-hover:scale-105'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {driver.available ? 'Select Driver' : 'Unavailable'}
      </button>
    </div>
  )
}

export function DriversList() {
  const handleSelectDriver = (driver: Driver) => {
    console.log('Selected driver:', driver)
    // Handle driver selection logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Available Drivers</h2>
          <p className="text-gray-600 mt-1">Choose from our verified and top-rated drivers</p>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="text" 
            placeholder="Search drivers..." 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h1m0 0a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 0V3a1 1 0 011-1h13a1 1 0 011 1v1M8 7v8a1 1 0 001 1h6a1 1 0 001-1V7m0 0V6a1 1 0 00-1-1H9a1 1 0 00-1 1v1m0 0v8" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDrivers.map((driver) => (
          <DriverCard 
            key={driver.id} 
            driver={driver} 
            onSelect={handleSelectDriver}
          />
        ))}
      </div>
    </div>
  )
}