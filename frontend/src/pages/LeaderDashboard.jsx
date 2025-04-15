import React from 'react'
import { useAuth } from '../../context/authContext'
import LeaderSidebar from './LeaderSidebar'
import Navbar from '../dashboard/Navbar'
import { Outlet } from 'react-router-dom'

const LeaderDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex">
      <LeaderSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default LeaderDashboard
