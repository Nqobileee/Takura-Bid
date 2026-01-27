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
              <h1 className="page-title">Find Drivers</h1>
              <p className="page-subtitle">Browse expert drivers and transport specialists for your logistics needs</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                Analytics
              </button>
              <button className="btn-primary">
                Post A Load
              </button>
            </div>
          </div>
        </div>
        <DriversList />
      </div>
    </DashboardLayout>
  )
}