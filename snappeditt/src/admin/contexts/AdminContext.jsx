"use client"

import { createContext, useContext, useState, useEffect } from "react"
import * as adminApi from "../api/adminApi"

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Check if admin is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const data = await adminApi.checkAuthStatus()

        if (data.authenticated) {
          setAdmin(data.admin)
          fetchNotifications()
        } else {
          setAdmin(null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setError(err.message)
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await adminApi.getNotifications()
      if (Array.isArray(data)) {
        setNotifications(data)
        setUnreadCount(data.filter((notification) => !notification.read).length)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)
      const data = await adminApi.loginAdmin(credentials)
      setAdmin(data)
      fetchNotifications()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      await adminApi.logoutAdmin()
      setAdmin(null)
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await adminApi.markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await adminApi.markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      const updatedProfile = await adminApi.updateAdminProfile(profileData)
      setAdmin((prev) => ({ ...prev, ...updatedProfile }))
      return updatedProfile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true)
      const result = await adminApi.changeAdminPassword(passwordData)
      setLoading(false)
      return result
    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }

  const updateAdmin = async (adminId, adminData) => {
    try {
      setLoading(true)
      const result = await adminApi.updateAdmin(adminId, adminData)
      setLoading(false)
      return result
    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }

  const value = {
    admin,
    loading,
    error,
    notifications,
    unreadCount,
    login,
    logout,
    markAsRead,
    markAllAsRead,
    updateProfile,
    changePassword,
    fetchNotifications,
    updateAdmin
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}