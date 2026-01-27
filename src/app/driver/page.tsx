import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DriverStats } from '@/components/driver/DriverStats'

export default function DriverDashboard() {
  return (
    <DashboardLayout userType="driver">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Tendai! Here's your performance summary.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Settings
          </button>
          <button className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Bid
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        <DriverStats />
        
        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <button className="text-primary-900 hover:text-primary-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((job) => (
                <div key={job} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Harare to Bulawayo</p>
                      <p className="text-sm text-gray-500">Building Materials - 5 tons</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$850</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Loads</h3>
              <button className="text-primary-900 hover:text-primary-800 text-sm font-medium">
                View Load Board
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((load) => (
                <div key={load} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Gweru to Mutare</p>
                      <p className="text-sm text-gray-500">Agricultural Products - 8 tons</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Urgent
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">$1,200</p>
                    <button className="px-3 py-1 bg-primary-900 text-white text-sm font-medium rounded-md hover:bg-primary-800 transition-colors">
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}