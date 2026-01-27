import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Load {
  id: string
  origin: string
  destination: string
  loadType: string
  weight: string
  rate: number
  distance: string
  pickupDate: string
  deliveryDate: string
  urgent: boolean
  client: string
  description?: string
  requirements?: string[]
  clientRating: number
  clientSpent: string
  bidsCount: number
  postedTime: string
}

const mockLoads: Load[] = [
  {
    id: 'LOAD001',
    origin: 'Harare',
    destination: 'Bulawayo',
    loadType: 'Building Materials',
    weight: '5 tons',
    rate: 850,
    distance: '439 km',
    pickupDate: '2026-01-26',
    deliveryDate: '2026-01-27',
    urgent: false,
    client: 'ABC Construction',
    description: 'Transport of construction materials including cement, steel rods, and tiles for a commercial building project. Delivery must be completed within 24 hours.',
    requirements: ['Flatbed Truck', 'Crane Loading', 'Insurance Required'],
    clientRating: 4.8,
    clientSpent: '$15.2K',
    bidsCount: 3,
    postedTime: '2 hours ago'
  },
  {
    id: 'LOAD002',
    origin: 'Gweru',
    destination: 'Mutare',
    loadType: 'Agricultural Products',
    weight: '8 tons',
    rate: 1200,
    distance: '520 km',
    pickupDate: '2026-01-25',
    deliveryDate: '2026-01-26',
    urgent: true,
    client: 'Farm Fresh Zimbabwe',
    description: 'Urgent transport of fresh produce including vegetables and fruits for retail distribution. Temperature-controlled transport required.',
    requirements: ['Refrigerated Truck', 'Fresh Produce', 'Fast Delivery'],
    clientRating: 4.9,
    clientSpent: '$28.5K',
    bidsCount: 1,
    postedTime: '30 minutes ago'
  },
  {
    id: 'LOAD003',
    origin: 'Bulawayo',
    destination: 'Victoria Falls',
    loadType: 'Tourism Equipment',
    weight: '3 tons',
    rate: 650,
    distance: '440 km',
    pickupDate: '2026-01-27',
    deliveryDate: '2026-01-28',
    urgent: false,
    client: 'Safari Lodge Group',
    description: 'Transport of luxury safari equipment and furniture for new lodge setup. Careful handling required for expensive items.',
    requirements: ['Covered Transport', 'Careful Handling', 'Lodge Equipment'],
    clientRating: 4.7,
    clientSpent: '$8.9K',
    bidsCount: 7,
    postedTime: '4 hours ago'
  },
  {
    id: 'LOAD004',
    origin: 'Chinhoyi',
    destination: 'Kariba',
    loadType: 'Mining Equipment',
    weight: '12 tons',
    rate: 1800,
    distance: '180 km',
    pickupDate: '2026-01-26',
    deliveryDate: '2026-01-26',
    urgent: true,
    client: 'Zimbabwe Mining Corp',
    description: 'Heavy mining equipment transport for urgent operations. Specialized low-loader required. Must be delivered same day.',
    requirements: ['Low-Loader', 'Heavy Equipment', 'Mining Transport', 'Same Day'],
    clientRating: 4.6,
    clientSpent: '$45.3K',
    bidsCount: 2,
    postedTime: '1 hour ago'
  },
]

function LoadListItem({ load }: { load: Load }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 mb-6">
      {/* Header with time and actions */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">Posted {load.postedTime}</span>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button className="p-1 text-gray-400 hover:text-red-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
        {load.loadType} Transport: {load.origin} → {load.destination} – {load.weight}
      </h3>

      {/* Job details */}
      <div className="text-sm text-gray-600 mb-4">
        Fixed-rate • Urgent • Est. Budget: ${load.rate}
      </div>

      {/* Important notice */}
      {load.urgent && (
        <div className="flex items-start space-x-2 mb-4">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <strong>Important upfront:</strong> {load.description} {' '}
              <button className="text-green-600 hover:text-green-700 font-medium">
                more
              </button>
            </p>
          </div>
        </div>
      )}

      {!load.urgent && (
        <p className="text-sm text-gray-700 mb-4">
          {load.description} {' '}
          <button className="text-green-600 hover:text-green-700 font-medium">
            more
          </button>
        </p>
      )}

      {/* Skills/Requirements tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {load.requirements?.map((req, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {req}
          </span>
        ))}
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          {load.distance}
        </span>
      </div>

      {/* Client info and stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Payment verified badge */}
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Payment verified</span>
          </div>

          {/* Rating stars */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(load.clientRating) ? 'text-orange-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Client spending */}
          <span className="text-sm text-gray-600">{load.clientSpent} spent</span>

          {/* Location placeholder */}
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-600">ZWE</span>
          </div>
        </div>
      </div>

      {/* Proposals count */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-600">
          Proposals: {load.bidsCount < 5 ? `Less than ${load.bidsCount + 2}` : load.bidsCount}
        </span>
      </div>
    </div>
  )
}

export default function LoadBoard() {
  return (
    <DashboardLayout userType="driver">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Load Board</h1>
              <p className="page-subtitle">Browse available loads and place your bids</p>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                className="input-field w-80" 
                placeholder="Search by origin, destination, load type..."
              />
              <button className="btn-secondary">
                Filters
              </button>
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{mockLoads.length}</div>
            <div className="stat-label">Available Loads</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{mockLoads.filter(load => load.urgent).length}</div>
            <div className="stat-label">Urgent Loads</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">${Math.round(mockLoads.reduce((sum, load) => sum + load.rate, 0) / mockLoads.length)}</div>
            <div className="stat-label">Avg. Rate</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">3</div>
            <div className="stat-label">My Bids</div>
          </div>
        </div>

        {/* Load List */}
        <div className="space-y-0">
          {mockLoads.map((load) => (
            <LoadListItem key={load.id} load={load} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}