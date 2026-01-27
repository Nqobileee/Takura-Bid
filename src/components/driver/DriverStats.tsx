'use client'

export function DriverStats() {
  const statsData = [
    {
      label: 'Total Earnings',
      value: '$27,000',
    },
    {
      label: 'Average Rating', 
      value: '4.8',
    },
  ]

  return (
    <div className="stats-grid mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}