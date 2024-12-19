import React, { useState, useEffect } from 'react';
import { Plus, Heart, Trash, Edit, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spining from './spining';
import { fetchTable } from '../../assets/table_api';
const Table = ({ dataTables, setDataTable, dataOrder, setDataOrder }) => {

    /// MaodalStatus
    const [isModalChangeStatus, setIsModalChangeStatus] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const [idStatus, setIdStatus] = useState();
    const openModalChangeStatus = (id) => {
        setIsModalChangeStatus(true);
        setIdStatus(id)
    }
    const closeModalChangeStatus = () => {
        setIsModalChangeStatus(false);
        setIsToggled(false);
    }
    const handleOverlayChangeStatus = (e) => {
        if (e.target === e.currentTarget) {
            closeModalChangeStatus();
        }
    }
    const toggleSwitch = () => {
        setIsToggled(!isToggled);
        updateOrderTable()
    };

    const updateOrderTable = async () => {
        setIsLoading(true);
        try {
            
            const table = await axios.post(`http://127.0.0.1:8000/api/changestatusorder/${idStatus}`);
       
            const updatedDataOrder = {
                ...dataOrder, // Spread the existing dataOrder object
                data: dataOrder.data.map((order) =>
                  order.id === idStatus ? { ...order, status: 0 } : order
                ), // Update the status for the matching order
              };
            setDataOrder(updatedDataOrder);

            toast.success(table.data.message);
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
        closeModalChangeStatus();

    }

    /// ModalAddTable ///
    const [isModalAddTableOpen, setIsModalAddTableOpen] = useState(false);
    const [tableName, setTableName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [isEditTable, setEditTable] = useState(false);
    const [headerModal, setHeaderModal] = useState("");
    const [isExiting, setIsExiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [idItem, setidItem] = useState("");


    const openModalAddTable = (id) => {
        const tableData = dataTables.find((table) => table.id === id);
        if (tableData) {
            setidItem(id);
            setHeaderModal("Edit Table");
            setTableName(tableData.name);
            setTableNumber(tableData.number);
        }
        else {
            setHeaderModal("Add Table");
        }
        setIsModalAddTableOpen(true);
    }
    const closeModalAddTable = () => {
        setIsModalAddTableOpen(false);
        setTableName("");
        setTableNumber("");
    };
    const handleOverlayClickModalAddTable = (e) => {
        if (e.target === e.currentTarget) {
            closeModalAddTable();
        }
    }
    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const form = new FormData();
        form.append('name', tableName);
        form.append('number', tableNumber);
        try {
            if (headerModal === 'Add Table') {
                const response = await axios.post("http://127.0.0.1:8000/api/addtable", form);
                const newitem = response.data.data;

                setDataTable((prev) => [...prev, newitem]);
                closeModalAddTable();
                toast.success(response.data.message);
            }
            else if (headerModal === 'Edit Table') {
                const response = await axios.post(`http://127.0.0.1:8000/api/updatetable/${idItem}`, form);
                const update = response.data.data;
                console.log(response.data);
                setDataTable((prev) =>
                    prev.map((table) =>
                        table.id === update.id ? update : table
                    )
                );
                closeModalAddTable();
                toast.success(response.data.message);
            }
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
    }
    const clickEditTable = () => {
        if (isEditTable) {
            setEditTable(false);
        }
        else {
            setEditTable(true);
        }
    }
    const handleDelete = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/deletetable/${idItem}`);
            toast.success(response.data.message);
            setDataTable((prev) =>
                prev.filter((table) => table.id !== idItem)
            );
            closeModalAddTable();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete the category. Please try again.");
        }
    };








    useEffect(() => {
        // console.log(headerModal);
    }, [headerModal]);
    /// End ModalAddTable ///



    return (
        <div className='w-full'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🍽 Customer Table Availability</h2>
                <div className="flex gap-3">
                    <button
                        onClick={clickEditTable}
                        className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-green-500 text-white"
                    >
                        <Edit className="w-5 h-5" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => openModalAddTable()}
                        className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-red-500 text-white"
                    >
                        <Plus className="group-hover:rotate-90 transition-all w-5 h-5" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataTables.map((datatable) => {
                    const tableOrder = dataOrder.data.find((order) => order.tables_id === datatable.id && order.status === 1);
                    // Format the date and time in ISO format
                    const formattedDate = tableOrder?.created_at
                        ? new Date(tableOrder.created_at).toISOString().split("T")[0] // YYYY-MM-DD
                        : null;

                    const formattedTime = tableOrder?.created_at
                        ? new Date(tableOrder.created_at).toISOString().split("T")[1].split(".")[0] // HH:MM:SS
                        : null;

                    return (
                        <div
                            key={datatable.id}
                            className={`rounded-lg shadow-md p-4 ${tableOrder
                                ? "bg-red-50 border-red-400"
                                : "bg-green-50 border-green-400"
                                } border-l-4 relative ${isEditTable ? "animate-bounce" : ""
                                }`}
                        >
                            <div onClick={() => openModalAddTable(datatable.id)}
                                className={`absolute cursor-pointer -top-2 right-0 bg-green-500 text-white p-2 rounded-full ${!isEditTable ? "hidden" : "wiggle"
                                    }`}
                            >
                                <Edit2 className="w-5 h-5" />
                            </div>
                            <h2
                                className={`text-lg font-bold ${tableOrder ? "text-red-800" : "text-green-800"
                                    } mb-2`}
                            >
                                Table: {datatable.name}
                            </h2>

                            {tableOrder ? (
                                <>
                                    <div className="text-sm text-red-600 mb-2">
                                        Status: Busy
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Customer: {tableOrder.customerName}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                    <div>Date: {formattedDate}</div>
                                    <div>Time: {formattedTime}</div>
                                    </div> 
                                    <button onClick={() => openModalChangeStatus(tableOrder.id)} className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        Change Status
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm text-green-600 mb-4">
                                        Status: Free
                                    </div>


                                    <button
                                        className="w-full py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                                        disabled
                                    >
                                        Change Status
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {isModalAddTableOpen && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"
                        }`}
                    onClick={handleOverlayClickModalAddTable}
                >
                    {isLoading ? <Spining /> : <></>}
                    <div
                        className="bg-white w-1/3 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">{headerModal}</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Table Name Input */}
                                <div>
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="table"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="tablename"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        placeholder="Enter Table name"
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>
                                    )}
                                </div>

                                {/* Table Number Input */}
                                <div>
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="table"
                                    >
                                        Table Number
                                    </label>
                                    <input
                                        id="tablenumber"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        placeholder="Enter Table Number"
                                    />
                                    {formErrors.number && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.number[0]}</p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className=" items-center gap-4">
                                    {/* Delete Button */}
                                    {headerModal === "Edit Table" && (
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            onClick={() =>
                                                confirm("Are you sure you want to delete this table?") &&
                                                handleDelete()
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex float-right mb-4  gap-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                                            onClick={closeModalAddTable}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isModalChangeStatus && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"
                        }`}
                    onClick={handleOverlayChangeStatus}
                >
                    {isLoading ? <Spining /> : <></>}
                    <div
                        className="bg-white w-1/3 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
                    >
                        <div className="p-6">
                        <div className="text-lg font-semibold mb-3">Set Status</div>
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
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Table