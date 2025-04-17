import { MoreHorizontal } from "lucide-react"

const StatsCard = ({ title, value, change, changeType, chartData }) => {
  const isPositive = changeType === "positive"

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
          <span
            className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
          >
            {isPositive ? "+" : ""}
            {change}
          </span>
        </div>
      </div>

      <div className="h-16 w-full">
        {chartData && (
          <svg className="w-full h-full" viewBox="0 0 300 60">
            <path
              d={chartData}
              fill="none"
              stroke={isPositive ? "#8b5cf6" : "#8b5cf6"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default StatsCard

