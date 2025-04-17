const LineChart = ({ data, title, value, change, changeType, height = 80 }) => {
  const isPositive = changeType === "positive"
  const points = data.map((value, index) => `${index * (100 / (data.length - 1))},${100 - value}`).join(" ")

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">REAL TIME VALUE</h3>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
            i
          </div>
        </div>
      </div>

      <div className="flex items-baseline mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
        <span
          className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
        >
          {isPositive ? "+" : ""}
          {change}
        </span>
      </div>

      <div style={{ height: `${height}px` }} className="w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default LineChart

