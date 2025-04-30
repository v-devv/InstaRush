import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SellerLogin = () => {
    const {seller , axios ,setSeller , navigate} = useAppContext()

    const [ email , setEmail] = useState("")
    const [ password , setPassword] = useState("")

    const onSubmitHandler = async (e)=>{
        try {
            e.preventDefault();
            const {data} =await axios.post('/api/seller/login' , { email , password});
            if(data.success){
                setSeller(true);
                navigate('/seller')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
       
    }
    useEffect(()=>{
        if(seller){
            navigate("/seller")
        }
    } , [seller])

  return !seller && (
  <form action="" onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600' >
     <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg border border-gray-200 shadow-xl'>
        <p className='text-2xl font-medium m-auto'> <span className='text-purple-500'>Seller </span>Login </p>
        <div className='w-full'>
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value) } value={email} type="email" placeholder='Enter your email' className='border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500' required />
        </div>
        <div className='w-full'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password"  placeholder='Enter your password' className='border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500' required />
        </div>
        <button  className='bg-purple-500 text-white w-full py-2 rounded-md cursor-pointer'>Login</button>
     </div>
     
  </form>
  )
}

export default SellerLogin