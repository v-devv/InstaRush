import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const InputField = ({type , placeholder , name , handleChange , address })=>(
  <input className=' w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-purple-500 transition'
  type={type}
  placeholder={placeholder}
  onChange={handleChange}
  name={name}
  value={address[name]}
  required
  />
)
const AddAddress = () => {
  const {axios , user , navigate} =useAppContext();
  const [address , setAddress] = useState({
    firstName : '',
    lastName : '',
    email : '' ,
    street :'',
    city : '',
    state : '',
    zipcode : '',
    county: '',
    phone : '',
    ratings : '',
  })
  const handleChange = (e)=>{
    const {name , value} = e.target;
    setAddress((prev)=>({
      ...prev,
      [name] : value,
    }))
  } 
  const onSubmit = async (e)=>{
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/address/add' ,{address , userId: user._id,});
      if(data.success){
        toast.success(data.message);
        navigate('/cart');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.error);
    }
  }



  useEffect(()=>{
    if(!user){
      navigate('/cart')
    }
  } , [])
  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
         <span className='font-semibold text-purple-500'> Address</span> 
         </p>
         <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
          <div className='flex-1 max-w-md'>
            <form onSubmit={onSubmit} className='space-y-3 mt-6 text-sm'  >

              <div className='grid grid-cols-2 gap-4'>
                <InputField handleChange={handleChange}  address={address} name='firstName' type="text" placeholder="First Name" /> 
                <InputField handleChange={handleChange}  address={address} name='lastName' type="text" placeholder="Last Name" /> 
              </div>


              <InputField handleChange={handleChange}  address={address} name='email' type="email" placeholder="Email Address" /> 
              <InputField handleChange={handleChange}  address={address} name='street' type="text" placeholder="Street" /> 


              <div className='grid grid-cols-2 gap-4'>

              <InputField handleChange={handleChange}  address={address} name='city' type="text" placeholder=" City" /> 
              <InputField handleChange={handleChange}  address={address} name='state' type="text" placeholder="State" /> 
              </div>

              <div className='grid grid-cols-2 gap-4'>

              <InputField handleChange={handleChange}  address={address} name='zipcode' type="number" placeholder=" Zip Code" /> 
              <InputField handleChange={handleChange}  address={address} name='county' type="text" placeholder="county" /> 
              </div>
              <InputField handleChange={handleChange}  address={address} name='phone' type="number" placeholder="Phone" /> 

              <button className='w-full mt-6 bg-purple-500 text-white py-3 hover:bg-purple-400 transition cursor-pointer uppercase'>
                Save Address
              </button>
            </form>
          </div>

          <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add Address" />
         </div>
    </div>
  )
}

export default AddAddress