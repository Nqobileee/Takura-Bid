import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function ClientAnalytics() {
  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Shipping Analytics</h1>
              <p className="page-subtitle">Track your logistics performance and shipping insights</p>
            </div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="stat-value">$15,420</div>
            <div className="stat-label">Total Shipping Costs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">96%</div>
            <div className="stat-label">On-Time Delivery</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">42</div>
            <div className="stat-label">Total Shipments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">$1.85</div>
            <div className="stat-label">Avg Cost/Mile</div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Total Shipping Costs Over Time */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Total Shipping Costs Over Time</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">This Month: $4,200</span>
                  <span className="text-sm text-gray-600">Monthly Avg: $3,850</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <defs>
                    <pattern id="clientGrid1" width="50" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#clientGrid1)" />
                  
                  {/* Line chart for shipping costs */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    points="50,120 100,140 150,100 200,110 250,80 300,90 350,75"
                  />
                  
                  {/* Data points */}
                  <circle cx="50" cy="120" r="4" fill="#ef4444"/>
                  <circle cx="100" cy="140" r="4" fill="#ef4444"/>
                  <circle cx="150" cy="100" r="4" fill="#ef4444"/>
                  <circle cx="200" cy="110" r="4" fill="#ef4444"/>
                  <circle cx="250" cy="80" r="4" fill="#ef4444"/>
                  <circle cx="300" cy="90" r="4" fill="#ef4444"/>
                  <circle cx="350" cy="75" r="4" fill="#ef4444"/>
                  
                  {/* Labels */}
                  <text x="50" y="190" fontSize="10" textAnchor="middle" fill="#6b7280">Week 1</text>
                  <text x="150" y="190" fontSize="10" textAnchor="middle" fill="#6b7280">Week 2</text>
                  <text x="250" y="190" fontSize="10" textAnchor="middle" fill="#6b7280">Week 3</text>
                  <text x="350" y="190" fontSize="10" textAnchor="middle" fill="#6b7280">Week 4</text>
                  
                  {/* Y-axis labels */}
                  <text x="25" y="80" fontSize="10" fill="#6b7280">$4k</text>
                  <text x="25" y="110" fontSize="10" fill="#6b7280">$3k</text>
                  <text x="25" y="140" fontSize="10" fill="#6b7280">$2k</text>
                </svg>
              </div>
            </div>
          </div>

          {/* On-Time Delivery Rate */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">On-Time Delivery Rate</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">This Month: 96%</span>
                  <span className="text-sm text-gray-600">Target: 95%</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <rect width="100%" height="100%" fill="url(#clientGrid1)" />
                  
                  {/* Bar chart for delivery rates */}
                  <rect x="60" y="40" width="40" height="140" fill="#10b981" rx="2"/>
                  <rect x="120" y="50" width="40" height="130" fill="#10b981" rx="2"/>
                  <rect x="180" y="30" width="40" height="150" fill="#10b981" rx="2"/>
                  <rect x="240" y="35" width="40" height="145" fill="#10b981" rx="2"/>
                  <rect x="300" y="25" width="40" height="155" fill="#10b981" rx="2"/>
                  
                  {/* Percentage labels */}
                  <text x="80" y="35" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">92%</text>
                  <text x="140" y="45" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">94%</text>
                  <text x="200" y="25" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">98%</text>
                  <text x="260" y="30" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">95%</text>
                  <text x="320" y="20" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">96%</text>
                  
                  {/* X-axis labels */}
                  <text x="80" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">Oct</text>
                  <text x="140" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">Nov</text>
                  <text x="200" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">Dec</text>
                  <text x="260" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">Jan</text>
                  <text x="320" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">Feb</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Shipment Volume by Route/Region */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Shipment Volume by Route/Region</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium">Harare → Bulawayo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-sm font-bold">15</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">Gweru → Mutare</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-sm font-bold">12</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm font-medium">Harare → Mutare</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <span className="text-sm font-bold">8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm font-medium">Bulawayo → Victoria Falls</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="text-sm font-bold">7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Average Cost per Mile/Load */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Average Cost per Mile / Load</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Average: $1.85/mile</span>
                  <span className="text-sm text-gray-600">Range: $1.20 - $2.40</span>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg p-4">
                <svg viewBox="0 0 350 150" className="w-full h-full">
                  <rect width="100%" height="100%" fill="url(#clientGrid1)" />
                  
                  {/* Scatter plot points */}
                  <circle cx="50" cy="80" r="3" fill="#3b82f6"/>
                  <circle cx="80" cy="60" r="3" fill="#3b82f6"/>
                  <circle cx="120" cy="90" r="3" fill="#3b82f6"/>
                  <circle cx="150" cy="50" r="3" fill="#3b82f6"/>
                  <circle cx="180" cy="70" r="3" fill="#3b82f6"/>
                  <circle cx="220" cy="40" r="3" fill="#3b82f6"/>
                  <circle cx="250" cy="85" r="3" fill="#3b82f6"/>
                  <circle cx="280" cy="55" r="3" fill="#3b82f6"/>
                  <circle cx="310" cy="75" r="3" fill="#3b82f6"/>
                  
                  {/* Trend line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    points="30,100 320,30"
                  />
                  
                  {/* Axis labels */}
                  <text x="15" y="40" fontSize="8" fill="#6b7280">$2.40</text>
                  <text x="15" y="70" fontSize="8" fill="#6b7280">$2.00</text>
                  <text x="15" y="100" fontSize="8" fill="#6b7280">$1.60</text>
                  <text x="15" y="130" fontSize="8" fill="#6b7280">$1.20</text>
                  
                  <text x="50" y="145" fontSize="8" fill="#6b7280">100mi</text>
                  <text x="150" y="145" fontSize="8" fill="#6b7280">300mi</text>
                  <text x="250" y="145" fontSize="8" fill="#6b7280">500mi</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Monthly Performance Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15%</div>
                <div className="text-sm text-gray-600">Cost Savings vs Last Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2.3 days</div>
                <div className="text-sm text-gray-600">Average Delivery Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Driver Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}