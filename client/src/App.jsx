import React, { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/Seller/SellerLayout';
import AddProduct from './pages/Seller/AddProduct';
import ProductList from './pages/Seller/ProductList';
import Orders from './pages/Seller/Orders';
import ScrollToTop from './context/ScrollToTop';


const App = () => {
  const isSellerpath = useLocation().pathname.includes('seller');
  const {showUserLogin , seller} = useAppContext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerpath ? '' : <NavBar />}
      {}
      {showUserLogin ?<Login /> : null}
      <Toaster />
      <div className={`${isSellerpath ? '' :'px-6 md:px-16 lg:px-24 xl:px-32 mt-30'}`}>
          <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/seller' element={seller ? <SellerLayout /> :<SellerLogin /> }>
            <Route index element={seller ? <AddProduct /> : null } />
            <Route path='product-list' element= {<ProductList /> } />
            <Route path='orders' element= {<Orders /> } />
          </Route>
        </Routes>
        {!isSellerpath && <Footer />}
      </div>
    </div>
  )
}

export default App