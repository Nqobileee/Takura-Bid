'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface FloatingNavbarProps {
  userType: 'driver' | 'client'
}

interface NavItem {
  label: string
  href: string
}

const driverNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/driver' },
  { label: 'Load Board', href: '/driver/loads' },
  { label: 'My Jobs', href: '/driver/jobs' },
  { label: 'Chat', href: '/driver/chat' },
]

const clientNavItems: NavItem[] = [
  { label: 'Drivers', href: '/client' },
  { label: 'Post Load', href: '/client/post-load' },
  { label: 'My Loads', href: '/client/loads' },
  { label: 'Chat', href: '/client/chat' },
]

export function FloatingNavbar({ userType }: FloatingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = userType === 'driver' ? driverNavItems : clientNavItems

  return (
    <nav className="floating-navbar">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo">
          TakuraBid
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Profile & Actions */}
        <div className="user-profile">
          <button className="btn-secondary text-sm">
            Switch to {userType === 'driver' ? 'Client' : 'Driver'}
          </button>
          <div className="profile-avatar">
            {userType === 'driver' ? 'TM' : 'CL'}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <span className={`w-4 h-0.5 bg-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`w-4 h-0.5 bg-gray-600 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-4 h-0.5 bg-gray-600 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-6 py-4 space-y-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href 
                    ? 'text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}