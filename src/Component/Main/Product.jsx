import React, { useState, useEffect } from 'react'
import { Plus, Heart, Trash, Edit, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spining from './spining';
const Product = ({ activeCategory, products, setProducts, addCart, setaddCart }) => {
    /// Modal Add Item ///
    const [isModalOpen, setisModalOpen] = useState(false);
    const [idItem, setidItem] = useState("");
    const [nameItem, setNameItem] = useState("");
    const [descriptionItem, setDescriptionItem] = useState("");
    const [priceItem, setPriceItem] = useState("");
    const [file, setFile] = useState(null);
    const [previewImageItem, setPreviewImageItem] = useState(null);
    const [isEdit, setEdit] = useState(false);
    const [headerModal, setHeaderModal] = useState("");
    const [isExiting, setIsExiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const openModal = (id) => {
        setisModalOpen(true);
        if (id != null) {
            const dataitems = products.find((item) => item.id === id);
            setidItem(id);
            setNameItem(dataitems.name);
            setDescriptionItem(dataitems.description);
            setPriceItem(dataitems.price);
            setPreviewImageItem(`http://127.0.0.1:8000/storage/${dataitems.image}`);
            setHeaderModal("Edit Item");
        }
        else {
            setHeaderModal("Add Item");
        }
    }
    const closeModal = () => {
        setNameItem("");
        setDescriptionItem("");
        setPriceItem("");
        setPreviewImageItem(null);
        setFile(null);
        setisModalOpen(false);
        setFormErrors({});
    }
    const handleImageChangeItem = (e) => {
        const fileItem = e.target.files[0];
        if (fileItem) {
            setFile(fileItem);
            setPreviewImageItem(URL.createObjectURL(fileItem));
        }
    }
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }
    const clickEditItem = () => {
        if (isEdit) {
            setEdit(false);
        }
        else {
            setEdit(true);
        }
    }

    useEffect(() => {
        console.log(products)
    }, []);

    /// Modal Add Cart ///

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalAddcartOpen, setIsModalAddcartOpen] = useState(false);
    const [quantity, setQuantity] = useState(1); // Default quantity is 1
    const openModalAddcart = (product) => {
        const existingItem = addCart.find(cartItem => cartItem.id === product.id);
        if (existingItem) {
            setQuantity(existingItem.quantity);  // Set to existing quantity in cart
        } else {
            setQuantity(1); // Default to 1 if not in cart
        }
        setSelectedCategory(product)
        setIsModalAddcartOpen(true);
    }
    const closeModalAddcart = () => {
        setQuantity(1)
        setIsModalAddcartOpen(false);
    }
    const handleOverlayAddcartClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModalAddcart();
        }
    };
    // Increase quantity
    const increaseQuantity = () => setQuantity(quantity + 1);
    // Decrease quantity
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    // Handle Add to Cart (Just logs for now)
    const handleAddToCart = () => {
        // Check if item is already in the cart
        const existingItemIndex = addCart.findIndex(cartItem => cartItem.id === selectedCategory.id);

        if (existingItemIndex === -1) {
            // If not in cart, add it
            setaddCart([...addCart, { ...selectedCategory, quantity: quantity }]);
        } else {
            // If in cart, just update the quantity
            const updatedCart = [...addCart];
            updatedCart[existingItemIndex].quantity += quantity;
            setaddCart(updatedCart);
        }
        closeModalAddcart();
    };


    const handleSubmit = async (e) => {

        setIsLoading(true);
        e.preventDefault();

        const form = new FormData();
        form.append("categories_id", activeCategory.id);
        form.append("name", nameItem);
        form.append("description", descriptionItem);
        form.append("price", priceItem);
        if (file) {
            form.append("image", file);
        }
        try {
            if (headerModal === 'Add Item') {
                const response = await axios.post("http://127.0.0.1:8000/api/addproduct", form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const newitem = response.data.data;
                setProducts((prev) => [...prev, newitem]);
                closeModal();
                toast.success("Item Added Successfully!");
            }
            else if (headerModal === 'Edit Item') {
                const response = await axios.post(`http://127.0.0.1:8000/api/updateproduct/${idItem}`, form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const update = response.data.data;
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === update.id ? update : product
                    )
                );
                closeModal();
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
    };

    const handleDelete = async () => {

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/deleteproduct/${idItem}`);
            toast.success(response.data.message);
            setProducts((prev) =>
                prev.filter((product) => product.id !== idItem)
            );
            closeModal();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete the category. Please try again.");
        }
    }


    useEffect(() => {
        console.log(formErrors)
    }, [formErrors]); // Run this effect when `isModalAddcartOpen` changes
    /// End Modal Add Cart ///



    return (
        <>
            <div className=" w-full">

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">⭐ {activeCategory.name}</h2>
                        <div className="flex gap-3">
                            <button onClick={clickEditItem} className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-green-500 text-white">
                                <Edit className="w-5 h-5" />
                                <span>Edit</span>
                            </button>
                            <button onClick={() => openModal(null)} className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-red-500 text-white">
                                <Plus className="group-hover:rotate-90 transition-all w-5 h-5" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {products
                            .filter(product => !activeCategory || parseInt(product.categories_id) === parseInt(activeCategory.id))
                            .map((product, index) => (
                                <div key={index} className={`relative ${isEdit ? 'animate-bounce' : ''}`}>
                                    <div onClick={() => openModal(product.id)} className={`absolute z-10 cursor-pointer -top-2 right-0 bg-green-500 text-white p-2 rounded-full ${!isEdit ? "hidden" : "wiggle"}`}>
                                        <Edit2 className="w-5 h-5" />
                                    </div>
                                    <div onClick={() => openModalAddcart(product)} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group">
                                        <div className="relative">
                                            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-full h-48 object-cover group-hover:scale-110 transition-all" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold mb-1">{product.name}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold">${product.price}</span>
                                                <button onClick={() => openModalAddcart(product)} className="p-2 rounded-full bg-red-500 text-white">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>


                {/* Modal */}
                {isModalAddcartOpen && (
                    <div onClick={handleOverlayAddcartClick} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-2xl font-semibold mb-4">Select Quantity</h2>
                            <div className="relative">
                                <img src={`http://127.0.0.1:8000/storage/${selectedCategory.image}`} alt={selectedCategory.name} className="object-cover w-[10rem] mx-auto rounded-full mb-5" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-semibold">{selectedCategory.name}</span>
                                <span className="text-lg font-bold">${selectedCategory.price}</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={decreaseQuantity}
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={increaseQuantity}
                                >
                                    +
                                </button>
                            </div>



                            {/* Confirm Button */}
                            <button
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={handleAddToCart}
                            >
                                Add {quantity} to Cart
                            </button>
                            <button
                                className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={closeModalAddcart}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"
                        }`}
                        onClick={handleOverlayClick}  >
                        {isLoading ? <Spining /> : <></>}
                        <div className="bg-white w-1/3 rounded-lg shadow-lg" >
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
                                            value={nameItem}
                                            onChange={(e) => setNameItem(e.target.value)}
                                            placeholder="Enter name"
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="table"
                                        >
                                            Discriptions
                                        </label>
                                        <textarea

                                            id="tablename"
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={descriptionItem}
                                            onChange={(e) => setDescriptionItem(e.target.value)}
                                            placeholder="Enter Descriptions"
                                        />
                                        {formErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.description[0]}</p>
                                        )}
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="price"
                                        >
                                            Price
                                        </label>
                                        <input

                                            id="tablename"
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={priceItem}
                                            onChange={(e) => setPriceItem(e.target.value)}
                                            placeholder="Enter Price"
                                        />
                                        {formErrors.price && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.price[0]}</p>
                                        )}
                                    </div>

                                    {/* Table Number Input */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="categoryImage">
                                            Image
                                        </label>
                                        <input
                                            id="categoryImage"
                                            type="file"
                                            accept="image/*"
                                            className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                                            onChange={(e) => handleImageChangeItem(e)}
                                        />
                                        {formErrors.image && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.image[0]}</p>
                                        )}
                                        {/*Preview Image*/}
                                        {previewImageItem && (
                                            <div className="mt-4">
                                                <img src={previewImageItem} alt="Preview" className="max-w-full h-40 object-cover rounded-lg mx-auto" />
                                            </div>
                                        )}
                                    </div>




                                    {/* Buttons */}
                                    <div className=" items-center gap-4">
                                        {/* Delete Button */}
                                        {headerModal === "Edit Item" && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                onClick={() =>
                                                    confirm("Are you sure you want to delete this Product?") &&
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
                                                onClick={closeModal}
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

            </div>
        </>
    )
}

export default Product