import { useEffect } from 'react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [myOrders, setMyOrders] = useState([]);
    const { user, axios, navigate } = useAppContext();
    const [orderMessageIndex, setOrderMessageIndex] = useState(0);
    const loadingMessages = [
        "🔍 Looking up your latest orders...",
        "🧾 Verifying order details...",
        "✨ Almost there, preparing your order summary..."
    ];

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
        const interval = setInterval(() => {
            setOrderMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [])

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
                <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                    <div className="loader"></div>
                    <p className="text-gray-700 text-lg font-medium text-center">
                        {loadingMessages[orderMessageIndex]}
                    </p>
                </div>


            )}
            {myOrders.length > 0 && !loading ? (
                <div>
                    {myOrders.map((order, i) => (
                        <div key={i} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                            <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                                <span>OrderId : {order._id} </span>
                                <span>Payment : {order.paymentType}</span>
                                <span>Total Amount : ₹{order.amount}</span>
                                {console.log(order, 'order')}
                            </p>
                            {order.items.map((item, i) => (
                                <div key={i} className={`relative bg-white text-gray-500/70 ${order.items.length !== i + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`} >
                                    <div className='flex items-center mb-4 md:mb-0'>

                                        <div onClick={() => navigate(`/products/${item.product.category}/${item.product._id}`)} className='bg-gray-100 p-4 rounded-lg cursor-pointer'>
                                            {console.log(item, 'item')}
                                            <img src={item.product?.image[0]} className='w-16 h-16 ' alt="" />
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