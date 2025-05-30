import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [myOrders, setMyOrders] = useState([]);
    const { user, axios } = useAppContext();
    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/order/get-user-order');
            setLoading(false);
            console.log(data, 'my orders');
            if (data.success) {
                setMyOrders(data.orders);

            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchMyOrders()
    }, [user])
    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'> My Orders</p>
                <div className='w-16 h-0.5 bg-purple-500 rounded-full'></div>
            </div>
            {loading && (
                <div className="flex items-center justify-center h-[30vh] sm:h-screen">
                    <div className="relative w-10 h-10 sm:w-16 sm:h-16 border-4 border-blue-500 rounded-full animate-spin">
                        <div className="absolute top-1.5 left-1.5 w-7 h-7 sm:w-12 sm:h-12 border-4 border-red-500 rounded-full animate-spin-reverse"></div>
                    </div>
                </div>


            )}
            {myOrders.length > 0 ? (
                <div>
                    {myOrders.map((order, i) => (
                        <div key={i} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                            <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                                <span>OrderId : {order._id} </span>
                                <span>Payment : {order.paymentType}</span>
                                <span>Total Amount : ₹{order.amount}</span>
                            </p>
                            {order.items.map((item, i) => (
                                <div key={i} className={`relative bg-white text-gray-500/70 ${order.items.length !== i + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`} >
                                    <div className='flex items-center mb-4 md:mb-0'>

                                        <div className='bg-purple-500/10 p-4 rounded-lg'>
                                            <img src={item.product?.image[0]} className='w-16 h-16' alt="" />
                                        </div>
                                        <div className='ml-4 '>
                                            <h2 className='text-xl font-medium text-gray-800'> {item.product?.name} </h2>
                                            <p>Category : {item.product?.category} </p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                        <p> Quantity : {item.quantity || "1"} </p>
                                        <p>Status : {order.status} </p>
                                        <p>Date : {new Date(order.createdAt).toLocaleDateString()} </p>
                                    </div>
                                    <p className='text-purple-500 text-lg font-medium'>
                                        Amount : ₹{item.product?.offerPrice * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : <>
                {myOrders.length === 0 && !loading && (
                    <div className='flex items-center justify-center h-[30vh]'>
                        <p className='text-2xl font-medium text-gray-500'>You have no orders yet.</p>
                    </div>
                )}
            </>}
        </div>
    )
}

export default MyOrders