"use client"

import { useState } from "react"
import { Search, Bell, HelpCircle, Sun, ChevronDown } from "lucide-react"

const Header = ({ title, dateRange }) => {
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {dateRange && (
          <div className="hidden md:flex items-center border border-gray-300 rounded-md px-3 py-1.5 text-sm">
            <span>{dateRange}</span>
          </div>
        )}

        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <Search className="w-5 h-5" />
        </button>

        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </button>
        </div>

        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <Sun className="w-5 h-5" />
        </button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden">
            <img src="/placeholder-user.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="ml-2 hidden md:block">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Acme Inc.</span>
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

