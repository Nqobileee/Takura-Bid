'use client'

import { FloatingNavbar } from '@/components/layout/FloatingNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'driver' | 'client'
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="app-container">
      <FloatingNavbar userType={userType} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}