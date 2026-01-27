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
    <div className="list-item p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {load.origin} → {load.destination}
            </h3>
            {load.urgent && (
              <span className="status-badge bg-red-100 text-red-800">
                Urgent
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{load.loadType} • {load.weight}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">${load.rate}</span>
          <p className="text-sm text-gray-500">Rate</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <button className="btn-ghost">
            View Details
          </button>
          <button className="btn-primary">
            Place Bid
          </button>
        </div>
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Loads</h2>
          </div>
          <div className="space-y-0">
            {mockLoads.map((load) => (
              <LoadListItem key={load.id} load={load} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}