import React, { useState } from 'react'
import {  useAppContext } from '../context/AppContext';
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import {CiShoppingCart} from "react-icons/ci"; 

const ProductCard = ( {product}) => {
    const {addToCart , removeFromCart , cartItems  , navigate} = useAppContext()


  return product && (
    <div onClick={ ()=> {navigate(`/products/${product.category}/${product._id}`); scrollTo(0,0)}} 
    className='w-full max-w-[224px] border border-gray-500/20 rounded-md px-3 md:px-4 py-4 bg-white mx-auto'>
        <div className='group cursor-pointer flex items-center justify-center px-2'>
            <img className='group-hover:scale-105 transition max-w-26 md:max-w-36' src={product.image[0]} alt="" />
        </div>
        <div className='text-gray-500/60 text-sm'>
            <p>{product.category} </p>
            <p className='text-gray-700 font-medium text-lg w-full truncate'>{product.name} </p>
            <div className='flex items-center gap-0.5 text-black'>
                {Array(5).fill('').map((_ , i)=>(
                    product.ratings >i ? (
                        <FaStar key={i} />
                        ) : (
                            <CiStar key={i} />
                        )
                ))}
                <p>({product.ratings})</p>
            </div>
            <div className='flex items-end justify-between mt-3'>
                <p className='md:text-xl text-base font-medium text-purple-500'>₹{product.offerPrice} <span className='text-gray-500/60 md:text-sm text-xs line-through'> ₹{product.price} </span> </p>
                <div className='text-purple-500' onClick={(e)=>e.stopPropagation()}> 
                    {!cartItems[product._id]  ? (
                        <button 
                        className='cursor-pointer flex items-center justify-center gap-1
                         bg-purple-100 border border-purple-300 w-[80px] h-[34px] rounded text-purple-600 font-medium hover:bg-purple-200 transition'
                         onClick={()=> addToCart(product._id )}>
                            <CiShoppingCart className='w-5 h-5' />
                            Add
                        </button>
                    ) : (
                        <div className=' flex gap-2 items-center justify-center md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded'> 
                            <button onClick={()=> {removeFromCart(product._id)}} className='cursor-pointer text-md px-2 h-full'> 
                                -
                            </button>
                            <span className='w-5 text-center'>{cartItems[product._id]}</span>
                            <button className='cursor-pointer text-md px-2 h-full' onClick={()=>{addToCart(product._id)}}>
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductCard