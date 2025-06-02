import React from 'react'
import { useAuth } from '../../context/authContext'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between h-12 bg-teal-600 px-4 text-white w-full">
      {/* Контейнер слева, с Welcome (прячется на мобилках) */}
      <div className="flex-1">
        <p className="hidden md:block text-sm truncate">
          {t('Welcome')}, {user.name}
        </p>
      </div>

      {/* Кнопка справа с отступом справа */}
      <div className="mr-4">
        <button
          className="px-3 py-1 text-xs md:text-sm bg-teal-700 hover:bg-teal-800 rounded"
          onClick={logout}
        >
          {t('Logout')}
        </button>
      </div>
    </div>
  )
}

export default Navbar
