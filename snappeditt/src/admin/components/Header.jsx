"use client"
import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Bars3Icon, BellIcon, UserIcon, CogIcon } from "./Icons"
import { useAdmin } from "../contexts/AdminContext"
import { useOnClickOutside } from "../hooks/useOnClickOutside"

function Header({ toggleSidebar }) {
  const { admin, notifications, unreadCount, markAsRead, markAllAsRead, logout, fetchNotifications } = useAdmin()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useOnClickOutside(notificationRef, () => setShowNotifications(false))
  useOnClickOutside(profileRef, () => setShowProfileMenu(false))

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "A"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Generate background color based on name
  const getProfileColor = (name) => {
    if (!name) return "bg-indigo-600"

    const colors = [
      "bg-indigo-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-teal-600",
    ]

    // Simple hash function to get consistent color
    let hash = 0
    for (let i = 0; i < name?.length || 0; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/admin/auth/signin"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return (
          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </span>
        )
      case "user":
        return (
          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserIcon className="h-5 w-5" />
          </span>
        )
      case "contact":
        return (
          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
        )
      case "trial":
        return (
          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        )
      default:
        return (
          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        )
    }
  }

  // Get notification link based on type and related document
  const getNotificationLink = (notification) => {
    if (!notification?.relatedDocument) return null

    switch (notification.type) {
      case "order":
        return `/admin/orders/${notification.relatedDocument}`
      case "user":
        return `/admin/users/${notification.relatedDocument}`
      case "contact":
        return `/admin/contact-forms`
      case "trial":
        return `/admin/trial-requests`
      default:
        return null
    }
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="text-xl font-bold text-indigo-600">
                Service Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white font-bold flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-800">
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {!notifications || notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications</div>
                      ) : (
                        notifications.map((notification) => {
                          const notificationLink = getNotificationLink(notification)
                          return (
                            <div
                              key={notification._id}
                              className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? "bg-indigo-50" : ""} cursor-pointer`}
                              onClick={() => {
                                if (!notification.read) markAsRead(notification._id)
                                setShowNotifications(false)
                                // Navigate to relevant page based on notification type
                                if (notificationLink) window.location.href = notificationLink
                              }}
                            >
                              <div className="flex items-start">
                                {getNotificationIcon(notification.type)}
                                <div className="ml-3 flex-1">
                                  <p
                                    className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <Link
                        to="/admin/notifications"
                        className="block text-center text-xs text-indigo-600 hover:text-indigo-800"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className="flex items-center focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div
                  className={`h-8 w-8 rounded-full ${getProfileColor(admin?.fullName)} flex items-center justify-center text-white font-medium overflow-hidden`}
                >
                  {getInitials(admin?.fullName)}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {admin?.fullName || "Admin"}
                </span>
              </button>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <CogIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

