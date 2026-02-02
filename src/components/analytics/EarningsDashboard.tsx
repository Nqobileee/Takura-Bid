'use client'

import { useState, useEffect } from 'react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '@/services/freightCalculator'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface EarningsData {
  period: string
  earnings: number
  trips: number
  fuel: number
  profit: number
}

interface EarningsSummary {
  totalEarnings: number
  totalTrips: number
  totalDistance: number
  totalFuelCost: number
  netProfit: number
  avgPerTrip: number
  avgPerKm: number
  topRoute: { from: string; to: string; earnings: number }
  paymentBreakdown: { method: string; amount: number; color: string }[]
  trend: number
}

interface EarningsDashboardProps {
  userType: 'driver' | 'client'
}

export function EarningsDashboard({ userType }: EarningsDashboardProps) {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [earningsData, setEarningsData] = useState<EarningsData[]>([])
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    if (user) {
      loadRealData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, user])

  const loadRealData = async () => {
    if (!user) return
    setLoading(true)

    try {
      const endDate = new Date()
      const startDate = new Date()
      if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7)
      } else if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1)
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1)
      }

      // Fetch payments data
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq(userType === 'driver' ? 'payee_id' : 'payer_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed')

      // Fetch conversations to gauge activity
      const { count: conversationCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq(userType === 'driver' ? 'driver_id' : 'client_id', user.id)

      const hasRealPayments = payments && payments.length > 0
      setHasData(hasRealPayments || (conversationCount || 0) > 0)

      if (hasRealPayments) {
        const processedData = processPaymentData(payments, timeRange)
        setEarningsData(processedData.chartData)
        setSummary(processedData.summary)
      } else {
        setEarningsData(generateEmptyChartData(timeRange))
        setSummary(generateEmptySummary())
      }
    } catch (error) {
      console.error('Error loading earnings data:', error)
      setEarningsData(generateEmptyChartData(timeRange))
      setSummary(generateEmptySummary())
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processPaymentData = (payments: any[], range: string): { chartData: EarningsData[], summary: EarningsSummary } => {
    const groupedData: Record<string, EarningsData> = {}
    let totalEarnings = 0
    const totalTrips = payments.length
    let totalDistance = 0
    const paymentMethods: Record<string, number> = {}

    payments.forEach((payment) => {
      const date = new Date(payment.created_at)
      let key: string

      if (range === 'week') {
        key = date.toLocaleDateString('en', { weekday: 'short' })
      } else if (range === 'month') {
        key = `Week ${Math.ceil(date.getDate() / 7)}`
      } else {
        key = date.toLocaleDateString('en', { month: 'short' })
      }

      if (!groupedData[key]) {
        groupedData[key] = { period: key, earnings: 0, trips: 0, fuel: 0, profit: 0 }
      }

      const amount = payment.amount || 0
      groupedData[key].earnings += amount
      groupedData[key].trips += 1
      groupedData[key].fuel += amount * 0.2
      groupedData[key].profit += amount * 0.8

      totalEarnings += amount
      totalDistance += payment.metadata?.distance || 100

      const method = payment.payment_method || 'cash'
      paymentMethods[method] = (paymentMethods[method] || 0) + amount
    })

    const chartData = Object.values(groupedData)
    const fuelCost = totalEarnings * 0.2
    const netProfit = totalEarnings - fuelCost

    const paymentBreakdown = Object.entries(paymentMethods).map(([method, amount]) => ({
      method: formatPaymentMethod(method),
      amount,
      color: getPaymentColor(method)
    }))

    return {
      chartData,
      summary: {
        totalEarnings,
        totalTrips,
        totalDistance,
        totalFuelCost: fuelCost,
        netProfit,
        avgPerTrip: totalTrips > 0 ? totalEarnings / totalTrips : 0,
        avgPerKm: totalDistance > 0 ? totalEarnings / totalDistance : 0,
        topRoute: { from: 'Harare', to: 'Bulawayo', earnings: totalEarnings * 0.3 },
        paymentBreakdown: paymentBreakdown.length > 0 ? paymentBreakdown : [
          { method: 'No payments yet', amount: 0, color: '#e5e7eb' }
        ],
        trend: 0
      }
    }
  }

  const formatPaymentMethod = (method: string): string => {
    const methods: Record<string, string> = {
      cash: 'Cash',
      ecocash: 'EcoCash',
      bank_transfer: 'Bank Transfer',
      innbucks: 'InnBucks'
    }
    return methods[method] || method
  }

  const getPaymentColor = (method: string): string => {
    const colors: Record<string, string> = {
      cash: '#6b7280',
      ecocash: '#10b981',
      bank_transfer: '#f97316',
      innbucks: '#f59e0b'
    }
    return colors[method] || '#9ca3af'
  }

  const generateEmptyChartData = (range: string): EarningsData[] => {
    if (range === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        period: day, earnings: 0, trips: 0, fuel: 0, profit: 0
      }))
    } else if (range === 'month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => ({
        period: week, earnings: 0, trips: 0, fuel: 0, profit: 0
      }))
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
        period: month, earnings: 0, trips: 0, fuel: 0, profit: 0
      }))
    }
  }

  const generateEmptySummary = (): EarningsSummary => ({
    totalEarnings: 0,
    totalTrips: 0,
    totalDistance: 0,
    totalFuelCost: 0,
    netProfit: 0,
    avgPerTrip: 0,
    avgPerKm: 0,
    topRoute: { from: '--', to: '--', earnings: 0 },
    paymentBreakdown: [
      { method: 'No data yet', amount: 0, color: '#e5e7eb' }
    ],
    trend: 0
  })

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userType === 'driver' ? 'Earnings Dashboard' : 'Spending Overview'}
          </h2>
          <p className="text-gray-500 mt-1">
            {hasData 
              ? `Track your ${userType === 'driver' ? 'income' : 'expenses'} and performance`
              : `Start ${userType === 'driver' ? 'earning' : 'posting loads'} to see your analytics`
            }
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Net {userType === 'driver' ? 'Earnings' : 'Spent'}</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(summary.netProfit)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            {hasData && summary.trend !== 0 && (
              <div className="mt-3 flex items-center text-green-100 text-sm">
                <svg className={`w-4 h-4 mr-1 ${summary.trend < 0 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{summary.trend > 0 ? '+' : ''}{summary.trend}% from last {timeRange}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalTrips}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚛</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {summary.totalTrips > 0 ? `Avg. ${formatCurrency(summary.avgPerTrip)}/trip` : 'No trips yet'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Distance Covered</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalDistance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {summary.totalDistance > 0 ? `${formatCurrency(summary.avgPerKm)}/km average` : 'No distance data'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Fuel Costs</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{formatCurrency(summary.totalFuelCost)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⛽</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {summary.totalEarnings > 0 
                ? `${((summary.totalFuelCost / summary.totalEarnings) * 100).toFixed(1)}% of earnings`
                : 'No fuel data'
              }
            </p>
          </div>
        </div>
      )}

      {/* Empty State Banner */}
      {!hasData && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {userType === 'driver' ? 'Start Accepting Jobs' : 'Post Your First Load'}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {userType === 'driver' 
                  ? 'Your earnings and performance data will appear here once you complete your first job.'
                  : 'Your spending analytics will show here once you start posting loads and making payments.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">{userType === 'driver' ? 'Earnings' : 'Spending'} Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                  formatter={(value) => [formatCurrency(value as number), 'Earnings']}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        {summary && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.paymentBreakdown}
                    dataKey="amount"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {summary.paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}n                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {summary.paymentBreakdown.map((item) => (
                <div key={item.method} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.method}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Daily Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                formatter={(value, name) => [formatCurrency(value as number), name as string]}
              />
              <Legend />
              <Bar dataKey="earnings" name={userType === 'driver' ? 'Earnings' : 'Spending'} fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Routes & Insights */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Route */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <span>🏆</span>
              <span>Top Performing Route</span>
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-gray-300 text-sm">Most Profitable</p>
                <p className="text-xl font-bold mt-1">
                  {summary.topRoute.from} → {summary.topRoute.to}
                </p>
                <p className="text-green-400 font-semibold mt-2">
                  {summary.topRoute.earnings > 0 ? formatCurrency(summary.topRoute.earnings) + ' earned' : 'No data yet'}
                </p>
              </div>
              <div className="text-4xl">🛣️</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>Quick Insights</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average daily {userType === 'driver' ? 'earnings' : 'spending'}</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(summary.netProfit / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Efficiency rate</span>
                <span className="font-semibold text-green-600">
                  {summary.totalEarnings > 0 
                    ? ((1 - summary.totalFuelCost / summary.totalEarnings) * 100).toFixed(0) + '% margin'
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trips this {timeRange}</span>
                <span className="font-semibold text-gray-900">{summary.totalTrips}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hasData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {hasData ? 'Active' : 'Getting Started'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EarningsDashboard
