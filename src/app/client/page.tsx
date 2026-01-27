import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DriversList } from '@/components/client/DriversList'

export default function ClientDashboard() {
  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Welcome Back Tadisa</h1>
              <p className="page-subtitle">Select your driver for your next load now!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                Dashboard
              </button>
              <button className="btn-primary">
                Post A Load
              </button>
            </div>
          </div>
        </div>
        <DriversList />
        
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">5</div>
            <div className="stat-label">Active Loads</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">42</div>
            <div className="stat-label">Completed Jobs</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">$15,420</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[
              { action: 'Posted new load', details: 'Harare to Bulawayo - Building Materials', time: '2 hours ago', status: 'pending' },
              { action: 'Load completed', details: 'Gweru to Mutare - Agricultural Products', time: '1 day ago', status: 'completed' },
              { action: 'Driver assigned', details: 'Tendai Mukamuri assigned to Load #1234', time: '2 days ago', status: 'assigned' },
            ].map((activity, index) => (
              <div key={index} className="list-item p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'assigned' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}