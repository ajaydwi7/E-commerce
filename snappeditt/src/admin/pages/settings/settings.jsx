"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "../../contexts/AdminContext"
import { UserIcon, BellIcon, ShieldCheckIcon, KeyIcon } from "../../components/Icons"

const Settings = () => {
  const { admin, updateProfile, changePassword } = useAdmin()
  const [activeTab, setActiveTab] = useState("account")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newOrders: true,
      newUsers: true,
      contactForm: true,
      trialRequests: true,
    },
    pushNotifications: {
      enabled: true,
      newOrders: true,
      newUsers: true,
      contactForm: true,
      trialRequests: true,
    },
  })

  // Load admin data when available
  useEffect(() => {
    if (admin) {
      setProfileForm({
        fullName: admin.fullName || "",
        email: admin.email || "",
      })
    }
  }, [admin])

  const tabs = [
    { id: "account", label: "Account", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
  ]

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile(profileForm)
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setSuccess("Password changed successfully")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Simulate API call
    setTimeout(() => {
      setSuccess("Notification settings updated successfully")
      setLoading(false)
    }, 500)
  }

  // Generate avatar from name
  const getInitials = (name) => {
    if (!name) return "A"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

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
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Success and error messages */}
        {success && <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">{success}</div>}
        {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 text-sm font-medium ${activeTab === tab.id
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <tab.icon className={`mr-2 h-5 w-5 ${activeTab === tab.id ? "text-indigo-500" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Profile</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center">
                        <div
                          className={`w-16 h-16 rounded-full ${getProfileColor(admin?.fullName)} flex items-center justify-center text-white text-xl font-medium overflow-hidden`}
                        >
                          {getInitials(admin?.fullName)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin?.fullName || "Admin User"}</div>
                          <div className="text-sm text-gray-500">{admin?.email || "admin@example.com"}</div>
                          <div className="text-xs text-gray-500 mt-1">Role: {admin?.role || "Admin"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>

                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h4>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-orders"
                            name="email-orders"
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.newOrders}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  newOrders: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-orders" className="font-medium text-gray-700">
                            New Orders
                          </label>
                          <p className="text-gray-500">Get notified when a new order is placed.</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-users"
                            name="email-users"
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.newUsers}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  newUsers: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-users" className="font-medium text-gray-700">
                            New Users
                          </label>
                          <p className="text-gray-500">Get notified when a new user registers.</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-contact"
                            name="email-contact"
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.contactForm}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  contactForm: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-contact" className="font-medium text-gray-700">
                            Contact Form Submissions
                          </label>
                          <p className="text-gray-500">Get notified when someone submits the contact form.</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-trial"
                            name="email-trial"
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.trialRequests}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: {
                                  ...notificationSettings.emailNotifications,
                                  trialRequests: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-trial" className="font-medium text-gray-700">
                            Free Trial Requests
                          </label>
                          <p className="text-gray-500">Get notified when someone requests a free trial.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Push Notifications</h4>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="push-enabled"
                            name="push-enabled"
                            type="checkbox"
                            checked={notificationSettings.pushNotifications.enabled}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                pushNotifications: {
                                  ...notificationSettings.pushNotifications,
                                  enabled: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push-enabled" className="font-medium text-gray-700">
                            Enable Push Notifications
                          </label>
                          <p className="text-gray-500">Allow browser push notifications.</p>
                        </div>
                      </div>

                      {notificationSettings.pushNotifications.enabled && (
                        <>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-orders"
                                name="push-orders"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications.newOrders}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    pushNotifications: {
                                      ...notificationSettings.pushNotifications,
                                      newOrders: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-orders" className="font-medium text-gray-700">
                                New Orders
                              </label>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-users"
                                name="push-users"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications.newUsers}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    pushNotifications: {
                                      ...notificationSettings.pushNotifications,
                                      newUsers: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-users" className="font-medium text-gray-700">
                                New Users
                              </label>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-contact"
                                name="push-contact"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications.contactForm}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    pushNotifications: {
                                      ...notificationSettings.pushNotifications,
                                      contactForm: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-contact" className="font-medium text-gray-700">
                                Contact Form Submissions
                              </label>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-trial"
                                name="push-trial"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications.trialRequests}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    pushNotifications: {
                                      ...notificationSettings.pushNotifications,
                                      trialRequests: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-trial" className="font-medium text-gray-700">
                                Free Trial Requests
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save notification settings"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                      <KeyIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Change Password
                    </h4>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gray-50 p-4 rounded-md">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Two-Factor Authentication
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enable-2fa"
                            name="enable-2fa"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enable-2fa" className="font-medium text-gray-700">
                            Enable Two-Factor Authentication
                          </label>
                          <p className="text-gray-500">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500"
                        >
                          Set Up Two-Factor Authentication
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Session Management</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-4">
                        You're currently signed in on this device. If you see any sessions you don't recognize, sign out
                        of those sessions.
                      </p>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="px-4 py-3 bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                          Current Session
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Current Browser</div>
                            <div className="text-xs text-gray-500">Last active: Just now</div>
                          </div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500"
                        >
                          Sign Out All Other Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

