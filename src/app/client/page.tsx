import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DriversList } from '@/components/client/DriversList'

export default function ClientDashboard() {
  return (
    <DashboardLayout userType="client">
      <div className="content-area">
        <DriversList />
      </div>
    </DashboardLayout>
  )
}