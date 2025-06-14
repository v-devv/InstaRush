import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { AiFillDelete } from "react-icons/ai";
import toast from "react-hot-toast";

const Cart = () => {
    const { products, user, cartItems,
        removeFromCart, getCartCount
        , updateCartItems, navigate,
        axios, getCartAmount, setCartItems } = useAppContext();

    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")
    const [loading, setLoading] = useState(false);

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            product.quantity = cartItems[key];
            tempArray.push(product)

        }
        setCartArray(tempArray)

    };
    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get', { userId: user._id });
            console.log("data in address", data)
            console.log("data in address", user._id)
            if (data.success) {
                setAddresses(data.addresses)
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select an address")
            }
            if (paymentOption === "COD") {
                console.log("userid in", user._id)
                setLoading(true);
                const { data } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id
                });
                setLoading(false);

                if (data.success) {
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const deleteAddress = async (addressId) => {
        try {
            const { data } = await axios.put('/api/address/delete', { addressId });
            console.log(data, 'data in delete address')
            if (data.success) {
                toast.success(data.message);
                setSelectedAddress(null)
                setAddresses(prev => prev.filter(addr => addr._id !== addressId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addAddress = ()=>{
        if(user){
            navigate('/add-address')
        }else{
            toast.error("Please login to add address")
        }
        console.log("add address clicked")
    }
    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user])
    return products.length && cartItems ? (

        <div >
    {loading ? (
  <div className="flex flex-col items-center justify-center h-[50vh]">
    <div className="loader mb-4"></div>
    <h1 className="text-xl font-semibold text-gray-700">Processing your grocery order...</h1>
  </div>
) : (
    <div className="flex flex-col md:flex-row mt-16">
         <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-purple-500"> {getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={(e) => updateCartItems(product._id, Number(e.target.value))} value={cartItems[product._id]} className='outline-none cursor-pointer '>
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">₹ {product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button onClick={() => { navigate('/products'); scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-purple-500 font-medium">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street} , ${selectedAddress.city} ${selectedAddress.state} ${selectedAddress.county}` : " No address found "} </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-purple-500 hover:underline  cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, i) => (
                                    <div className="flex justify-between items-center" key={i}>
                                        <p key={i} onClick={() => { setSelectedAddress(address); setShowAddress(false) }} className=" cursor-pointer text-gray-500 p-2 hover:bg-gray-100">
                                            {address.street} , {address.city} , {address.state} , {address.country}
                                        </p>
                                        <button onClick={() => { confirm("Are you sure for delete address") && deleteAddress(address._id) }} className=" flex items-center text-red-500  pr-2 "> <AiFillDelete className="w-5 h-5 cursor-pointer" /> </button>
                                    </div>

                                ))}
                                <p onClick={addAddress} className="text-purple-500 text-center cursor-pointer p-2 hover:bg-purple-500/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={(e) => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span> ₹{getCartAmount()} </span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>₹{getCartAmount() * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>₹{getCartAmount() * 2 / 100 + getCartAmount()}</span>
                    </p>
                </div>

                <button onClick={()=>{scrollTo(0,0) ; placeOrder()}} className="w-full py-3 mt-6 cursor-pointer bg-purple-500 text-white font-medium hover:bg-purple-600 transition">
                    {
                        paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"
                    }
                </button>
            </div>
    </div>
) }


           
        </div>
    ) : null
}
export default Cart;