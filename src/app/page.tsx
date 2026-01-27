import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 18h16v6H8v-6zm2-4h12v3H10v-3z" fill="white"/>
                  <circle cx="12" cy="26" r="2" fill="white"/>
                  <circle cx="20" cy="26" r="2" fill="white"/>
                  <path d="M14 12h4v2h-4v-2z" fill="white"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TakuraBid</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/driver" className="text-gray-600 hover:text-primary-900 transition-colors">
                Driver Portal
              </Link>
              <Link href="/client" className="text-gray-600 hover:text-primary-900 transition-colors">
                Client Portal
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-900 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Digital Freight Marketplace for{' '}
            <span className="text-primary-900">Zimbabwe</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Connect clients with trusted truck drivers through transparent bidding, 
            secure payments, and verified driver profiles. Reducing empty trips while 
            promoting fair, efficient logistics.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            <Link 
              href="/driver"
              className="group bg-primary-900 text-white p-8 rounded-2xl hover:bg-primary-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="30" fill="rgba(255, 255, 255, 0.1)"/>
                  <path d="M20 28h24v8H20v-8zm4-6h16v4H24v-4z" fill="white"/>
                  <circle cx="28" cy="44" r="3" fill="white"/>
                  <circle cx="36" cy="44" r="3" fill="white"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Driver Portal</h3>
              <p className="text-primary-100">Find loads, bid on jobs, and manage your truck operations</p>
              <div className="mt-4 flex items-center justify-center text-sm text-primary-200">
                Access Dashboard →
              </div>
            </Link>
            
            <Link 
              href="/client"
              className="group bg-white border-2 border-primary-200 text-primary-900 p-8 rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="30" fill="rgba(57, 27, 73, 0.1)"/>
                  <path d="M18 22h28v4H18v-4zm0 8h28v4H18v-4zm0 8h20v4H18v-4z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Client Portal</h3>
              <p className="text-primary-700">Post loads, review driver bids, and track shipments</p>
              <div className="mt-4 flex items-center justify-center text-sm text-primary-600">
                Access Dashboard →
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Drivers</h3>
            <p className="text-gray-600">All drivers undergo verification and background checks for your peace of mind</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Track your shipments in real-time with GPS integration and live updates</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Bidding</h3>
            <p className="text-gray-600">Fair and transparent bidding system ensuring competitive pricing for all parties</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 TakuraBid. All rights reserved.</p>
            <p className="text-sm mt-2">
              Developed as part of the HIT200 Software Engineering Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}