'use client'

import { useState, useEffect, useCallback } from 'react'
import { gpsService, trackingService, type GpsLocation, type ShipmentTracking } from '@/services/gpsTrackingService'

interface LiveTrackingMapProps {
  loadId: string
  isDriver?: boolean
  origin?: { lat: number; lng: number; address: string }
  destination?: { lat: number; lng: number; address: string }
}

// Status badge component
function StatusBadge({ status }: { status: ShipmentTracking['status'] }) {
  const statusConfig = {
    pickup: { label: 'Heading to Pickup', color: 'bg-orange-100 text-orange-800', icon: '📍' },
    in_transit: { label: 'In Transit', color: 'bg-green-100 text-green-800', icon: '🚛' },
    delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: '✅' },
    delayed: { label: 'Delayed', color: 'bg-amber-100 text-amber-800', icon: '⚠️' }
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

export function LiveTrackingMap({ loadId, isDriver = false, origin, destination }: LiveTrackingMapProps) {
  const [currentLocation, setCurrentLocation] = useState<GpsLocation | null>(null)
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eta, setEta] = useState<number | null>(null)

  // Start location tracking for drivers
  const startTracking = useCallback(async () => {
    try {
      setError(null)
      const location = await gpsService.getCurrentPosition()
      setCurrentLocation(location)
      setIsTracking(true)

      // Start continuous tracking
      gpsService.startTracking((newLocation) => {
        setCurrentLocation(newLocation)
        
        // Update database with new location
        if (loadId) {
          trackingService.updateLocation(loadId, 'driver-id', newLocation).catch(console.error)
        }

        // Calculate ETA if destination is available
        if (destination) {
          const distanceRemaining = gpsService.calculateDistance(
            newLocation.latitude, newLocation.longitude,
            destination.lat, destination.lng
          )
          const etaMinutes = gpsService.estimateEta(distanceRemaining, newLocation.speed || 60)
          setEta(etaMinutes)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking')
    }
  }, [loadId, destination])

  // Stop tracking
  const stopTracking = useCallback(() => {
    gpsService.stopTracking()
    setIsTracking(false)
  }, [])

  // Subscribe to tracking updates for clients
  useEffect(() => {
    if (!isDriver && loadId) {
      const unsubscribe = trackingService.subscribeToTracking(loadId, (update) => {
        setTracking(update)
        if (update.current_location) {
          setCurrentLocation(update.current_location)
        }
      })

      return () => unsubscribe()
    }
  }, [loadId, isDriver])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        gpsService.stopTracking()
      }
    }
  }, [isTracking])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📍</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Tracking</h3>
              <p className="text-sm text-gray-500">
                {isTracking ? 'GPS Active' : 'GPS Inactive'}
              </p>
            </div>
          </div>
          {tracking && <StatusBadge status={tracking.status} />}
        </div>
      </div>

      {/* Map Placeholder - In production, integrate with Google Maps or Mapbox */}
      <div className="relative h-64 bg-gray-100">
        {/* Map would go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            {currentLocation ? (
              <div>
                <p className="text-sm text-gray-600">Current Position</p>
                <p className="font-mono text-xs text-gray-500 mt-1">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {isDriver ? 'Start tracking to see your location' : 'Waiting for driver location...'}
              </p>
            )}
          </div>
        </div>

        {/* Origin/Destination Markers */}
        {origin && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 text-sm">
            <span className="text-green-600 font-medium">📍 Origin:</span>
            <span className="ml-1 text-gray-700">{origin.address}</span>
          </div>
        )}
        {destination && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md px-3 py-2 text-sm">
            <span className="text-red-600 font-medium">🎯 Dest:</span>
            <span className="ml-1 text-gray-700">{destination.address}</span>
          </div>
        )}
      </div>

      {/* Tracking Info */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">
              {currentLocation?.speed?.toFixed(0) || '--'}
            </p>
            <p className="text-xs text-gray-500">km/h</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">
              {tracking?.distance_remaining?.toFixed(0) || '--'}
            </p>
            <p className="text-xs text-gray-500">km left</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">
              {eta ? `${eta}` : '--'}
            </p>
            <p className="text-xs text-gray-500">min ETA</p>
          </div>
        </div>

        {/* Driver Controls */}
        {isDriver && (
          <div className="space-y-3">
            {!isTracking ? (
              <button
                onClick={startTracking}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Start Live Tracking</span>
              </button>
            ) : (
              <>
                <div className="flex space-x-3">
                  <button
                    onClick={stopTracking}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Stop Tracking
                  </button>
                  <button
                    onClick={() => trackingService.updateDeliveryStatus(loadId, 'delivered')}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Mark Delivered
                  </button>
                </div>

                {/* Status Update Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => trackingService.updateDeliveryStatus(loadId, 'pickup')}
                    className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    At Pickup
                  </button>
                  <button
                    onClick={() => trackingService.updateDeliveryStatus(loadId, 'in_transit')}
                    className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() => trackingService.updateDeliveryStatus(loadId, 'delayed')}
                    className="flex-1 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Delayed
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Last Update */}
        {currentLocation && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}

// Mini tracking widget for dashboard
export function TrackingWidget({ loadId, status }: { loadId: string; status?: ShipmentTracking['status'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🚛</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Shipment Tracking</p>
            <p className="text-sm text-gray-500">Load #{loadId.slice(0, 8)}</p>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs text-gray-500">Progress</div>
            <div className="text-xs text-gray-500">75%</div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: '75%' }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTrackingMap
