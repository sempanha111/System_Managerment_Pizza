import React, { useState, useEffect } from "react";

const RightSidebar = ({ addCart, setaddCart, setActiveCategory, orders, setOrders, dataTables, setTableAvalible, tableAvalible, dataOrder }) => {

    const [orderType, setOrderType] = useState(orders?.orderType || "pickup"); // "pickup" or "table"
    const [selectedTable, setSelectedTable] = useState(orders?.tableNumber || "");
    const [customerName, setCustomerName] = useState(orders?.customerName);
    const [contactNumber, setContactNumber] = useState(orders?.contactNumber);
    const [formErrors, setFormErrors] = useState({});

    // Calculate total price
    const total = addCart?.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);

    // Increase quantity
    const increaseQuantity = (id) => {
        setaddCart((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (id) => {
        setaddCart((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    // Delete item
    const deleteItem = (id) => {
        setaddCart((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Place Order and Reset
    const placeOrder = () => {
        // Validate the cart
        let errors = {};
        if (addCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Validate contact number
        if (orderType === "table") {
            if (!selectedTable || selectedTable.trim() === "") {
                errors.table = "Table is required.";
            }
        }
        // Validate contact number
        if (!customerName || customerName.trim() === "") {
            errors.customerName = "Contact name is required.";
        }

        // Validate customer name
        if (!contactNumber || contactNumber.trim() === "") {
            errors.contactNumber = "Customer contact is required.";
        }

        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // Update the formErrors state
            console.log(errors)
            return; // Stop further execution
        }

        const orderDetails = {
            items: addCart,
            totalPrice: total,
            tables_id: orderType === "table" ? selectedTable : null,
            status: orderType === "table" ? true : false,
            orderType,
            customerName,
            contactNumber,
        };

        setOrders(orderDetails);

        // Reset cart and form fields
        // setaddCart([]);
        // setOrderType("pickup");
        // setSelectedTable("");
        // setCustomerName("");
        // setContactNumber("");

        setActiveCategory({ name: "Payment" });

        // alert("Order placed successfully!");


    };





    const unavailableTables = (dataOrder?.data || [])
    .filter(order => order.status === 1)
    .map(order => order.tables_id);

    const availableTables = dataTables.filter(
        table => !unavailableTables.includes(table.id)
    );



    console.log(unavailableTables)
    console.log(availableTables)

    return (
        <>
            {/* Right Sidebar - Cart */}
            <div className="min-w-[25rem] h-fit">
                <h2 className="text-2xl font-bold mb-6 text-center">🛒 Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                    {addCart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
                        >
                            <div>
                                <h3 className="text-sm font-semibold">{item.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {item.quantity}x ${item.price}
                                </p>
                                <div className="flex items-center mt-2 space-x-2">
                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 border">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-gray-800">${total}</span>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">📝 Customer Details</h3>

                    {/* Order Type Toggle */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Type
                        </label>
                        <div className="flex items-center space-x-4">
                            {/* Pickup Option */}
                            <div
                                className={`flex items-center justify-center w-1/2 p-3 border rounded-lg cursor-pointer ${orderType === "pickup"
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("pickup")}
                            >
                                Pickup
                            </div>

                            {/* Dine-in Option */}
                            <div
                                className={`flex items-center justify-center w-1/2 p-3 border rounded-lg cursor-pointer ${orderType === "table"
                                    ? "bg-blue-100 border-blue-500 text-blue-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setOrderType("table")}
                            >
                                Dine-in
                            </div>
                        </div>
                    </div>

                    {/* Table Number Dropdown - Conditional Rendering */}
                    {orderType === "table" && (
                        <div className="mb-4">
                            <label
                                htmlFor="table-number"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Table Number
                            </label>
                            <select
                                id="table-number"
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="" disabled>
                                    Select a table
                                </option>
                                {availableTables.map((availableTable) => (
                                    <option key={availableTable.id} value={availableTable.id}>
                                        Table {availableTable.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.table && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.table}</p>
                            )}
                        </div>
                    )}

                    {/* Name Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="customer-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="customer-name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {formErrors.customerName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.customerName}</p>
                        )}
                    </div>

                    {/* Contact Number Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="contact-number"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contact-number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {formErrors.contactNumber && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.contactNumber}</p>
                        )}
                    </div>
                </div>

                {/* Place Order Button */}
                <button
                    onClick={placeOrder}
                    className="w-full py-3 text-white bg-green-500 rounded-md hover:bg-green-600 text-lg"
                >
                    Payment
                </button>
            </div>

        </>
    );
};

export default RightSidebar;
