import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = ( ) => {
    const {products} = useAppContext();
    const {category} = useParams();
    const searchCategory = categories.find((item)=>item.path.toLowerCase()===category);
    const filterProducts = products.filter((product)=> product.category.toLowerCase() === category);
    const inStockProducts = filterProducts.filter((item) => item.inStock);
    console.log("filterProducts " , filterProducts)
  return (
    <div className='mt-16'>
        {filterProducts  && (
            <div className='flex flex-col items-end w-max'> 
            <p className='text-2xl font-medium'> {searchCategory.text.toUpperCase()} </p>
            <div className='w-16 h-0.5 bg-purple-500 rounded-full'></div>
            </div>
        )}
        {
            inStockProducts.length > 0 ?(
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6' >
                    {inStockProducts.map((product ,i)=>(
                        <ProductCard key={i} product={product}  />
                    ) )}
                 </div>

            ):(
                <div className='flex flex-col items-center justify-center h-[60vh] '> 
                <p> No products found in this category </p>
                </div>

            )
        }
    </div>
  )
}

export default ProductCategory