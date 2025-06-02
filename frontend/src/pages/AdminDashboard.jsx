import React, { useState } from 'react'
import { useAuth } from '../context/authContext'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import { Outlet } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Мобильное меню: показываем только если меню закрыто */}
      {!sidebarOpen && (
        <div className="md:hidden absolute top-4 left-4 z-50">
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Контент */}
      <div className='flex-1 bg-gray-100 overflow-y-auto w-full'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}


export default AdminDashboard
