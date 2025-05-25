import React from 'react'
import { useAuth } from '../context/authContext'
import AccountantSidebar from '../components/AccountantDashboard/AccountantSidebar'
import AccountantNavbar from '../components/AccountantDashboard/AccountantNavbar'
import { Outlet } from 'react-router-dom'

const AccountantDashboard = () => {
  const {user} = useAuth()
 
  return (
    <div className='flex'>
      <AccountantSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <AccountantNavbar />
        <Outlet />
      </div>
    </div>
  )
}

export default AccountantDashboard