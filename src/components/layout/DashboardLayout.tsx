'use client'

import { Sidebar } from '@/components/layout/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'driver' | 'client'
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="app-container">
      <Sidebar userType={userType} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}