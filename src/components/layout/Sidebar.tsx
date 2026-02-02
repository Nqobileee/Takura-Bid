'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  userType: 'driver' | 'client'
  collapsed?: boolean
  onNavigate?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  section?: string
}

const driverNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/driver',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Load Board',
    href: '/driver/loads',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/driver/analytics',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'My Jobs',
    href: '/driver/jobs',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Chat',
    href: '/driver/chat',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/driver/profile',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const clientNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/client',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Find Drivers',
    href: '/client/loads',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: 'Post Load',
    href: '/client/post-load',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/client/analytics',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Messages',
    href: '/client/chat',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/client/profile',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function Sidebar({ userType, collapsed = false, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const navItems = userType === 'driver' ? driverNavItems : clientNavItems

  // Get user initials and name
  const userName = user?.name || user?.email?.split('@')[0] || (userType === 'driver' ? 'Driver' : 'Client')
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full p-4">
        {/* Logo Section */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-2 py-4 mb-6`}>
          <div className="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#1f2937"/>
              <path d="M8 18h16v6H8v-6zm2-4h12v3H10v-3z" fill="white"/>
              <circle cx="12" cy="26" r="2" fill="white"/>
              <circle cx="20" cy="26" r="2" fill="white"/>
              <path d="M14 12h4v2h-4v-2z" fill="white"/>
            </svg>
          </div>
          {!collapsed && <span className="text-xl font-bold text-gray-900 tracking-tight">TakuraBid</span>}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    pathname === item.href 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <Link 
            href={userType === 'driver' ? '/driver/profile' : '/client/profile'}
            onClick={handleNavClick}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group`}
            title={collapsed ? userName : undefined}
          >
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {userInitials}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                    {userName}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{userType}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Link>
        </div>
      </div>
    </aside>
  )
}