"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CubeIcon, TagIcon, UserIcon, ShoppingCartIcon, DollarSignIcon } from "../components/Icons"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

function Dashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalRefunds: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [salesData, setSalesData] = useState(null)
  const [countriesData, setCountriesData] = useState(null)
  const [salesVsRefundsData, setSalesVsRefundsData] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        // Fetch categories and services data
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_URL}/services/categories-with-subcategories`)
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories data")
        }
        const categoriesData = await categoriesResponse.json()

        // Fetch orders data - use limit=0 to get all orders for stats
        const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/order/get-all-orders?limit=0`)
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders data")
        }
        const ordersData = await ordersResponse.json()

        // Fetch users data
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          credentials: "include",
        })
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users data")
        }
        const usersData = await usersResponse.json()

        // Calculate stats
        const totalCategories = categoriesData.length
        const totalSubcategories = categoriesData.reduce((acc, category) => acc + category.subCategories.length, 0)
        const totalServices = categoriesData.reduce(
          (acc, category) =>
            acc +
            category.subCategories.reduce((subAcc, subcategory) => subAcc + (subcategory.services?.length || 0), 0),
          0,
        )
        const allOrders = ordersData.orders || []
        const totalOrders = ordersData.total || allOrders.length

        const totalUsers = usersData.length

        // Calculate revenue and refunds
        const totalRevenue = allOrders
          .filter((order) => order.status !== "Cancelled" && order.paymentStatus === "Completed")
          .reduce((acc, order) => acc + order.totalCost, 0)

        const totalRefunds = allOrders
          .filter((order) => order.paymentStatus === "Refunded")
          .reduce((acc, order) => acc + order.totalCost, 0)

        setStats({
          totalServices,
          totalCategories,
          totalSubcategories,
          totalOrders,
          totalUsers,
          totalRevenue,
          totalRefunds,
        })

        // Prepare sales data (last 6 months)
        prepareSalesData(allOrders)

        // Prepare countries data
        prepareCountriesData(allOrders)

        // Prepare sales vs refunds data
        prepareSalesVsRefundsData(allOrders)

        // Prepare recent transactions - get the 5 most recent orders
        const recent = allOrders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((order) => ({
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString(),
            customer: order.billingDetails?.name || "Unknown",
            amount: order.totalCost,
            status: order.status,
            paymentStatus: order.paymentStatus,
          }))

        setRecentTransactions(recent)

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Prepare sales data for the chart (last 6 months)
  const prepareSalesData = (ordersData) => {
    const months = []
    const salesByMonth = []

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString("default", { month: "short" })
      months.push(monthName)

      const year = date.getFullYear()
      const month = date.getMonth()

      // Filter orders for this month and sum up the total
      const monthlyTotal = ordersData
        .filter((order) => {
          const orderDate = new Date(order.createdAt)
          return (
            orderDate.getFullYear() === year &&
            orderDate.getMonth() === month &&
            order.status !== "Cancelled" &&
            order.paymentStatus === "Completed"
          )
        })
        .reduce((acc, order) => acc + order.totalCost, 0)

      salesByMonth.push(monthlyTotal)
    }

    setSalesData({
      labels: months,
      datasets: [
        {
          label: "Monthly Sales",
          data: salesByMonth,
          borderColor: "rgb(79, 70, 229)",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    })
  }

  // Prepare countries data for the chart
  const prepareCountriesData = (ordersData) => {
    // Extract countries from billing details
    const countryCounts = {}

    ordersData.forEach((order) => {
      if (order.billingDetails?.state) {
        const state = order.billingDetails.state
        countryCounts[state] = (countryCounts[state] || 0) + 1
      }
    })

    // Get top 5 countries
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    setCountriesData({
      labels: topCountries.map(([country]) => country),
      datasets: [
        {
          label: "Orders by State",
          data: topCountries.map(([, count]) => count),
          backgroundColor: [
            "rgba(79, 70, 229, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    })
  }

  // Prepare sales vs refunds data
  const prepareSalesVsRefundsData = (ordersData) => {
    // Calculate total sales and refunds
    const sales = ordersData
      .filter((order) => order.status !== "Cancelled" && order.paymentStatus === "Completed")
      .reduce((acc, order) => acc + order.totalCost, 0)

    const refunds = ordersData
      .filter((order) => order.paymentStatus === "Refunded")
      .reduce((acc, order) => acc + order.totalCost, 0)

    setSalesVsRefundsData({
      labels: ["Sales", "Refunds"],
      datasets: [
        {
          data: [sales, refunds],
          backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(239, 68, 68, 0.8)"],
          borderWidth: 1,
        },
      ],
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading dashboard data: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <CubeIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Services</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <TagIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Categories</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <TagIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Subcategories</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalSubcategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <ShoppingCartIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Orders</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Users</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <DollarSignIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-64">
            {salesData && (
              <Line
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => "$" + value,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Sales by State */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Orders by State</h2>
          <div className="h-64">
            {countriesData && (
              <Bar
                data={countriesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Additional Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales vs Refunds */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales vs Refunds</h2>
          <div className="h-64 flex items-center justify-center">
            {salesVsRefundsData && (
              <Doughnut
                data={salesVsRefundsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toFixed(2)}`,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                      No recent transactions
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all transactions →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/services/new"
              className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
            >
              Add New Service
            </Link>
            <Link
              to="/admin/categories"
              className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50"
            >
              Manage Categories
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50"
            >
              View Orders
            </Link>
            <Link
              to="/admin/users"
              className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50"
            >
              Manage Users
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Connection</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Processing</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-600">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
