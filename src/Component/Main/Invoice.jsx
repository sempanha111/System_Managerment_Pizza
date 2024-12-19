import React, { useEffect } from "react";
import { Home, Printer } from "lucide-react";
const Invoice = ({ setActiveCategory, orders, users, dataTables, setOrders, setaddCart }) => {
    const handleClickHome = () => {
        setOrders(null);
        setaddCart([]);
        setActiveCategory({ name: "Dashboard" });
    }

    const handlePrint = () => {
        const headerElement = document.getElementById("header");
        headerElement.classList.replace("flex", "hidden");
        
        window.print();

        headerElement.classList.replace("hidden", "flex");
    }

    const user_cashier = users.find((user) => user.id === parseInt(orders.users_id));
    let cashierName;
    if (user_cashier) {
        cashierName = user_cashier.name;
    } else {
        cashierName = "User not found";
    }

    let tableName;
    if (orders.orderType === "table") {
        const table = dataTables.find((dataTable) => dataTable.id === parseInt(orders.tables_id));
        if (table) {
            tableName = table.name;
        }
        else {
            tableName = "Table not found";
        }
    } else {
        tableName = "Pick Up";
    }

    let total;
    let subtotal = orders.totalPrice;
    if (orders.isDiscount) {
        total = orders.totalAfterDiscount;
    } else {
        total = subtotal;
    }


    useEffect(() => {
        console.log(orders)
    }, [orders]);
    return (
        <div className="w-full pb-20">
            <header className="bg-blue-600 flex justify-between text-white py-4 px-6  items-center" id="header">

                <button onClick={handleClickHome} className="text-3xl float-start"><Home /></button>

                <div className="text-center mx-auto text-xl" onClick={handlePrint}>Print</div>

                <button className="text-3xl float-start border p-3 rounded-lg" ><Printer /></button>
            </header>

            {/* Restaurant Details */}
            <div className="w-[30rem] mx-auto">

                <img className="mx-auto max-w-[10rem] mt-10 grayscale" src="http://127.0.0.1:8000/storage/images/pizza.png" alt="" />
                <div className="text-center">
                    <div className="text-xl font-bold">ផលិតនឹងគ្រប់គ្រងដោយក្រុមទី៤</div>
                    <div className="">National Technical Training Institute (NTTI)</div>
                    <div className="">HV8H+P56, Russian Federation Blvd (110), Phnom Penh</div>
                    <div className="text-xl font-bold mt-5">Invoice</div>
                </div>

                <p className="w-full overflow-hidden pb-3">.......................................................................................................................................................</p>

                <div className="*:flex *:justify-between *:text-gray-700 ">
                    <div>
                        <div className="font-semibold">#invoice:</div>
                        <div className="">09876543</div>
                    </div>
                    <div>
                        <div className="font-semibold">Date:</div>
                        <div className="">2024-06-12</div>
                    </div>
                    <div>
                        <div className="font-semibold">Cashier:</div>
                        <div className="">{cashierName}</div>
                    </div>
                    <div>
                        <div className="font-semibold">Customer Name:</div>
                        <div className="">{orders.customerName}</div>
                    </div>
                    <div>
                        <div className="font-semibold">Number Table:</div>
                        <div className="">{tableName}</div>
                    </div>
                </div>

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
                        {orders.items.map((item, index) => (
                            <tr key={index}>
                                <td className="  py-2 mt-5">{item.name}</td>
                                <td className="  py-2 text-right">{item.price}</td>
                                <td className="  py-2 text-right">{item.quantity}</td>
                                <td className="  py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}


                    </tbody>
                </table>

                {/* Totals */}
                <div className="text-md">

                    <div className="relative">
                        <p className="w-full absolute overflow-hidden -top-5">...............................................................................................................................................................</p>
                        <div className="flex justify-between py-2">
                            <span className="font-semibold">Subtotal:</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-semibold"></span>
                            <span>៛{(subtotal * 4100).toFixed(2)}</span>
                        </div>
                        <p className="w-full absolute -bottom-2 overflow-hidden">...........................................................................................................................................................................</p>
                    </div>


                    <div className="flex justify-between py-2 relative">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="text-lg font-bold">${total}</span>
                        {orders.isDiscount ? (<img className="absolute opacity-25 max-w-[7rem] right-20 grayscale" src="http://127.0.0.1:8000/storage/images/discountlogo.png"/>) : ""}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-24 text-sm text-gray-500 relative">
                    <p className="w-full absolute -top-10 overflow-hidden">...........................................................................................................................................................................</p>

                    <p>$1.00 = 4,100៛</p>
                    <p>សូមអរគុណ! សូមអញ្ជើញមកពិសារម្ដងទៀត។</p>
                    <p>Thank You! Please Come Enjoyed Your Meal!</p>
                </div>
            </div>

        </div>
    );
};

export default Invoice;
