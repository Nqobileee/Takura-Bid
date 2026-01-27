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
    client: 'ABC Construction'
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
    client: 'Farm Fresh Zimbabwe'
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
    client: 'Safari Lodge Group'
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
    client: 'Zimbabwe Mining Corp'
  },
]

function LoadListItem({ load }: { load: Load }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {load.origin} → {load.destination}
                </h3>
                {load.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{load.loadType} • {load.weight}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-900">${load.rate}</span>
              <p className="text-sm text-gray-500">Rate</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Distance</p>
              <p className="font-medium text-gray-900">{load.distance}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Client</p>
              <p className="font-medium text-gray-900">{load.client}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
              <p className="font-medium text-gray-900">{new Date(load.pickupDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery</p>
              <p className="font-medium text-gray-900">{new Date(load.deliveryDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Load ID: {load.id}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-primary-900 hover:text-primary-800 font-medium text-sm px-4 py-2 rounded-lg border border-primary-900 hover:bg-primary-50 transition-colors">
                View Details
              </button>
              <button className="btn-primary">
                Place Bid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoadBoard() {
  return (
    <DashboardLayout userType="driver">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Load Board</h1>
          <p className="text-gray-600 mt-1">Browse available loads and place your bids</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search and Filters */}
          <div className="search-container">
            <svg className="search-icon w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path d="M9 17A8 8 0 109 1a8 8 0 000 16z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              placeholder="Search by origin, destination, load type..."
            />
          </div>
          <button className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Loads</p>
                <p className="text-xl font-bold text-gray-900">{mockLoads.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent Loads</p>
                <p className="text-xl font-bold text-gray-900">
                  {mockLoads.filter(load => load.urgent).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 14h14l-7-12z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  ${Math.round(mockLoads.reduce((sum, load) => sum + load.rate, 0) / mockLoads.length)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Bids</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Load List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Loads</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mockLoads.map((load) => (
              <LoadListItem key={load.id} load={load} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}