'use client'

import { useState, useMemo } from 'react'
import {
  calculateFreight,
  suggestBidAmount,
  formatCurrency,
  TRUCK_TYPES,
  CARGO_TYPES,
  ROUTE_TYPES,
  POPULAR_ROUTES,
  type TruckType,
  type CargoType,
  type RouteType,
  type FreightCalculation
} from '@/services/freightCalculator'

interface FreightCalculatorProps {
  onQuoteGenerated?: (quote: FreightCalculation) => void
  compact?: boolean
}

export function FreightCalculator({ onQuoteGenerated, compact = false }: FreightCalculatorProps) {
  const [distance, setDistance] = useState<number>(200)
  const [truckType, setTruckType] = useState<TruckType>('medium')
  const [cargoType, setCargoType] = useState<CargoType>('general')
  const [routeType, setRouteType] = useState<RouteType>('highway')
  const [weight, setWeight] = useState<number>(5000)
  const [showDetails, setShowDetails] = useState(false)

  const calculation = useMemo(() => {
    return calculateFreight({ distance, truckType, cargoType, routeType, weight })
  }, [distance, truckType, cargoType, routeType, weight])

  const bidSuggestion = useMemo(() => {
    return suggestBidAmount(distance, truckType, cargoType, 'normal')
  }, [distance, truckType, cargoType])

  const handlePopularRoute = (routeDistance: number) => {
    setDistance(routeDistance)
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <span>🧮</span>
            <span>Quick Quote</span>
          </h3>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(calculation.totalCost)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Truck Type</label>
            <select
              value={truckType}
              onChange={(e) => setTruckType(e.target.value as TruckType)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {Object.entries(TRUCK_TYPES).map(([key, truck]) => (
                <option key={key} value={key}>{truck.icon} {truck.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
          <span className="text-gray-500">Est. Driver Earnings</span>
          <span className="font-medium text-green-600">{formatCurrency(calculation.driverEarnings)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">🚛</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Freight Calculator</h2>
            <p className="text-gray-300 text-sm">Professional trucking cost estimation</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-2xl font-bold">{formatCurrency(calculation.totalCost)}</p>
            <p className="text-xs text-gray-300 mt-1">Total Cost</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-2xl font-bold text-green-400">{formatCurrency(calculation.driverEarnings)}</p>
            <p className="text-xs text-gray-300 mt-1">Driver Earnings</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-2xl font-bold">{calculation.estimatedHours}h</p>
            <p className="text-xs text-gray-300 mt-1">Est. Time</p>
          </div>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="p-6">
        {/* Popular Routes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Popular Routes</label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ROUTES.slice(0, 5).map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => handlePopularRoute(route.distance)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  distance === route.distance
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {route.from} → {route.to} ({route.distance}km)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <div className="relative">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                min={1}
                max={5000}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">km</span>
            </div>
            <input
              type="range"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              min={10}
              max={1500}
              className="w-full mt-2 accent-gray-900"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={100}
                max={TRUCK_TYPES[truckType].maxWeight}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max: {TRUCK_TYPES[truckType].maxWeight.toLocaleString()} kg
            </p>
          </div>

          {/* Truck Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Truck Type
            </label>
            <select
              value={truckType}
              onChange={(e) => {
                setTruckType(e.target.value as TruckType)
                setWeight(Math.min(weight, TRUCK_TYPES[e.target.value as TruckType].maxWeight))
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
            >
              {Object.entries(TRUCK_TYPES).map(([key, truck]) => (
                <option key={key} value={key}>
                  {truck.icon} {truck.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cargo Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo Type
            </label>
            <select
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value as CargoType)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
            >
              {Object.entries(CARGO_TYPES).map(([key, cargo]) => (
                <option key={key} value={key}>
                  {cargo.name} - {cargo.description}
                </option>
              ))}
            </select>
          </div>

          {/* Route Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route Condition
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(ROUTE_TYPES).map(([key, route]) => (
                <button
                  key={key}
                  onClick={() => setRouteType(key as RouteType)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    routeType === key
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{route.name}</p>
                  <p className="text-xs text-gray-500">
                    {route.factor === 1 ? 'Standard rate' : `+${((route.factor - 1) * 100).toFixed(0)}% surcharge`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mt-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="font-medium">Cost Breakdown</span>
          </button>

          {showDetails && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Fare ({distance}km × ${TRUCK_TYPES[truckType].baseRate}/km)</span>
                <span className="font-medium">{formatCurrency(calculation.baseFare)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel Cost ({calculation.fuelNeeded}L diesel)</span>
                <span className="font-medium">{formatCurrency(calculation.fuelCost)}</span>
              </div>
              {calculation.cargoSurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cargo Type Surcharge ({CARGO_TYPES[cargoType].name})</span>
                  <span className="font-medium">{formatCurrency(calculation.cargoSurcharge)}</span>
                </div>
              )}
              {calculation.routeSurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Route Condition Surcharge</span>
                  <span className="font-medium">{formatCurrency(calculation.routeSurcharge)}</span>
                </div>
              )}
              {calculation.tollEstimate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Toll Estimate</span>
                  <span className="font-medium">{formatCurrency(calculation.tollEstimate)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TakuraBid Platform Fee (5%)</span>
                <span className="font-medium">{formatCurrency(calculation.platformFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Cost</span>
                <span className="font-bold text-xl text-gray-900">{formatCurrency(calculation.totalCost)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bid Suggestions */}
        <div className="mt-6 p-4 bg-orange-50 rounded-xl">
          <h4 className="font-medium text-orange-900 mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Suggested Bid Range</span>
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-orange-600">Minimum</p>
              <p className="font-bold text-orange-900">{formatCurrency(bidSuggestion.minBid)}</p>
            </div>
            <div className="text-center p-2 bg-orange-100 rounded-lg">
              <p className="text-sm text-orange-600">Recommended</p>
              <p className="font-bold text-orange-900 text-lg">{formatCurrency(bidSuggestion.suggestedBid)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-orange-600">Maximum</p>
              <p className="font-bold text-orange-900">{formatCurrency(bidSuggestion.maxBid)}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculation.costPerKm)}</p>
            <p className="text-sm text-gray-500">Cost/km</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculation.costPerTon)}</p>
            <p className="text-sm text-gray-500">Cost/ton</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{calculation.profitMargin}%</p>
            <p className="text-sm text-gray-500">Profit Margin</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{calculation.fuelNeeded}L</p>
            <p className="text-sm text-gray-500">Fuel Needed</p>
          </div>
        </div>

        {/* Action Buttons */}
        {onQuoteGenerated && (
          <div className="mt-6">
            <button
              onClick={() => onQuoteGenerated(calculation)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Use This Quote
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FreightCalculator
