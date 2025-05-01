import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const {products} = useAppContext()
  return (
    <div className='mt-16'>
        <p className='text-2xl md:3xl font-medium'> Best Sellers</p>
       <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mt-6'>
       {products.filter((product)=>product.inStock).slice(0,5).map((product ,i)=>(
       
       <ProductCard key={i} product={product}  />
   
     ))}
       </div>
    </div>
  )
}

export default BestSeller