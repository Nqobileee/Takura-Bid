/**
 * TakuraBid Freight Calculator Service
 * Professional freight cost calculations for the Zimbabwean trucking industry
 */

// Fuel prices and rates (USD - Zimbabwe uses USD)
const FUEL_PRICE_PER_LITER = 1.55 // Average diesel price in Zimbabwe
const AVERAGE_CONSUMPTION_PER_100KM = 35 // Liters per 100km for heavy trucks

// Truck types with their specifications
export const TRUCK_TYPES = {
  small: {
    name: 'Small Truck (1-3 tons)',
    maxWeight: 3000, // kg
    baseRate: 0.85, // USD per km
    fuelConsumption: 15, // L/100km
    icon: '🚚'
  },
  medium: {
    name: 'Medium Truck (4-8 tons)',
    maxWeight: 8000,
    baseRate: 1.25,
    fuelConsumption: 25,
    icon: '🚛'
  },
  large: {
    name: 'Large Truck (10-20 tons)',
    maxWeight: 20000,
    baseRate: 1.85,
    fuelConsumption: 35,
    icon: '🚛'
  },
  articulated: {
    name: 'Articulated (20-34 tons)',
    maxWeight: 34000,
    baseRate: 2.50,
    fuelConsumption: 45,
    icon: '🚚'
  },
  superlink: {
    name: 'Superlink (34+ tons)',
    maxWeight: 56000,
    baseRate: 3.25,
    fuelConsumption: 55,
    icon: '🚛'
  }
} as const

export type TruckType = keyof typeof TRUCK_TYPES

// Cargo types with handling factors
export const CARGO_TYPES = {
  general: { name: 'General Cargo', factor: 1.0, description: 'Standard goods' },
  fragile: { name: 'Fragile', factor: 1.35, description: 'Requires careful handling' },
  perishable: { name: 'Perishable', factor: 1.50, description: 'Temperature-controlled' },
  hazardous: { name: 'Hazardous Materials', factor: 1.75, description: 'Special permits required' },
  livestock: { name: 'Livestock', factor: 1.40, description: 'Animal transport' },
  vehicles: { name: 'Vehicles', factor: 1.30, description: 'Car carriers' },
  bulk: { name: 'Bulk (grain, ore)', factor: 0.90, description: 'Loose materials' },
  construction: { name: 'Construction Materials', factor: 1.15, description: 'Building supplies' }
} as const

export type CargoType = keyof typeof CARGO_TYPES

// Route difficulty factors
export const ROUTE_TYPES = {
  highway: { name: 'Highway/Tarred', factor: 1.0 },
  mixed: { name: 'Mixed Roads', factor: 1.15 },
  rural: { name: 'Rural/Gravel', factor: 1.35 },
  offroad: { name: 'Off-road/Farm', factor: 1.60 }
} as const

export type RouteType = keyof typeof ROUTE_TYPES

export interface FreightCalculation {
  // Input parameters
  distance: number // km
  truckType: TruckType
  cargoType: CargoType
  routeType: RouteType
  weight: number // kg
  
  // Calculated values
  baseFare: number
  fuelCost: number
  cargoSurcharge: number
  routeSurcharge: number
  weightSurcharge: number
  tollEstimate: number
  subtotal: number
  platformFee: number // 5% TakuraBid fee
  totalCost: number
  
  // Driver earnings
  driverEarnings: number
  profitMargin: number
  costPerKm: number
  costPerTon: number
  
  // Time estimates
  estimatedHours: number
  estimatedDays: number
  
  // Fuel details
  fuelNeeded: number // liters
  fuelCostBreakdown: number
}

export interface QuickQuoteInput {
  distance: number
  truckType: TruckType
  cargoType: CargoType
  routeType: RouteType
  weight: number
}

/**
 * Calculate comprehensive freight costs
 */
