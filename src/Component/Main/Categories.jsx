import React, { useEffect, useState } from 'react'
import { Plus, Heart, Trash, Edit, Edit2 } from 'lucide-react';
import { fetchCategories } from '../../assets/categories_api';
import { toast } from 'react-toastify';
import Spining from './spining';
import axios from 'axios';
const Categories = ({ categories, setCategories }) => {
    const [selectedCategory, setSelectedCategory] = useState(null); // To store the selected category
    const [isModalOpen, setIsModalOpen] = useState(false); // To toggle modal visibility
    const [isExiting, setIsExiting] = useState(false);
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [nameHeaderModal, setnameHeaderModal] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // State to hold validation errors
    const [formData, setFormData] = useState({ name: "" });
    const [isLoading, setIsLoading] = useState(false);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // useEffect(() => {
    //     console.log(categories)
    // },[categories]);

    /// Modal ///
    const openModal = (category) => {

        if (category == null) {
            setIsModalOpen(true);
            setPreviewImage(null);
            setFormData({ name: "" });
            setnameHeaderModal('Add Category');
        }
        else {
            setIsModalOpen(true);
            setFormData({ id: category.id, name: category.name });
            setPreviewImage(`http://127.0.0.1:8000/storage/${category.image}`)
            setnameHeaderModal('Edit Category');
        }
    };
    const closeModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsExiting(false);
            setSelectedCategory(null);
            setFile(null);
            setFormErrors({});
        }, 300);
    };
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleSave = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const form = new FormData();
        form.append("name", formData.name);
        if (file) {
            form.append("image", file); // Include the image file if present
        }

        try {
            if (nameHeaderModal === 'Add Category') {
                const response = await axios.post("http://127.0.0.1:8000/api/addcategories", form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const newCategory = response.data.data;
                setCategories((prevCategories) => [...prevCategories, newCategory]);
                closeModal();
                toast.success("Category Added Successfully!");
            }
            else if (nameHeaderModal === 'Edit Category') {
                // Include the ID of the category for the update
                form.append("id", formData.id);

                const response = await axios.post(`http://127.0.0.1:8000/api/updatecategories/${formData.id}`, form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const updatedCategory = response.data.data;
                setCategories((prevCategories) =>
                    prevCategories.map((category) =>
                        category.id === updatedCategory.id ? updatedCategory : category
                    )
                );
                closeModal();
                toast.success("Category Updated Successfully!");
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
            const response = await axios.post(`http://127.0.0.1:8000/api/deletecategories/${formData.id}`);
            toast.success(response.data.message);
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== formData.id)
            );
            closeModal();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete the category. Please try again.");
        }
    }

    /// End Modal ///
    return (
        <>
            <div className="flex-1 ">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">⭐ Categories</h2>
                        <div className="">
                            <button onClick={() => openModal(null)} className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-red-500 text-white">
                                <Plus className="group-hover:rotate-90 transition-all w-5 h-5" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {categories.map((categorie, index) => (
                            <div key={index} onClick={() => openModal(categorie)} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group">
                                <div className="relative">
                                    <img src={`http://127.0.0.1:8000/storage/${categorie.image}`} alt={categorie.name} className="w-full h-48 object-cover group-hover:scale-110 transition-all" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1">{categorie.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"
                            }`}
                        onClick={handleOverlayClick}
                    >
                        {isLoading ? <Spining /> : <></>}
                        <div className="bg-white w-1/3 rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">{nameHeaderModal}</h2>
                                <form className="space-y-4" onSubmit={handleSave}>
                                    {/* Category Name Input */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="categoryName">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter category name"
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>
                                        )}
                                    </div>

                                    {/* Category Image Input */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="categoryImage">
                                            Image
                                        </label>
                                        <input
                                            id="categoryImage"
                                            type="file"
                                            accept="image/*"
                                            className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                                            onChange={(e) => handleImageChange(e)}
                                        />
                                        {formErrors.image && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.image[0]}</p>
                                        )}
                                        {previewImage && (
                                            <div className="mt-4">
                                                <img src={previewImage} alt="Preview" className="max-w-full h-40 object-cover rounded-lg mx-auto" />
                                            </div>
                                        )}

                                    </div>

                                    {/* Buttons */}
                                    <div className="items-center">
                                        {/* Delete Button */}
                                        {nameHeaderModal === "Edit Category" && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                onClick={() =>
                                                    confirm("Are you sure you want to delete this category?") &&
                                                    handleDelete()
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

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

export default Categories