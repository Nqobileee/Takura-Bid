'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, isLoading, signIn, signUp } = useAuth()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'client' | 'driver'>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push(`/${user.type}`)
    }
  }, [user, isLoading, router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password, name, userType)
      } else {
        await signIn(email, password, userType)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      setAuthLoading(false)
    }
  }

  const openAuth = (type: 'client' | 'driver', signup = false) => {
    setUserType(type)
    setIsSignUp(signup)
    setShowAuth(true)
    setError('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">Loading TakuraBid...</p>
          <p className="text-orange-100 text-sm mt-2">Connecting to Zimbabwe&apos;s Freight Network</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Truck Background - Clean, No Overlay */}
      <div 
        className="relative min-h-[650px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-photo/serenity-motion-semitruck-driving-into-sunset-cloudy-day_862543-1948.jpg?w=996')`
        }}
      >
        {/* Header */}
        <header className="relative z-10 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M6 20h20v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5z" fill="#2563eb"/>
                  <path d="M8 14h16v5H8v-5z" fill="#1d4ed8"/>
                  <path d="M10 10h12v3H10v-3z" fill="#2563eb"/>
                  <circle cx="11" cy="27" r="2.5" fill="#1e40af"/>
                  <circle cx="21" cy="27" r="2.5" fill="#1e40af"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">TakuraBid</span>
            </div>
            
            {/* Navigation Links + Sign In Button */}
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#services" className="text-white font-medium hover:text-orange-300 transition-colors drop-shadow-lg">
                  Services
                </a>
                <a href="#how-it-works" className="text-white font-medium hover:text-orange-300 transition-colors drop-shadow-lg">
                  How It Works
                </a>
                <a href="#about" className="text-white font-medium hover:text-orange-300 transition-colors drop-shadow-lg">
                  About
                </a>
                <a href="#contact" className="text-white font-medium hover:text-orange-300 transition-colors drop-shadow-lg">
                  Contact
                </a>
              </nav>
              
              <button
                onClick={() => openAuth('client', false)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content - Centered Welcome */}
        <div className="relative z-10 flex items-center justify-center min-h-[500px] px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Welcome to TakuraBid
            </h1>
            
            {/* Styled Subtitle */}
            <div className="mb-8">
              <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Zimbabwe&apos;s Premier Freight Marketplace
              </p>
              <div className="flex justify-center mt-3">
                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section - Warm Orange/Brown Theme */}
      <section id="services" className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive freight solutions tailored for Zimbabwe&apos;s businesses and transporters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Shippers */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Shippers</h3>
              <p className="text-gray-600 mb-4">Post your loads and receive competitive bids from verified drivers across Zimbabwe. Compare rates, reviews, and choose the best fit for your cargo.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Post unlimited loads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Real-time GPS tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Secure payments</span>
                </li>
              </ul>
            </div>

            {/* For Drivers */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Drivers</h3>
              <p className="text-gray-600 mb-4">Find loads that match your routes and maximize your earnings. Bid on jobs, communicate directly with clients, and get paid securely.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Browse available loads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Competitive bidding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Earnings dashboard</span>
                </li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Solutions</h3>
              <p className="text-gray-600 mb-4">Custom logistics solutions for large businesses. Dedicated support, API integration, and volume-based pricing for your operations.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>API integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  <span>Volume discounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg">
              Get your cargo moving in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg shadow-orange-500/30 relative z-10">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Post Your Load</h3>
              <p className="text-stone-400">Describe your cargo, set pickup and delivery locations, and specify your requirements. It takes less than 2 minutes.</p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg shadow-amber-500/30 relative z-10">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Receive & Compare Bids</h3>
              <p className="text-stone-400">Verified drivers will compete for your load. Compare prices, reviews, and vehicle types to make the best choice.</p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg shadow-orange-600/30 relative z-10">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track & Receive</h3>
              <p className="text-stone-400">Monitor your shipment in real-time with GPS tracking. Communicate directly with your driver until delivery.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
            <button
              onClick={() => openAuth('client', true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Post a Load</span>
            </button>
            <button
              onClick={() => openAuth('driver', true)}
              className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-400 text-lg rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Join as Driver</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to move freight efficiently across Zimbabwe
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Drivers</h3>
              <p className="text-gray-500 text-sm">All drivers thoroughly vetted and verified for your peace of mind</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Bidding</h3>
              <p className="text-gray-500 text-sm">Get competitive quotes instantly from multiple drivers</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">GPS Tracking</h3>
              <p className="text-gray-500 text-sm">Track your shipment in real-time from pickup to delivery</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-500 text-sm">Protected transactions with escrow and verified payouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Shortened */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
                About <span className="text-orange-600">TakuraBid</span>
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                TakuraBid is Zimbabwe&apos;s leading digital freight marketplace, connecting businesses 
                with verified truck drivers. We solve the inefficiencies in freight logistics — 
                reducing empty trips, providing transparent pricing, and ensuring reliable transport.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Our platform combines real-time bidding, GPS tracking, and secure payments to create 
                a seamless experience where shippers get the best rates and drivers maximize their earnings.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎯 Our Mission</h3>
                <p className="text-gray-600">
                  To revolutionize freight logistics in Zimbabwe by creating Africa&apos;s most trusted 
                  digital freight marketplace.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🔮 Our Vision</h3>
                <p className="text-gray-600">
                  A Zimbabwe where every business has access to affordable, reliable transport, 
                  expanding across Southern Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-stone-100 via-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions? Our team is here to help you get started with TakuraBid
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Harare Institute of Technology</p>
              <p className="text-gray-600">Ganges Road, Belvedere</p>
              <p className="text-gray-600">Harare, Zimbabwe</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@takurabid.co.zw</p>
              <p className="text-gray-600">support@takurabid.co.zw</p>
              <p className="text-orange-600 font-medium mt-2">We respond within 24 hours</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+263 77 123 4567</p>
              <p className="text-gray-600">+263 24 270 4531</p>
              <p className="text-orange-600 font-medium mt-2">Mon-Fri: 8AM - 6PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-stone-900 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-stone-400 text-sm">
              © 2026 TakuraBid. All rights reserved.
            </p>
            <div className="flex items-center px-5 py-2.5 bg-stone-800 rounded-full border border-orange-900/50">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">HIT200 Software Engineering Project</p>
                <p className="text-orange-400 text-xs">GROUP 1 • Harare Institute of Technology</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAuth(false)}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${userType === 'driver' ? 'bg-amber-100' : 'bg-orange-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {userType === 'driver' ? (
                  <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500 mt-1">
                {isSignUp ? `Sign up as a ${userType}` : `Sign in as a ${userType}`}
              </p>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-orange-50 rounded-xl">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  userType === 'client' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  userType === 'driver' 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Driver
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg ${
                  userType === 'driver' 
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30' 
                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]`}
              >
                {authLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-stone-500">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}