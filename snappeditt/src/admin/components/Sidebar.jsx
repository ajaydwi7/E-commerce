"use client"
import { Link, useLocation } from "react-router-dom"
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
  TicketIcon,
  CogIcon,
  UsersIcon,
  BellIcon,
  MailIcon,
  DocumentTextIcon,
} from "./Icons"

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon },
    { name: "Users", path: "/admin/users", icon: UserIcon },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCartIcon },
    { name: "Services", path: "/admin/services", icon: CubeIcon },
    { name: "Categories", path: "/admin/categories", icon: TagIcon },
    { name: "Coupons", path: "/admin/coupons", icon: TicketIcon },
    { name: "Admins", path: "/admin/admins", icon: UsersIcon },
    { name: "Notifications", path: "/admin/notifications", icon: BellIcon },
    { name: "Settings", path: "/admin/settings", icon: CogIcon },
    { name: "Contact Forms", path: "/admin/contact-forms", icon: MailIcon },
    { name: "Free Trials", path: "/admin/free-trials", icon: DocumentTextIcon },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">SnappEditt</span>
          </div>
          <button className="text-white md:hidden" onClick={toggleSidebar}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive(item.path) ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600"
                }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${isActive(item.path) ? "text-white" : "text-indigo-300 group-hover:text-white"
                  }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
