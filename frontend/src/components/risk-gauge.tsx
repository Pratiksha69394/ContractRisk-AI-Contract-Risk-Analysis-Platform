interface RiskGaugeProps {
  score: number
  level: string
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const getColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444'
      case 'medium': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#94a3b8'
    }
  }

  const getBackgroundColor = (level: string) => {
    switch (level) {
      case 'high': return '#fef2f2'
      case 'medium': return '#fefce8'
      case 'low': return '#f0fdf4'
      default: return '#f8fafc'
    }
  }

  const getLabel = (level: string) => {
    switch (level) {
      case 'high': return 'High Risk'
      case 'medium': return 'Medium Risk'
      case 'low': return 'Low Risk'
      default: return 'Pending'
    }
  }

  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="40"
            fill="none"
            stroke={getColor(level)}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{score}</span>
          <span className="text-xs text-slate-500">Risk Score</span>
        </div>
      </div>
      <div
        className="mt-4 px-4 py-2 rounded-full text-sm font-medium"
        style={{ backgroundColor: getBackgroundColor(level), color: getColor(level) }}
      >
        {getLabel(level)}
      </div>
    </div>
  )
}

