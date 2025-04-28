import React from 'react'
import { useAuth } from '../../context/authContext'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { t } = useTranslation();

  return (
    <div className='flex items-center text-white justify-between h-12 bg-teal-600 px-5'>
      <p>{t('Welcome')}, {user.name}</p>
      <button className='px-4 py-1 bg-teal-700 hover:bg-teal-800' onClick={logout}>
        {t('Logout')}
      </button>
    </div>
  )
}

export default Navbar
