import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function DriverAnalytics() {
  return (
    <DashboardLayout userType="driver">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Analytics</h1>
              <p className="page-subtitle">Track your performance metrics and insights.</p>
            </div>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="stat-value">$27,000</div>
            <div className="stat-label">Total Earnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Views & Clicks Chart */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Profile Views & Clicks</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Views: 2,847</span>
                  <span className="text-sm text-gray-600">Total Clicks: 892</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Views line (blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points="20,150 60,120 100,140 140,100 180,110 220,80 260,90 300,60 340,70 380,50"
                  />
                  
                  {/* Clicks line (green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points="20,170 60,160 100,165 140,140 180,145 220,130 260,135 300,120 340,125 380,110"
                  />
                  
                  {/* Data points for Views */}
                  <circle cx="20" cy="150" r="3" fill="#3b82f6"/>
                  <circle cx="100" cy="140" r="3" fill="#3b82f6"/>
                  <circle cx="180" cy="110" r="3" fill="#3b82f6"/>
                  <circle cx="260" cy="90" r="3" fill="#3b82f6"/>
                  <circle cx="340" cy="70" r="3" fill="#3b82f6"/>
                  
                  {/* Data points for Clicks */}
                  <circle cx="20" cy="170" r="3" fill="#10b981"/>
                  <circle cx="100" cy="165" r="3" fill="#10b981"/>
                  <circle cx="180" cy="145" r="3" fill="#10b981"/>
                  <circle cx="260" cy="135" r="3" fill="#10b981"/>
                  <circle cx="340" cy="125" r="3" fill="#10b981"/>
                </svg>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Profile Views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Profile Clicks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals Analytics Chart */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Proposal Analytics</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">45</div>
                  <div className="text-sm text-gray-600">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">32</div>
                  <div className="text-sm text-gray-600">Viewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">18</div>
                  <div className="text-sm text-gray-600">Responded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Hired</div>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg p-4">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Bar chart */}
                  {/* Sent bar */}
                  <rect x="30" y="30" width="40" height="120" fill="#6b7280" rx="2"/>
                  <text x="50" y="25" textAnchor="middle" fontSize="12" fill="#374151">45</text>
                  <text x="50" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">Sent</text>
                  
                  {/* Viewed bar */}
                  <rect x="90" y="45" width="40" height="105" fill="#3b82f6" rx="2"/>
                  <text x="110" y="40" textAnchor="middle" fontSize="12" fill="#374151">32</text>
                  <text x="110" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">Viewed</text>
                  
                  {/* Responded bar */}
                  <rect x="150" y="70" width="40" height="80" fill="#f59e0b" rx="2"/>
                  <text x="170" y="65" textAnchor="middle" fontSize="12" fill="#374151">18</text>
                  <text x="170" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">Resp.</text>
                  
                  {/* Hired bar */}
                  <rect x="210" y="90" width="40" height="60" fill="#10b981" rx="2"/>
                  <text x="230" y="85" textAnchor="middle" fontSize="12" fill="#374151">12</text>
                  <text x="230" y="165" textAnchor="middle" fontSize="10" fill="#6b7280">Hired</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Jobs</h2>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((job) => (
                <div key={job} className="list-item p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Available Loads</h2>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((load) => (
                <div key={load} className="list-item p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Gweru to Mutare</p>
                      <p className="text-sm text-gray-500">Agricultural Products - 8 tons</p>
                    </div>
                    <span className="status-badge bg-green-100 text-green-800">
                      Urgent
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">$1,200</p>
                    <button className="btn-primary text-sm">
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}