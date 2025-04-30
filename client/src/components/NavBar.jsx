import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { CiShoppingCart } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiMenuFries } from "react-icons/ci";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const NavBar = () => {
    const [open, setOpen] = useState(false);
    const { user, setUser, setShowUserLogin, seller,  navigate, axios, setSearchQuery, searchQuery, getCartCount } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if (data.success) {
                toast.success(data.message)
                setUser(null);
                navigate('/')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }
    }, [searchQuery])
    return (
        <nav className='flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all '>
            <NavLink to="/" onClick={() => setOpen(false)}> <h1 className='text-2xl md:text-3xl font-bold'>
                <span className='text-purple-500 hover:scale-115 transition-transform duration-300 inline-block'>
                    IN
                </span>
                sta Rush
            </h1>
            </NavLink>

            {/* desktop nav */}
            <div className='hidden sm:flex items-center gap-8'>
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/products" >All Products</NavLink>
                <p onClick={()=>{navigate('/seller');
                    {window.location.reload()}
                } } >Seller </p>

                <div className='hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full'>
                    <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder='Search products ' className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' />
                    <CiSearch className='w-5 h-5 cursor-pointer' />
                </div>
                <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
                    <CiShoppingCart className='w-6 h-6' />
                    <button className='absolute p-aut -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full'> {getCartCount()} </button>
                </div>

                {(!user ? (<button onClick={() => setShowUserLogin(true)} className='cursor-pointer px-8 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition'> Login</button>) : (
                    <div className='relative group'>
                        <img src={assets.profile_icon} alt="" className='w-10' />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30  z-40 text-sm rounded-md'>
                            <li onClick={() => navigate('my-orders')} className='cursor-pointer p-1.5 pl-3 hover:bg-purple-100 rounded-md'>My Orders</li>
                            <li onClick={logout} className='cursor-pointer p-1.5 pl-3 hover:bg-red-500/20 rounded-md'>Logout</li>
                        </ul>
                    </div>
                )
                )}    </div>


            <div className='sm:hidden flex items-center gap-6' >
                <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
                    <CiShoppingCart className='w-6 h-6' />
                    <button className='absolute p-aut -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full'> {getCartCount()} </button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label='menu'>
                    <CiMenuFries className='cursor-pointer' />
                </button>
            </div>

            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm sm:hidden`}>
                    <NavLink to="/" onClick={() => setOpen(false)} >Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)} >All Products</NavLink>
                    {user && <NavLink to="/products" onClick={() => setOpen(false)} >My Orders</NavLink>}
                    <NavLink to="/contact" onClick={() => setOpen(false)}> Contact</NavLink>
                    {
                        !user ? (
                            <button onClick={
                                () => {
                                    setShowUserLogin(true);
                                    setOpen(false);
                                }

                            } className='cursor-pointer px-6 py-2 mt-2 bg-purple-500 hover:bg-purple-600 transition text-white text-sm rounded-full' > LogIn</button>

                        ) : (
                            <button onClick={logout} className='cursor-pointer px-6 py-2 mt-2 bg-purple-500 hover:bg-purple-600 transition text-white text-sm rounded-full' > LogOut</button>

                        )
                    }
                </div>
            )}

        </nav>
    )
}

export default NavBar
