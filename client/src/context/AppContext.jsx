import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import {  toast } from 'react-hot-toast';
import axios from "axios";

axios.defaults.withCredentials = true;

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [seller, setSeller] = useState(false);
    const [showUserLogin , setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    //fetch seller status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth' )

            if(data.success){
                setSeller(true)
            }else{
                setSeller(false)
            }
        } catch (error) {
            setSeller(false)
        }
    }
    //fetch user status , cart items
    const fetchUser = async ()=>{
        try { 
            const {data} = await axios.get('/api/user/is-auth' )
            console.log(data  , "data iin user")
            if(data.success){ 
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            console.log(error)
            setUser(null)
        } 
    }
console.log(user , "user in context")



// fetch all products

    const fetchProducts = async()=>{
        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // add to cart function
    const addToCart = (itemId) => {
        console.log(cartItems)
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] = cartData[itemId] + 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        console.log(" cartData", cartData)
        toast.success("Added to cart successfully")
    }
    //update cart function
    const updateCartItems = (itemId , quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated successfully")
        
    }
    // remove from cart function
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;

            if(cartData[itemId] === 0){
                delete cartData[itemId];
                console.log("cartData delete", cartData[itemId])
            }
        }
        setCartItems(cartData);
        toast.success("Removed from cart successfully")
    }

    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }

        return totalCount;
    }
    console.log("cart items" , cartItems)
    const getCartAmount =()=>{ 
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            console.log("itemInfo" , itemInfo)
            console.log(items , cartItems , cartItems[items], "Items")
            if(cartItems[items] >0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
                console.log("totalAmount" ,totalAmount)
            }
        }
        return Math.floor(totalAmount *100) / 100;
    }
    console.log(getCartAmount())


    useEffect(() => {
        fetchSeller()
        fetchUser()
        fetchProducts()
    }, []);

    //update cart items in database
    console.log('cartItems for id' ,cartItems , {cartItems})
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const {data } = await axios.post('/api/cart/update'  ,  {
                    userId: user._id,  // ✅ send userId
                    cartItems
                });
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if(user){
            updateCart();
        }
    } , [cartItems])
    const value = {axios, navigate, user, setUser, seller, setSeller  , showUserLogin, setShowUserLogin ,
         products, setProducts  , cartItems, setCartItems , addToCart , 
         updateCartItems ,setCartItems , removeFromCart , searchQuery, setSearchQuery , getCartAmount , getCartCount , fetchProducts};
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider> 
    )
}
export const useAppContext = () => {
    return useContext(AppContext);

}