import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form';

const InputField = ({ type, placeholder, name, register, errors ,validation }) => (
  <div>
    <input className=' w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-purple-500 transition'
      type={type}
      placeholder={placeholder}
      {...register(name, validation)}
    />
   <div className='min-h-[18px] mt-1 px-2 '>
     {errors[name] && (
      <p className='text-red-500 text-xs'> {errors[name].message} </p>
    )}
   </div>
  </div>
)
const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = async (data) => {
      console.log("Submitting address for user:", user);

    try {
      const res  = await axios.post('/api/address/add', { address : data, userId: user._id, });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/cart');
      } else {
        toast.error(res.data.message);
      }
    }catch (error) {
  console.error("Error submitting address:", error.response?.data || error.message);
  toast.error(error.response?.data?.message || error.message);
}

  }
  const noOnlySpaces = (fieldName) => (val) =>
  val.trim() !== '' || `${fieldName} cannot contain only spaces`;


  useEffect(() => {
    if (!user) {
      navigate('/cart')
    }
  }, [])
  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
        <span className='font-semibold text-purple-500'> Address</span>
      </p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-1 mt-6 text-sm'  >

            <div className='grid grid-cols-2 gap-4'>
              <InputField register={register} errors={errors} validation={{ required: 'First name is required' ,  validate : noOnlySpaces("First Name") }} name='firstName' type="text" placeholder="First Name" />
              <InputField register={register} errors={errors} validation={{ required: 'Last name is required' , validate : noOnlySpaces("Last Name")  }} name='lastName' type="text" placeholder="Last Name" />
            </div>


            <InputField register={register} errors={errors} validation={{ required: 'Email is required' ,  pattern :{
              value : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message : 'Email is not valid' 
            } }} name='email' type="email" placeholder="Email Address" />
            <InputField register={register} errors={errors} validation={{ required: 'Street is required' , validate : noOnlySpaces("Street")  }} name='street' type="text" placeholder="Street" />


            <div className='grid grid-cols-2 gap-4'>

              <InputField register={register} errors={errors} validation={{ required: 'City is required' , validate : noOnlySpaces("City")   }} name='city' type="text" placeholder=" City" />
              <InputField register={register} errors={errors} validation={{ required: 'State is required' , validate : noOnlySpaces("State")  }} name='state' type="text" placeholder="State" />
            </div>

            <div className='grid grid-cols-2 gap-4'>

              <InputField register={register} errors={errors} validation={{ required: 'Zipcode is required' , minLength : { value : 6, message: 'Zip code should be 6 digits' } , maxLength : { value : 6, message: 'Zip code should be 6 digits' } } } name='zipcode' type="number" placeholder=" Zip Code" />
              <InputField register={register} errors={errors} validation={{ required: 'Country is required' ,validate : noOnlySpaces("Country")   }} name='county' type="text" placeholder="county" />
            </div>
            <InputField register={register} errors={errors} name='phone' validation={{ required: 'Phone number is required' , minLength: { value: 10 , message : 'Phone number must be 10 digits'} , maxLength :{ value:10 , message : 'Phone number must be 10 digits'} , pattern : { value : /^[6-9]\d{9}$/, message : 'Enter a valid 10-digit number'}}} type="number" placeholder="Phone" />

            <button className='w-full mt-3 bg-purple-500 text-white py-3 hover:bg-purple-400 transition cursor-pointer uppercase rounded-full' >
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