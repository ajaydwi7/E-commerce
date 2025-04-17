const BarChart = ({ data, title, subtitle, height = 200 }) => {
  const maxValue = Math.max(...data.map((item) => Math.max(item.value1, item.value2)))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div style={{ height: `${height}px` }} className="relative">
        <div className="flex h-full items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center space-x-1">
                <div
                  className="w-5 bg-blue-200 rounded-sm"
                  style={{ height: `${(item.value1 / maxValue) * 100}%` }}
                ></div>
                <div
                  className="w-5 bg-indigo-500 rounded-sm"
                  style={{ height: `${(item.value2 / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarChart

