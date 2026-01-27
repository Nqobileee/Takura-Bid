import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Load {
  id: string
  origin: string
  destination: string
  loadType: string
  weight: string
  rate: number
  status: 'posted' | 'in_bidding' | 'assigned' | 'in_transit' | 'completed'
  distance: string
  pickupDate: string
  deliveryDate: string
  assignedDriver?: string
  bidsCount: number
  createdDate: string
}

const mockLoads: Load[] = [
  {
    id: 'LOAD001',
    origin: 'Harare',
    destination: 'Bulawayo',
    loadType: 'Building Materials',
    weight: '5 tons',
    rate: 850,
    status: 'in_transit',
    distance: '439 km',
    pickupDate: '2026-01-25',
    deliveryDate: '2026-01-27',
    assignedDriver: 'Tendai Mukamuri',
    bidsCount: 5,
    createdDate: '2026-01-20'
  },
  {
    id: 'LOAD002',
    origin: 'Gweru',
    destination: 'Mutare',
    loadType: 'Agricultural Products',
    weight: '8 tons',
    rate: 1200,
    status: 'completed',
    distance: '520 km',
    pickupDate: '2026-01-20',
    deliveryDate: '2026-01-22',
    assignedDriver: 'James Mwangi',
    bidsCount: 8,
    createdDate: '2026-01-18'
  },
  {
    id: 'LOAD003',
    origin: 'Masvingo',
    destination: 'Harare',
    loadType: 'Consumer Goods',
    weight: '3.5 tons',
    rate: 650,
    status: 'in_bidding',
    distance: '292 km',
    pickupDate: '2026-01-28',
    deliveryDate: '2026-01-29',
    bidsCount: 3,
    createdDate: '2026-01-25'
  },
  {
    id: 'LOAD004',
    origin: 'Bulawayo',
    destination: 'Victoria Falls',
    loadType: 'Tourism Equipment',
    weight: '4 tons',
    rate: 750,
    status: 'assigned',
    distance: '440 km',
    pickupDate: '2026-01-26',
    deliveryDate: '2026-01-28',
    assignedDriver: 'Peter Chikwanha',
    bidsCount: 6,
    createdDate: '2026-01-23'
  }
]

function getStatusBadge(status: Load['status']) {
  switch (status) {
    case 'posted':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Posted</span>
    case 'in_bidding':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In Bidding</span>
    case 'assigned':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Assigned</span>
    case 'in_transit':
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">In Transit</span>
    case 'completed':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
    default:
      return null
  }
}

function LoadListItem({ load }: { load: Load }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {load.origin} → {load.destination}
            </h3>
            {getStatusBadge(load.status)}
          </div>
          <p className="text-sm text-gray-600 mb-3">{load.loadType} • {load.weight}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-900">${load.rate}</span>
          <p className="text-sm text-gray-500">Budget</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Distance</p>
          <p className="font-medium text-gray-900">{load.distance}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bids Received</p>
          <p className="font-medium text-gray-900">{load.bidsCount}</p>
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

      {load.assignedDriver && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Assigned to: {load.assignedDriver}</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Load ID: {load.id}</span>
          <span className="text-sm text-gray-500">Posted: {new Date(load.createdDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-3">
          {load.status === 'in_bidding' && (
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
              View Bids ({load.bidsCount})
            </button>
          )}
          {load.status === 'in_transit' && (
            <button className="text-orange-600 hover:text-orange-800 font-medium text-sm px-4 py-2 rounded-lg border border-orange-600 hover:bg-orange-50 transition-colors">
              Track Load
            </button>
          )}
          {load.status === 'completed' && (
            <button className="text-gray-600 hover:text-gray-800 font-medium text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              View Receipt
            </button>
          )}
          <button className="btn-primary">
            Manage
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyLoads() {
  const activeLoads = mockLoads.filter(load => load.status === 'in_bidding' || load.status === 'assigned' || load.status === 'in_transit')
  const completedLoads = mockLoads.filter(load => load.status === 'completed')
  const totalBids = mockLoads.reduce((sum, load) => sum + load.bidsCount, 0)

  return (
    <DashboardLayout userType="client">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="page-title">My Loads</h1>
          <p className="text-gray-600 mt-1">Manage your posted loads and track their progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Filter by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Loads</option>
              <option value="in_bidding">In Bidding</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post New Load
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
                <p className="text-sm text-gray-600">Active Loads</p>
                <p className="text-xl font-bold text-gray-900">{activeLoads.length}</p>
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
                <p className="text-sm text-gray-600">Total Bids</p>
                <p className="text-xl font-bold text-gray-900">{totalBids}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6 6a1 1 0 01-1.414 0l-6-6A1 1 0 013 6.586V4zm2 6.586l4.293 4.293a1 1 0 001.414 0L15 10.586V13a1 1 0 01-1 1H6a1 1 0 01-1-1v-2.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Loads</p>
                <p className="text-xl font-bold text-gray-900">{completedLoads.length}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">
                  ${completedLoads.reduce((sum, load) => sum + load.rate, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loads List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Loads</h2>
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