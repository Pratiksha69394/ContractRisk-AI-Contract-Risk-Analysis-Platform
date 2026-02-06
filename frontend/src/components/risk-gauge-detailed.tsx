interface RiskGaugeDetailedProps {
  score: number
  level: string
  showLabels?: boolean
}

export default function RiskGaugeDetailed({ score, level, showLabels = true }: RiskGaugeDetailedProps) {
  const getColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444'
      case 'medium': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#94a3b8'
    }
  }

  const circumference = 2 * Math.PI * 50
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle
          cx="96"
          cy="96"
          r="50"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
        <circle
          cx="96"
          cy="96"
          r="50"
          fill="none"
          stroke={getColor(level)}
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">{score}</span>
        <span className="text-sm text-slate-500">Risk Score</span>
      </div>
      {showLabels && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs">
          <span className="text-green-600">Low</span>
          <span className="text-yellow-600">Med</span>
          <span className="text-red-600">High</span>
        </div>
      )}
    </div>
  )
}

