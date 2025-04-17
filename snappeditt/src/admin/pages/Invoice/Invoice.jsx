import { useState } from "react"
import { Search, ChevronDown, Link, Download, Trash2 } from "lucide-react"
import Header from "../../components/Header/Header"

const invoices = [
  {
    id: "#143567",
    total: "$129.00",
    status: "Overdue",
    customer: "Dominik Lamakani",
    issuedOn: "22/07/2024",
    paidOn: "-",
    type: "Subscription",
  },
  {
    id: "#143536",
    total: "$59.00",
    status: "Paid",
    customer: "Mark Cameron",
    issuedOn: "19/07/2024",
    paidOn: "20/07/2024",
    type: "Subscription",
  },
  {
    id: "#143599",
    total: "$89.00",
    status: "Paid",
    customer: "Sergio Gonnelli",
    issuedOn: "17/07/2024",
    paidOn: "19/07/2024",
    type: "One-time",
  },
  {
    id: "#143567",
    total: "$129.00",
    status: "Due",
    customer: "Manuel Garbaya",
    issuedOn: "04/07/2024",
    paidOn: "-",
    type: "Subscription",
  },
  {
    id: "#143636",
    total: "$129.00",
    status: "Due",
    customer: "Cool Robot",
    issuedOn: "04/07/2024",
    paidOn: "-",
    type: "Subscription",
  },
]

const Invoice = () => {
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [filterStatus, setFilterStatus] = useState("all")

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(invoices.map((invoice) => invoice.id))
    } else {
      setSelectedInvoices([])
    }
  }

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "due":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Header title="Invoice" dateRange="Mar 19, 2025 - Mar 25, 2025" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by invoice ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
            Create Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {["All", "Paid", "Due", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status.toLowerCase())}
              className={`px-4 py-2 rounded-md ${filterStatus === status.toLowerCase()
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {status}
              <span className="ml-2 text-sm text-gray-500">
                {status === "All" ? "67" : status === "Paid" ? "14" : status === "Due" ? "34" : "19"}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedInvoices.length === invoices.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issued On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={() => handleSelectInvoice(invoice.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.issuedOn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.paidOn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {invoice.type === "Subscription" ? (
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.5 12c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.5 13.75c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M12 7.5v9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {invoice.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <Link size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">Showing 1 to 10 of 467 results</div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Invoice

