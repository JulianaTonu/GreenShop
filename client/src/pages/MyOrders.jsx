import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { currency,axios,user } = useAppContext();

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get(`/api/order/user?userId=${user._id}`);
            console.log("Current logged-in user ID:", user._id);

            if(data.success){
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user){
            fetchMyOrders();

        }
    }, []);

    return (
        <div className="px-4">
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase mt-10'>My Orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {myOrders.length === 0 ? (
                <p className="text-gray-500">You have no orders.</p>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>

                        <p className='flex justify-between md:items-center text-gray-400
                        md:font-medium max-md:flex-col mb-2'>
                            <span>OrderId : {order._id}</span>
                            <span>OrderId : {order.paymentType}</span>
                            <span>Total Amount :{currency}{order.amount}</span>
                        </p>
                        {order.items.map((item, index) => (
                            <div key={index}
                                className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"
                                    }border-red-600 flex flex-col md:flex-row md:items-center justify-between p-4
                            py-5 md:gap-16 w-full max-w-4xl`}

                            >
                                <div className='flex gap-4'>
                                    <div className='bg-primary/10 p-4 rounded-lg hover:bg-primary/20'>
                                        <img src={item.product.image[0]}
                                            className="w-16 h-16"
                                            alt="image" />
                                    </div>
                                    <div>
                                        <h2 className='text-xl font-semibold'>{item.product.name}</h2>
                                        <p>Category:{item.product.category}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                    <p>Quantity: {item.quantity || "1"}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className='text-primary font-semibold'>
                                        Amount:{currency}{item.product.offerPrice * item.quantity}
                                    </p>
                              
                            </div>
                        ))}

                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;
