import React, { useRef, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { CiShoppingCart } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiMenuFries } from "react-icons/ci";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const NavBar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const { user, setUser, setShowUserLogin, seller, navigate, axios, setSearchQuery, searchQuery, getCartCount, setDarkMode, darkMode } = useAppContext();
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
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && buttonRef.current &&
                !buttonRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        const handleScroll = () => {
            setOpen(false);
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [open]);
    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }
    }, [searchQuery])

    return (
        <nav className='fixed top-0 left-0 w-full z-50 flex rounded items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white shadow transition-all'>

            <NavLink to="/" onClick={() => setOpen(false)}> <h1 className='text-2xl md:text-3xl font-bold group'>
                <span style={{ background: ' linear-gradient(to right, #187CFA, #D210B0, #604AE9)' }} className='rounded' >
                    <span className='text-white group-hover:scale-108 transition-transform duration-300 inline-block px-1.5 py-1'>
                        IN
                    </span>
                </span>
                sta Rush
            </h1>
            </NavLink>

            {/* desktop nav */}
            <div className='hidden sm:flex items-center gap-8'>
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/products" >All Products</NavLink>
                <span
                    className='cursor-pointer'
                    onClick={() => {
                        setOpen(false);
                        if (seller) {
                            navigate('/seller');
                        } else {
                            navigate('/seller');
                        }
                    }}
                >
                    Seller
                </span>
                {user && <span >Welcome ,<p className='font-semibold'> {user?.name?.split(" ")[0]}</p></span>}



                <div className='hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full'>
                    <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder='Search products ' className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' />
                    <CiSearch className='w-5 h-5 cursor-pointer' />
                </div>
                <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
                    <CiShoppingCart className='w-6 h-6' />
                    <button className='absolute p-auto -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full'> {getCartCount()} </button>
                </div>

                {(!user ? (<button onClick={() => setShowUserLogin(true)} className='cursor-pointer px-8 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition'> Login</button>) : (
                    <div className='relative group'>
                        <img src={assets.profile_icon} alt="" className='w-10' />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30  z-40 text-sm rounded-md'>
                            <li className='cursor-pointer p-1.5 pl-3 hover:bg-gray-300 rounded-md' onClick={() => setDarkMode(!darkMode)}>
                                Dark Mode
                            </li>

                            <li onClick={() => navigate('my-orders')} className='cursor-pointer p-1.5 pl-3 hover:bg-purple-100 rounded-md'>My Orders</li>
                            <li onClick={logout} className='cursor-pointer p-1.5 pl-3 hover:bg-red-500/20 rounded-md'>Logout</li>
                        </ul>
                    </div>
                )
                )}    </div>


            <div className='sm:hidden flex items-center gap-6' >
                <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
                    <CiShoppingCart className='w-6 h-6' />
                    <button className='absolute p-auto -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full'> {getCartCount()} </button>
                </div>

                <button ref={buttonRef} onClick={() => setOpen(!open)} aria-label='menu'>

                    <CiMenuFries className='cursor-pointer' />
                </button>
            </div>

            {open && (
                <div ref={menuRef}   className={`absolute top-full right-0 z-10 
  bg-white shadow-md py-4 w-[60vw] flex flex-col items-start gap-4 px-5 text-sm sm:hidden border border-purple-500 rounded-l-2xl
  transition-all duration-300
  ${open ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"}`}>

                    <NavLink to="/" className="w-full px-4 py-2 hover:bg-gray-500/50 hover:text-white rounded" onClick={() => setOpen(false)} >Home</NavLink>
                    <span
                        
                        className="w-full px-4 py-2 hover:bg-gray-500/50 hover:text-white rounded cursor-pointer" 
                        onClick={() => {
                            setOpen(false);
                            if (seller) {
                                navigate('/seller');
                            } else {
                                navigate('/seller');
                            }
                        }}
                    >
                        Seller
                    </span>
                    <NavLink to="/products" className="w-full px-4 py-2 hover:bg-gray-500/50 hover:text-white rounded"  onClick={() => setOpen(false)} >All Products</NavLink>
                    {user && <NavLink className="w-full px-4 py-2 hover:bg-gray-500/50 hover:text-white rounded"  to="/my-orders" onClick={() => setOpen(false)} >My Orders</NavLink>}
                    <NavLink to="/contact" className="w-full px-4 py-2 hover:bg-gray-500/50 hover:text-white rounded"  onClick={() => setOpen(false)}> Contact</NavLink>
                    <div className='border-b border-gray-500 w-full'></div>
                    {
                        !user ? (
                            <button onClick={
                                () => {
                                    setShowUserLogin(true);
                                    setOpen(false);
                                }

                            } className='cursor-pointer mx-auto px-8 py-2 font-medium mt-1 background-clr transition text-white text-m rounded-full' > LogIn</button>

                        ) : (
                            
                            <button onClick={logout} className='cursor-pointer mx-auto px-8 py-2 font-medium mt-1 background-clr transition text-white text-m rounded-full'  > LogOut</button>

                        )
                    }
                </div>
            )}

        </nav>
    )
}

export default NavBar
