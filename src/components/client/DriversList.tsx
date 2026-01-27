'use client'

interface Driver {
  id: string
  name: string
  title: string
  country: string
  hourlyRate: number
  rating: number
  jobSuccess: number
  totalEarned: string
  available: boolean
  skills: string[]
  description: string
  image?: string
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Tendai M.',
    title: 'Expert Heavy Equipment Transport | Professional Long-Distance Driver',
    country: 'Zimbabwe',
    hourlyRate: 15,
    rating: 4.8,
    jobSuccess: 94,
    totalEarned: '$33K+ earned',
    available: true,
    skills: ['Heavy Equipment', 'Long Distance', 'Flatbed Transport', 'Construction', 'Mining Equipment', '+3'],
    description: 'Welcome! 🚛 TRANSPORT EXPERT ✅ Quick Response to invitations. Hi, I\'m Tendai Mukamuri an Expert Heavy Equipment Transport Driver. I have speciality in heavy equipment transport. I have delivered 250+ loads for multiple companies/clients. I have 8+ years...'
  },
  {
    id: '2', 
    name: 'Sarah C.',
    title: 'Agricultural Transport Specialist | Cold Chain Expert',
    country: 'Zimbabwe',
    hourlyRate: 12,
    rating: 4.9,
    jobSuccess: 98,
    totalEarned: '$45K+ earned',
    available: true,
    skills: ['Agricultural Products', 'Cold Chain', 'Refrigerated Transport', 'Food Safety', 'Livestock', '+4'],
    description: 'Professional agricultural transport specialist with expertise in cold chain logistics. Certified in food safety protocols and livestock transport. Over 200 successful deliveries across Zimbabwe with zero incidents...'
  },
  {
    id: '3',
    name: 'James M.',
    title: 'Construction Materials Transport | Mining Logistics Expert',
    country: 'Zimbabwe', 
    hourlyRate: 18,
    rating: 4.7,
    jobSuccess: 91,
    totalEarned: '$28K+ earned',
    available: false,
    skills: ['Construction Materials', 'Mining Transport', 'Dump Truck', 'Hazardous Materials', 'Site Delivery', '+2'],
    description: 'Experienced construction and mining transport specialist. Licensed for hazardous materials transport with advanced safety certifications. Reliable delivery to remote mining sites and construction projects...'
  },
  {
    id: '4',
    name: 'Grace M.',
    title: 'General Freight Specialist | Cross-Border Transport Expert',
    country: 'Zimbabwe',
    hourlyRate: 14,
    rating: 4.6,
    jobSuccess: 89,
    totalEarned: '$21K+ earned', 
    available: true,
    skills: ['General Freight', 'Cross Border', 'Import/Export', 'Documentation', 'Customs', '+5'],
    description: 'Cross-border logistics expert specializing in import/export documentation and customs procedures. Fluent in multiple languages with extensive knowledge of SADC trade routes and regulations...'
  },
  {
    id: '5',
    name: 'Michael T.',
    title: 'Liquid Transport Specialist | Fuel & Chemical Transport',
    country: 'Zimbabwe',
    hourlyRate: 20,
    rating: 4.9,
    jobSuccess: 96,
    totalEarned: '$52K+ earned',
    available: true,
    skills: ['Liquid Transport', 'Fuel Delivery', 'Chemical Transport', 'Tanker Operations', 'Safety Protocols', '+3'],
    description: 'Certified liquid transport specialist with advanced training in fuel and chemical delivery. ADR certified with spotless safety record. Specialized equipment for various liquid cargo types...'
  },
  {
    id: '6',
    name: 'Patricia N.',
    title: 'Express Delivery Expert | Time-Sensitive Cargo Specialist',
    country: 'Zimbabwe',
    hourlyRate: 16,
    rating: 4.8,
    jobSuccess: 93,
    totalEarned: '$38K+ earned',
    available: true,
    skills: ['Express Delivery', 'Time Sensitive', 'Medical Supplies', 'Emergency Transport', 'GPS Tracking', '+4'],
    description: 'Express delivery specialist focusing on time-sensitive and medical cargo. Real-time GPS tracking and 24/7 communication. Perfect record for urgent deliveries including medical supplies and emergency equipment...'
  }
]

interface DriverCardProps {
  driver: Driver
  onSelect: (driver: Driver) => void
}

function DriverCard({ driver, onSelect }: DriverCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
      {/* Driver Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {driver.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{driver.name}</h3>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 leading-tight mb-2">{driver.title}</p>
            <p className="text-sm text-gray-600">{driver.country}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 pb-4">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-2xl font-bold text-gray-900">${driver.hourlyRate}/hr</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold text-gray-900">{driver.jobSuccess}% Job Success</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
          <span>{driver.totalEarned}</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="font-medium">{driver.rating}</span>
          </div>
          {driver.available && (
            <span className="text-green-600 font-medium">Available now</span>
          )}
        </div>
      </div>

      {/* Skills Tags */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {driver.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-6">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {driver.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex space-x-3">
        <button className="btn-ghost flex-1 text-center">
          Message
        </button>
        <button 
          onClick={() => onSelect(driver)}
          disabled={!driver.available}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            driver.available
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {driver.available ? 'Invite to job' : 'Unavailable'}
        </button>
      </div>
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
          <h2 className="text-xl font-semibold text-gray-900">Find Transport Drivers</h2>
          <p className="text-gray-600 mt-1">Browse expert drivers and transport specialists for your logistics needs</p>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="text" 
            placeholder="Search by skills, location..." 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
          />
          <button className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      <div className="space-y-4">
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