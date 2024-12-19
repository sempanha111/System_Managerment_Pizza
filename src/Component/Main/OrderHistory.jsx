import axios from 'axios';
import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get_history', {
                params: { from_date: fromDate, to_date: toDate },
            });
                setOrders(response.data.data);
                // console.log(response.data)
            
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };



    const calculateOrderTotal = (items = []) =>
        items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

    // const calculateTotalSummary = () =>
    //     orders.reduce((sum, order) => sum + calculateOrderTotal(order.order_items), 0);
    const calculateTotalSummary = () => {
        return orders.reduce((sum, order) => {
            const orderTotal = calculateOrderTotal(order.order_items || []);
            return sum + orderTotal;
        }, 0);
    };

    useEffect(() => {
        fetchOrders();
    }, [fromDate, toDate]);

    useEffect(() => {
        console.log(orders);
    },[orders])

    return (
        <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Order History</h1>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Orders Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {orders.length > 0 ? (
                    orders.map((orderData, orderIndex) => (
                        <div key={orderData.order.id} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Order #{orderData.order.id}
                            </h2>
                            <div className="text-sm text-gray-500 mb-2">
                                Date: {new Date(orderData.order.created_at).toLocaleString()}
                            </div>
                    
                            <div className="space-y-2">
                                {orderData.order.order_items.map((item, itemIndex) => (
                                    <p className="flex justify-between items-end gap-10" key={itemIndex}>
                                        <span>
                                            {item.product.name} x{item.quantity}
                                        </span>
                                        <span>${parseFloat(item.product.price).toFixed(2)}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))
                    
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        No orders found for the selected date(s).
                    </p>
                )}
            </div>

            {/* Summary Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Total Orders</th>
                            <th className="text-left p-2">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2">{orders.length}</td>
                            <td className="p-2">${calculateTotalSummary()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default OrderHistory;
