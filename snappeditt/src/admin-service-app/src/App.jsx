"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import ServiceList from "./pages/ServiceList"
import CategoryManagement from "./pages/CategoryManagement"
import ServiceForm from "./pages/ServiceForm"
import Header from "./components/Header"
import "./App.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/services" element={<ServiceList />} />
                <Route path="/services/new" element={<ServiceForm />} />
                <Route path="/services/edit/:categorySlug/:subCategorySlug/:serviceSlug" element={<ServiceForm />} />
                <Route path="/categories" element={<CategoryManagement />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

