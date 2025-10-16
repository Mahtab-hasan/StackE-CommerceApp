import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <Image onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer' src={assets.logo} alt="" />
      <button
        type="button"
        aria-label="Logout"
        className={
          'bg-[#267426] text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm ' +
          'transform transition duration-200 ease-in-out hover:scale-105 hover:bg-[#325a3e] ' +
          'active:scale-100 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#267426]/60'
        }
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar