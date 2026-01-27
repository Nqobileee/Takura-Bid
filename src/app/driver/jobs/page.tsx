import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Job {
  id: string
  origin: string
  destination: string
  loadType: string
  weight: string
  rate: number
  status: 'active' | 'completed' | 'pending' | 'in_transit'
  distance: string
  pickupDate: string
  deliveryDate: string
  client: string
  progress?: number
}

const mockJobs: Job[] = [
  {
    id: 'JOB001',
    origin: 'Harare',
    destination: 'Bulawayo',
    loadType: 'Building Materials',
    weight: '5 tons',
    rate: 850,
    status: 'in_transit',
    distance: '439 km',
    pickupDate: '2026-01-25',
    deliveryDate: '2026-01-27',
    client: 'ABC Construction',
    progress: 65
  },
  {
    id: 'JOB002',
    origin: 'Gweru',
    destination: 'Mutare',
    loadType: 'Agricultural Products',
    weight: '8 tons',
    rate: 1200,
    status: 'completed',
    distance: '520 km',
    pickupDate: '2026-01-20',
    deliveryDate: '2026-01-22',
    client: 'Farm Fresh Zimbabwe'
  },
  {
    id: 'JOB003',
    origin: 'Masvingo',
    destination: 'Harare',
    loadType: 'Consumer Goods',
    weight: '3.5 tons',
    rate: 650,
    status: 'pending',
    distance: '292 km',
    pickupDate: '2026-01-28',
    deliveryDate: '2026-01-29',
    client: 'Retail Plus Zimbabwe'
  },
  {
    id: 'JOB004',
    origin: 'Chinhoyi',
    destination: 'Kariba',
    loadType: 'Mining Equipment',
    weight: '12 tons',
    rate: 1800,
    status: 'completed',
    distance: '180 km',
    pickupDate: '2026-01-18',
    deliveryDate: '2026-01-19',
    client: 'Zimbabwe Mining Corp'
  },
  {
    id: 'JOB005',
    origin: 'Bulawayo',
    destination: 'Victoria Falls',
    loadType: 'Tourism Equipment',
    weight: '4 tons',
    rate: 750,
    status: 'active',
    distance: '440 km',
    pickupDate: '2026-01-26',
    deliveryDate: '2026-01-28',
    client: 'Safari Lodge Group'
  }
]

function getStatusBadge(status: Job['status']) {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Active</span>
    case 'in_transit':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">In Transit</span>
    case 'completed':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
    case 'pending':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Pending</span>
    default:
      return null
  }
}

function JobListItem({ job }: { job: Job }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {job.origin} → {job.destination}
            </h3>
            {getStatusBadge(job.status)}
          </div>
          <p className="text-sm text-gray-600 mb-3">{job.loadType} • {job.weight}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-900">${job.rate}</span>
          <p className="text-sm text-gray-500">Total Rate</p>
        </div>
      </div>
      
      {job.status === 'in_transit' && job.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-900 h-2 rounded-full transition-all duration-300" 
              style={{width: `${job.progress}%`}}
            ></div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Distance</p>
          <p className="font-medium text-gray-900">{job.distance}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Client</p>
          <p className="font-medium text-gray-900">{job.client}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
          <p className="font-medium text-gray-900">{new Date(job.pickupDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery</p>
          <p className="font-medium text-gray-900">{new Date(job.deliveryDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Job ID: {job.id}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-primary-900 hover:text-primary-800 font-medium text-sm px-4 py-2 rounded-lg border border-primary-900 hover:bg-primary-50 transition-colors">
            View Details
          </button>
          {job.status === 'in_transit' && (
            <button className="btn-primary bg-green-900 hover:bg-green-800">
              Update Progress
            </button>
          )}
          {job.status === 'active' && (
            <button className="btn-primary">
              Start Job
            </button>
          )}
          {job.status === 'completed' && (
            <button className="text-gray-600 hover:text-gray-800 font-medium text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyJobs() {
  const activeJobs = mockJobs.filter(job => job.status === 'active' || job.status === 'in_transit')
  const completedJobs = mockJobs.filter(job => job.status === 'completed')
  const pendingJobs = mockJobs.filter(job => job.status === 'pending')

  return (
    <DashboardLayout userType="driver">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="page-title">My Jobs</h1>
          <p className="text-gray-600 mt-1">Track and manage your current and completed jobs</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Filter by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-xl font-bold text-gray-900">{activeJobs.length}</p>
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
                <p className="text-sm text-gray-600">Pending Jobs</p>
                <p className="text-xl font-bold text-gray-900">{pendingJobs.length}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 14h14l-7-12z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-xl font-bold text-gray-900">{completedJobs.length}</p>
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
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl font-bold text-gray-900">
                  ${mockJobs.filter(job => job.status === 'completed').reduce((sum, job) => sum + job.rate, 0).toLocaleString()}
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

        {/* Jobs List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Jobs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mockJobs.map((job) => (
              <JobListItem key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}