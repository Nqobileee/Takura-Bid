'use client'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Flexible interface for message chart data
interface MessageChartData {
  name: string
  sent: number
  received: number
}

// Flexible interface for activity chart data  
interface ActivityChartData {
  name: string
  messages: number
  conversations: number
}

interface MessagesChartProps {
  data: MessageChartData[]
}

interface ActivityChartProps {
  data: ActivityChartData[]
}

export function MessagesLineChart({ data }: MessagesChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No message data yet. Start chatting to see analytics!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sent" 
          name="Messages Sent"
          stroke="#f97316" 
          strokeWidth={2}
          dot={{ fill: '#f97316', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#f97316' }}
        />
        <Line 
          type="monotone" 
          dataKey="received" 
          name="Messages Received"
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#10b981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MessagesAreaChart({ data }: MessagesChartProps) {
  const chartData = data.map(d => ({
    ...d,
    total: d.sent + d.received
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No message data yet. Start chatting to see analytics!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="sent" 
          name="Sent"
          stroke="#f97316" 
          fillOpacity={1}
          fill="url(#colorSent)"
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="received" 
          name="Received"
          stroke="#10b981" 
          fillOpacity={1}
          fill="url(#colorReceived)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface MessagesBarChartProps {
  sent: number
  received: number
}

export function MessagesBarChart({ sent, received }: MessagesBarChartProps) {
  const data = [
    { name: 'Sent', value: sent, fill: '#f97316' },
    { name: 'Received', value: received, fill: '#10b981' }
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" stroke="#6b7280" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="value" name="Messages" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface ConversationsPieChartProps {
  active: number
  total: number
}

export function ConversationsPieChart({ active, total }: ConversationsPieChartProps) {
  const inactive = total - active
  const data = [
    { name: 'Active', value: active || 0, fill: '#10b981' },
    { name: 'Inactive', value: inactive > 0 ? inactive : 0, fill: '#e5e7eb' }
  ]

  const COLORS = ['#10b981', '#e5e7eb']

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No conversations yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function WeeklyActivityChart({ data }: ActivityChartProps) {
  const chartData = data.map(d => ({
    day: d.name,
    activity: d.messages
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-sm">No activity data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar 
          dataKey="activity" 
          name="Total Activity" 
          fill="#f97316" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface ResponseTimeGaugeProps {
  value: number
  maxValue: number
}

export function ResponseTimeGauge({ value, maxValue }: ResponseTimeGaugeProps) {
  // Value is in minutes
  const displayTime = value < 1 ? `${Math.round(value * 60)}s` : `${Math.round(value)}m`
  
  // Calculate percentage
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  // Color based on response time (in minutes)
  const getColor = () => {
    if (value < 5) return '#10b981' // Green - under 5 min
    if (value < 15) return '#f59e0b' // Yellow - under 15 min
    return '#ef4444' // Red - over 15 min
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{displayTime}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">Avg Response Time</p>
    </div>
  )
}
