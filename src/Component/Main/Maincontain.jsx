import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const Maincontain = ({ activeCategory, categories, items }) => {
    const data = [
        { day: "Mon", sales: 300 },
        { day: "Tue", sales: 500 },
        { day: "Wed", sales: 700 },
        { day: "Thu", sales: 400 },
        { day: "Fri", sales: 1900 },
    ];

    



    return (
        <>
            <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { title: "Total Orders", value: 1245, growth: "+8%", icon: "📦" },
                        { title: "Revenue", value: "$12,340", growth: "+15%", icon: "💰" },
                        { title: "New Customers", value: 74, growth: "-5%", icon: "👤" },
                        { title: "Feedback", value: 25, growth: "+2%", icon: "👍" },
                    ].map((widget) => (
                        <div
                            key={widget.title}
                            className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <span className="text-3xl mr-3">{widget.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold">{widget.title}</h3>
                                    <p className="text-gray-500">{widget.value}</p>
                                </div>
                            </div>
                            <p
                                className={`mt-2 text-sm ${widget.growth.startsWith("+") ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {widget.growth} this week
                            </p>
                        </div>
                    ))}
                </div>


                {/* Main Charts and Tables */}
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <LineChart width={500} height={200} data={data}>
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                </LineChart>

                {/* Orders Table */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="px-4 py-2 border rounded-md text-sm"
                        />
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b p-2">Order ID</th>
                                <th className="border-b p-2">Customer</th>
                                <th className="border-b p-2">Amount</th>
                                <th className="border-b p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b p-2">#12345</td>
                                <td className="border-b p-2">John Doe</td>
                                <td className="border-b p-2">$54.99</td>
                                <td className="border-b p-2">2024-11-22</td>
                            </tr>
                            <tr>
                                <td className="border-b p-2">#12346</td>
                                <td className="border-b p-2">Jane Smith</td>
                                <td className="border-b p-2">$32.50</td>
                                <td className="border-b p-2">2024-11-21</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Maincontain