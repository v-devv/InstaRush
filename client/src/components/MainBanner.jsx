import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.hero} alt=""  className='w-full hidden md:block'/>
        <img src={assets.hero_sm} alt=""  className='w-full md:hidden'/>
        <div className=' absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
            <h1 className='hidden md:block text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-105 leading-tight lg:leading-15'>From Our Hands to Your Doorstep — In Minutes</h1>
            <div className='bg-white p-2 rounded-lg shadow-sm md:bg-transparent md:p-0 md:rounded-none md:shadow-none  ' ><p >Shop now on —<span className='text-purple-400'>IN</span>sta Rush </p></div>
            <div className='flex items-center mt-6 font-medium'>
                <Link to="/products" className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-purple-500 hover:bg-purple-600 transition rounded text-white cursor-pointer'> Shop Now
                <img className='md:hidden transition group-hover:translate-x-1' src={assets.white_arrow_icon} alt="" />
                </Link>
                <Link className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer' to="/products"> Explore deals
                <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="" />
                </Link>
            </div> 
            <div className="absolute bottom-6 left-6 md:hidden px-4">
    <h1 className="text-xl font-bold text-black leading-tight max-w-xs">
      From Our Hands to Your Doorstep — In Minutes
    </h1>
  </div>
        </div>
    </div>
  )
}

export default MainBanner