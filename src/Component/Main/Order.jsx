import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { fetchOrderItem } from '../../assets/order_api';
import Spining from './spining';
import { Eye } from 'lucide-react';
const Order = ({ dataOrder, dataTables, setDataOrder }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsOrder, setDetailsOrder] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const openModal = (orderId) => {
        setIsLoading(true);
        setIsModalOpen(true);
        getdetail(orderId);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setDetailsOrder({});
    }

    const handleOverlaydetail = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }

    const getdetail = async (id) => {
        try {
            const res = await fetchOrderItem(id);
            // console.log(res.data);
            setDetailsOrder(res.data);
        } catch (error) {
            console.log("catch react js:", error )
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log(detailsOrder);
    },[detailsOrder])

    const handleStatusChange = async (orderId, field, newValue) => {
        try {

            console.log({ [field]: newValue, orderId })
            // Send the update to the server
            const response = await axios.post(`http://127.0.0.1:8000/api/changeorderfield/${orderId}`, { [field]: newValue, });

            console.log(response.data);

            setDataOrder((prev) => {
                const updatedOrders = prev.data.map((order) =>
                    order.id === orderId ? { ...order, [field]: newValue } : order
                );
                return { ...prev, data: updatedOrders };
            });
            toast.success(response.data.message);

        } catch (error) {
            console.error("Error updating status:", error);
        }
    };



    return (
        <>
            <div className="flex-1 ">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">🍴 Order </h2>
                    </div>

                    <div className="bg-[url('/path-to-corkboard-image.jpg')] bg-cover p-8 min-h-screen">
                        <div className="grid grid-cols-4 gap-6">
                            {/* Order Cards */}
                            {dataOrder.data.map((order, index) => {
                                // Find the corresponding table name
                                const nametable = dataTables.find((table) => table.id === order.tables_id);

                                return (
                                    <div
                                        key={index}
                                        className="relative  animate-hanging bg-[#fefefe] shadow-lg rounded-lg p-6 hover:scale-105 transition-transform duration-500"
                                        
                                    >
                                        {/* Pin Icon */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10">
                                            <img
                                                src="https://www.pngall.com/wp-content/uploads/4/Red-Pin-PNG-Pic.png"
                                                alt="Pin"
                                                className="w-full h-full"
                                            />
                                        </div>

                                        {/* Order Details */}
                                        <div className="float-right cursor-pointer" onClick={() => openModal(order.id)}><Eye/></div>
                                        <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                                        <div className="text-sm text-gray-500 mb-4">
                                            Table: {nametable ? nametable.name : "Pickup"}
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Status:</span>
                                            <span className={`px-3 py-1 text-sm rounded-full  ${order.status_accept ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"} `}>
                                                {order.status_accept ? "Accepted" : "Not Accepted"}
                                            </span>
                                        </div>



                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Accept:</span>
                                            <input
                                                type="checkbox"
                                                checked={order.status_accept ? true : false}
                                                className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => handleStatusChange(order.id, "status_accept", !order.status_accept)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Cooking:</span>
                                            <input
                                                type="checkbox"
                                                checked={order.status_cook ? true : false}
                                                className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => handleStatusChange(order.id, "status_cook", !order.status_cook)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium">Ready:</span>
                                            <input
                                                type="checkbox"
                                                checked={order.status_ready ? true : false}
                                                className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => handleStatusChange(order.id, "status_ready", !order.status_ready)}
                                            />
                                        </div>
                                        {/* <div className="mx-auto"><button className='bg-green-500 p-1 text-white'>view</button></div> */}

                                    </div>
                                );
                            })}
                        </div>
                    </div>



                </div>


                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 "
                        onClick={handleOverlaydetail}  >
                            {isLoading ? <Spining  /> : <></>}
                        <div className="bg-white w-1/3 rounded-lg shadow-lg" >
                            <div className="p-6">
                                {/* Item Details */}
                                <table className="w-full text-md  border-gray-300 mb-6 mt-3 ">
                                    <thead className="relative">
                                        <p className="w-full absolute overflow-hidden -top-2">...............................................................................................................................................................</p>
                                        <tr className="">
                                            <th className="  py-5 text-left">Name</th>
                                            <th className="  py-5 text-right">Price</th>
                                            <th className="  py-5 text-right">Qty</th>
                                            <th className="  py-5 text-right">Total</th>
                                        </tr>
                                        <p className="w-full absolute bottom-1 overflow-hidden">...........................................................................................................................................................................</p>

                                    </thead>
                                    <tbody >
                                        {detailsOrder.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="  py-2 mt-5">{item.product_name}</td>
                                                <td className="  py-2 text-right">{item.price}</td>
                                                <td className="  py-2 text-right">{item.quantity}</td>
                                                <td className="  py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Order