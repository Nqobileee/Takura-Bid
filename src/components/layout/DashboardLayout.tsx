'use client'

import { useState, useEffect, useCallback } from 'react'
import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { Sidebar } from '@/components/layout/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'driver' | 'client'
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Auto-collapse sidebar on mobile, keep open on desktop by default
      if (mobile) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <FloatingNavbar 
        userType={userType} 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <div 
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-in-out ${
            isMobile 
              ? (sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64')
              : (sidebarOpen ? 'w-64' : 'w-20')
          }`}
        >
          <Sidebar 
            userType={userType} 
            collapsed={!sidebarOpen && !isMobile} 
            onNavigate={closeSidebar}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
            isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-20')
          }`}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}