export function calculateFreight(input: QuickQuoteInput): FreightCalculation {
  const { distance, truckType, cargoType, routeType, weight } = input
  const truck = TRUCK_TYPES[truckType]
  const cargo = CARGO_TYPES[cargoType]
  const route = ROUTE_TYPES[routeType]
  
  // Base fare calculation
  const baseFare = distance * truck.baseRate
  
  // Fuel cost calculation
  const fuelNeeded = (distance / 100) * truck.fuelConsumption
  const fuelCost = fuelNeeded * FUEL_PRICE_PER_LITER
  
  // Cargo type surcharge
  const cargoSurcharge = baseFare * (cargo.factor - 1)
  
  // Route difficulty surcharge
  const routeSurcharge = baseFare * (route.factor - 1)
  
  // Weight surcharge (for overweight loads)
  const weightRatio = weight / truck.maxWeight
  const weightSurcharge = weightRatio > 0.8 ? baseFare * 0.15 * (weightRatio - 0.8) * 5 : 0
  
  // Toll estimate (average for Zimbabwe routes)
  const tollEstimate = distance > 100 ? Math.ceil(distance / 100) * 5 : 0
  
  // Calculate subtotal
  const subtotal = baseFare + fuelCost + cargoSurcharge + routeSurcharge + weightSurcharge + tollEstimate
  
  // Platform fee (5%)
  const platformFee = subtotal * 0.05
  
  // Total cost
  const totalCost = subtotal + platformFee
  
  // Driver earnings (85% of subtotal after fuel)
  const driverEarnings = (subtotal - fuelCost) * 0.85
  
  // Profit margin
  const profitMargin = ((driverEarnings / totalCost) * 100)
  
  // Cost metrics
  const costPerKm = totalCost / distance
  const costPerTon = totalCost / (weight / 1000)
  
  // Time estimates (average speed 60km/h on highway, adjusted for route type)
  const avgSpeed = 60 / route.factor
  const estimatedHours = distance / avgSpeed
  const estimatedDays = estimatedHours > 8 ? Math.ceil(estimatedHours / 10) : 0
  
  return {
    distance,
    truckType,
    cargoType,
    routeType,
    weight,
    baseFare: Math.round(baseFare * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    cargoSurcharge: Math.round(cargoSurcharge * 100) / 100,
    routeSurcharge: Math.round(routeSurcharge * 100) / 100,
    weightSurcharge: Math.round(weightSurcharge * 100) / 100,
    tollEstimate: Math.round(tollEstimate * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    driverEarnings: Math.round(driverEarnings * 100) / 100,
    profitMargin: Math.round(profitMargin * 10) / 10,
    costPerKm: Math.round(costPerKm * 100) / 100,
    costPerTon: Math.round(costPerTon * 100) / 100,
    estimatedHours: Math.round(estimatedHours * 10) / 10,
    estimatedDays,
    fuelNeeded: Math.round(fuelNeeded * 10) / 10,
    fuelCostBreakdown: Math.round(fuelCost * 100) / 100
  }
}

/**
 * Quick quote for load posting
 */
export function getQuickQuote(distance: number, truckType: TruckType = 'medium'): number {
  const result = calculateFreight({
    distance,
    truckType,
    cargoType: 'general',
    routeType: 'highway',
    weight: TRUCK_TYPES[truckType].maxWeight * 0.7
  })
  return result.totalCost
}

/**
 * Calculate driver earnings from a job
 */
export function calculateDriverEarnings(
  totalFare: number,
  distance: number,
  truckType: TruckType
): { earnings: number; fuelCost: number; netProfit: number; profitPerKm: number } {
  const truck = TRUCK_TYPES[truckType]
  const fuelNeeded = (distance / 100) * truck.fuelConsumption
  const fuelCost = fuelNeeded * FUEL_PRICE_PER_LITER
  const platformFee = totalFare * 0.05
  const earnings = totalFare - platformFee
  const netProfit = earnings - fuelCost
  const profitPerKm = netProfit / distance
  
  return {
    earnings: Math.round(earnings * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitPerKm: Math.round(profitPerKm * 100) / 100
  }
}

/**
 * Suggest optimal bid amount
 */
export function suggestBidAmount(
  distance: number,
  truckType: TruckType,
  cargoType: CargoType,
  marketDemand: 'low' | 'normal' | 'high' = 'normal'
): { minBid: number; suggestedBid: number; maxBid: number } {
  const baseCalc = calculateFreight({
    distance,
    truckType,
    cargoType,
    routeType: 'mixed',
    weight: TRUCK_TYPES[truckType].maxWeight * 0.7
  })
  
  const demandMultiplier = {
    low: 0.85,
    normal: 1.0,
    high: 1.25
  }[marketDemand]
  
  const minBid = baseCalc.totalCost * 0.9
  const suggestedBid = baseCalc.totalCost * demandMultiplier
  const maxBid = baseCalc.totalCost * 1.3 * demandMultiplier
  
  return {
    minBid: Math.round(minBid),
    suggestedBid: Math.round(suggestedBid),
    maxBid: Math.round(maxBid)
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

/**
 * Popular Zimbabwe routes with pre-calculated distances
 */
export const POPULAR_ROUTES = [
  { from: 'Harare', to: 'Bulawayo', distance: 439 },
  { from: 'Harare', to: 'Mutare', distance: 263 },
  { from: 'Harare', to: 'Beitbridge', distance: 580 },
  { from: 'Harare', to: 'Victoria Falls', distance: 878 },
  { from: 'Harare', to: 'Masvingo', distance: 292 },
  { from: 'Bulawayo', to: 'Victoria Falls', distance: 439 },
  { from: 'Bulawayo', to: 'Beitbridge', distance: 321 },
  { from: 'Harare', to: 'Kariba', distance: 365 },
  { from: 'Harare', to: 'Gweru', distance: 275 },
  { from: 'Harare', to: 'Chinhoyi', distance: 116 }
]
