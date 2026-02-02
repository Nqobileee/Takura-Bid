/**
 * TakuraBid GPS Tracking Service
 * Real-time location tracking for shipments using browser Geolocation API
 * and Supabase Realtime for live updates
 */

import { supabase } from '@/lib/supabase'

export interface GpsLocation {
  latitude: number
  longitude: number
  accuracy: number
  speed: number | null // km/h
  heading: number | null // degrees from north
  timestamp: string
}

export interface ShipmentTracking {
  id: string
  load_id: string
  driver_id: string
  current_location: GpsLocation
  origin: { lat: number; lng: number; address: string }
  destination: { lat: number; lng: number; address: string }
  status: 'pickup' | 'in_transit' | 'delivered' | 'delayed'
  eta_minutes: number
  distance_remaining: number // km
  distance_traveled: number // km
  started_at: string
  updated_at: string
  route_history: GpsLocation[]
}

export interface TrackingUpdate {
  loadId: string
  location: GpsLocation
  status?: ShipmentTracking['status']
}

class GpsTrackingService {
  private watchId: number | null = null
  private currentLocation: GpsLocation | null = null
  private subscribers: Map<string, (location: GpsLocation) => void> = new Map()

  /**
   * Check if geolocation is supported
   */
  isSupported(): boolean {
    return 'geolocation' in navigator
  }

  /**
   * Get current position once
   */
  async getCurrentPosition(): Promise<GpsLocation> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GpsLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed ? position.coords.speed * 3.6 : null, // Convert m/s to km/h
            heading: position.coords.heading,
            timestamp: new Date().toISOString()
          }
          this.currentLocation = location
          resolve(location)
        },
        (error) => {
          reject(this.handleGeolocationError(error))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  /**
   * Start continuous tracking
   */
  startTracking(onUpdate: (location: GpsLocation) => void): void {
    if (!this.isSupported()) {
      throw new Error('Geolocation not supported')
    }

    if (this.watchId !== null) {
      this.stopTracking()
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: GpsLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed ? position.coords.speed * 3.6 : null,
          heading: position.coords.heading,
          timestamp: new Date().toISOString()
        }
        this.currentLocation = location
        onUpdate(location)
        
        // Notify all subscribers
        this.subscribers.forEach(callback => callback(location))
      },
      (error) => {
        console.error('GPS tracking error:', this.handleGeolocationError(error))
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    )
  }

  /**
   * Stop continuous tracking
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  /**
   * Subscribe to location updates
   */
  subscribe(id: string, callback: (location: GpsLocation) => void): void {
    this.subscribers.set(id, callback)
  }

  /**
   * Unsubscribe from location updates
   */
  unsubscribe(id: string): void {
    this.subscribers.delete(id)
  }

  /**
   * Handle geolocation errors
   */
  private handleGeolocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location permission denied. Please enable location access.')
      case error.POSITION_UNAVAILABLE:
        return new Error('Location unavailable. Please check your GPS settings.')
      case error.TIMEOUT:
        return new Error('Location request timed out. Please try again.')
      default:
        return new Error('An unknown error occurred while getting location.')
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10 // Round to 1 decimal
  }

  /**
   * Estimate time to destination
   */
  estimateEta(distanceKm: number, averageSpeedKmh: number = 60): number {
    return Math.round((distanceKm / averageSpeedKmh) * 60) // minutes
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  /**
   * Get last known location
   */
  getLastLocation(): GpsLocation | null {
    return this.currentLocation
  }
}

// Singleton instance
export const gpsService = new GpsTrackingService()

/**
 * Database operations for tracking
 */
export const trackingService = {
  /**
   * Update shipment location in database
   */
  async updateLocation(loadId: string, driverId: string, location: GpsLocation): Promise<void> {
    const { error } = await supabase
      .from('shipment_tracking')
      .upsert({
        load_id: loadId,
        driver_id: driverId,
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        heading: location.heading,
        accuracy: location.accuracy,
        updated_at: location.timestamp
      }, {
        onConflict: 'load_id'
      })

    if (error) throw error
  },

  /**
   * Get tracking info for a load
   */
  async getTrackingInfo(loadId: string): Promise<ShipmentTracking | null> {
    const { data, error } = await supabase
      .from('shipment_tracking')
      .select('*')
      .eq('load_id', loadId)
      .single()

    if (error) return null
    return data
  },

  /**
   * Subscribe to real-time tracking updates
   */
  subscribeToTracking(
    loadId: string, 
    onUpdate: (tracking: ShipmentTracking) => void
  ): () => void {
    const channel = supabase
      .channel(`tracking:${loadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shipment_tracking',
          filter: `load_id=eq.${loadId}`
        },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new as ShipmentTracking)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  },

  /**
   * Start a delivery (driver)
   */
  async startDelivery(
    loadId: string, 
    driverId: string,
    origin: { lat: number; lng: number; address: string },
    destination: { lat: number; lng: number; address: string }
  ): Promise<void> {
    const currentLocation = await gpsService.getCurrentPosition()
    const totalDistance = gpsService.calculateDistance(
      origin.lat, origin.lng,
      destination.lat, destination.lng
    )

    const { error } = await supabase
      .from('shipment_tracking')
      .insert({
        load_id: loadId,
        driver_id: driverId,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        origin_address: origin.address,
        dest_lat: destination.lat,
        dest_lng: destination.lng,
        dest_address: destination.address,
        status: 'pickup',
        total_distance: totalDistance,
        distance_remaining: totalDistance,
        distance_traveled: 0,
        started_at: new Date().toISOString()
      })

    if (error) throw error
  },

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(
    loadId: string, 
    status: ShipmentTracking['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('shipment_tracking')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('load_id', loadId)

    if (error) throw error
  },

  /**
   * Complete delivery
   */
  async completeDelivery(loadId: string): Promise<void> {
    const { error } = await supabase
      .from('shipment_tracking')
      .update({ 
        status: 'delivered',
        completed_at: new Date().toISOString(),
        distance_remaining: 0
      })
      .eq('load_id', loadId)

    if (error) throw error
  }
}

export default gpsService
