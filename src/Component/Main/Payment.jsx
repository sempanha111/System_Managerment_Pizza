import React, { useEffect, useState } from 'react'
import { ArrowLeft, Wallet } from 'lucide-react';
import axios from 'axios';
import Spining from './spining';
import { fetchOrder } from '../../assets/order_api';
const Payment = ({ setDataOrder, setActiveCategory, orders, setOrders }) => {
    const [paymentMethod, setPaymentMethod] = useState(orders.paymentMethod || "cash");
    const discountRate = 0.1; // 10% discount
    const [isToggled, setIsToggled] = useState(false);
    const [isDiscount, setIsDiscount] = useState(false);
    const [Qr, setQr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({}); 
    const toggleSwitch = () => {
        setIsToggled(!isToggled);
        setIsDiscount(!isToggled); // Update `isDiscount` when toggled
    };
    const handleClickBack = () => {
        setActiveCategory({ name: "Dashboard" });
    }



    useEffect(() => {
        let qrUrl = "";
        if (paymentMethod === "aba") {
            qrUrl = `http://127.0.0.1:8000/storage/images/aba_qr.jpg`;
        } else if (paymentMethod === "wing") {
            qrUrl = `http://127.0.0.1:8000/storage/images/wing_qr.jpg`;
        } else if (paymentMethod === "acleda") {
            qrUrl = `http://127.0.0.1:8000/storage/images/aba_qr.jpg`;
        }

        // Only set QR if paymentMethod is not "cash"
        setQr(paymentMethod === "cash" ? "" : qrUrl);
    }, [paymentMethod]);


    const handleClickPayNow = async () => {
        setIsLoading(true);
       
        const updatedOrders = {
            ...orders, // Use the current orders state
            users_id: "28", // Add or update user ID
            isDiscount: isDiscount, // Add or update isDiscount
            paymentMethod: paymentMethod, // Add or update paymentMethod
            totalAfterDiscount: totalAfterDiscount,
        };

        setOrders(updatedOrders);

        try {
                const response = await axios.post("http://127.0.0.1:8000/api/addorder", updatedOrders);
                const getorder = await fetchOrder();
                setDataOrder(getorder)
                // const ordersData = response.data.data;

                console.log(getorder)
 
        } catch (error) {
            if (error.response) {
                console.error("Error response from server:", error.response.data);
                setFormErrors(error.response.data.errors);
            } else {
                console.error("Error submitting form:", error.message);
            }
        } finally {
            setIsLoading(false);
        }

        setActiveCategory({ name: "Invoice" });
    }

    // Function to calculate discounted price
    const calculateDiscountedPrice = (price, rate) => {
        return (price * rate).toFixed(2); // Discount amount
    };


    // Function to calculate total after discount
    const calculateTotalAfterDiscount = (price, discount) => {
        return (price - discount).toFixed(2); // Total after applying discount
    };


    // Calculate discount and total dynamically
    const discountPrice = isToggled ? calculateDiscountedPrice(orders.totalPrice, discountRate) : 0;
    const totalAfterDiscount = calculateTotalAfterDiscount(orders.totalPrice, discountPrice);

    return (
        <div className="flex flex-col h-screen w-full">
            <div className='absolute top-32 left-1/2 -translate-x-1/2 -translate-y-2/3'>
                {isLoading ? <Spining  /> : <></>}
            </div>
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <button onClick={handleClickBack} className="text-3xl float-start"><ArrowLeft /></button>
                <div className="text-center mx-auto text-xl">Payment</div>
            </header>

            {/* Main Content */}
            <main className="h-full grid md:grid-cols-2 p-5 bg-gray-100 overflow-auto">
                {/* Left Panel: Payment Methods */}
                <div className="w-full bg-gray-100 p-1">
                    <div className="h-[20rem] p-6 border rounded-md">
                        <div className="text-md mb-3">Payment ($)</div>
                        <div className="flex items-center space-x-4">
                            {/* Cash Option */}
                            <div
                                className={`flex flex-col items-center justify-center w-[6rem] py-6 px-3 border rounded-lg cursor-pointer ${paymentMethod === "cash"
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setPaymentMethod("cash")}
                            >
                                <img className="w-full" src="http://127.0.0.1:8000/storage/images/cash.png" alt="Cash" />
                                <div className="font-bold pt-1">Cash</div>
                            </div>

                            {/* ABA Option */}
                            <div
                                className={`flex flex-col items-center justify-center w-[6rem] py-6 px-3 border rounded-lg cursor-pointer ${paymentMethod === "aba"
                                    ? "bg-blue-100 border-blue-500 text-blue-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setPaymentMethod("aba")}
                            >
                                <img className="w-full" src="http://127.0.0.1:8000/storage/images/aba.png" alt="ABA" />
                                <div className="font-bold pt-1">ABA</div>
                            </div>

                            {/* Wing Option */}
                            <div
                                className={`flex flex-col items-center justify-center w-[6rem] py-6 px-3 border rounded-lg cursor-pointer ${paymentMethod === "wing"
                                    ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setPaymentMethod("wing")}
                            >
                                <img className="w-full" src="http://127.0.0.1:8000/storage/images/wing.png" alt="Wing" />
                                <div className="font-bold pt-1">Wing</div>
                            </div>

                            {/* Other Option */}
                            <div
                                className={`flex flex-col items-center justify-center w-[6rem] py-6 px-3 border rounded-lg cursor-pointer ${paymentMethod === "acleda"
                                    ? "bg-purple-100 border-purple-500 text-purple-700"
                                    : "bg-gray-50 border-gray-300 text-gray-700"
                                    }`}
                                onClick={() => setPaymentMethod("acleda")}
                            >
                                <img className="w-full" src="http://127.0.0.1:8000/storage/images/acleda.png" alt="Other" />
                                <div className="font-bold pt-1">acleda</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 mt-10">
                            <div
                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 shadow-md ${isToggled
                                    ? "bg-gradient-to-r from-green-400 to-green-500 ring-2 ring-green-300"
                                    : "bg-yellow-400"
                                    }`}
                                onClick={toggleSwitch}
                            >
                                <div
                                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isToggled ? "translate-x-7" : "translate-x-0"
                                        }`}
                                ></div>
                            </div>
                            <div className='font-semibold text-xl'>Card Member (10% Off)</div>
                        </div>

                    </div>
                </div>

                {/* Right Panel: Order Summary */}
                <div className="w-full bg-gray-100 p-1">
                    <div className="h-auto p-6 border rounded-md">
                        <div className="space-y-4">
                            <div className="">
                                <div className="text-md">Payment ($)</div>
                                <div className="p-4 font-semibold border rounded-lg flex justify-between">
                                    <span>{orders.totalPrice}</span>
                                </div>
                            </div>
                            <div className="">
                                <div className="text-md">Payment (៛)</div>
                                <div className="p-4 font-semibold border rounded-lg flex justify-between">
                                    <span>{(orders.totalPrice * 4100).toFixed(2)}</span>
                                </div>
                            </div>

                            {isDiscount && (
                                <div className="">
                                    <div className="text-md">Discount (10%)</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-4 font-semibold border rounded-lg flex justify-between">
                                            <span>${discountPrice}</span>
                                        </div>
                                        <div className="p-4 font-semibold border rounded-lg flex justify-between">
                                            <span>៛{(discountPrice * 4100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {Qr && <img className='w-[10rem] mx-auto' src={Qr} alt="QR Code" />}

                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 flex justify-between text-white p-5 text-center">
                <div
                    className="flex flex-col items-center justify-center w-[8rem] p-1 border-2 bg-[#85b8ff69] rounded-lg cursor-pointer"
                    onClick={() => handleClickPayNow()}
                >
                    <div className="font-bold pt-1">Pay Now</div>
                    <Wallet />
                </div>
                <div className="text-right text-xl">
                    <div className="font-semibold">Total</div>
                    <div className="font-bold">${totalAfterDiscount}</div>
                    <div className="font-bold text-md">៛{(totalAfterDiscount * 4100).toFixed(2)}</div>
                </div>
            </footer>
        </div>
    );
}

export default Payment