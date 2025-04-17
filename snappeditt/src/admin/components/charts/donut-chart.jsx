const DonutChart = ({ data, title, colors = ["#8b5cf6", "#60a5fa", "#34d399", "#fbbf24"] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercent = 0

  const segments = data.map((item, index) => {
    const percent = (item.value / total) * 100
    const startPercent = cumulativePercent
    cumulativePercent += percent

    return {
      ...item,
      percent,
      startPercent,
      endPercent: cumulativePercent,
      color: colors[index % colors.length],
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, index) => {
              const startAngle = (segment.startPercent / 100) * 360
              const endAngle = (segment.endPercent / 100) * 360

              const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180))
              const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180))
              const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180))
              const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180))

              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

              const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

              return <path key={index} d={pathData} fill={segment.color} />
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default DonutChart

