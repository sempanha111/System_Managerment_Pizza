import React, { useEffect, useState } from 'react'
import { Plus  } from 'lucide-react';
import {  addUser, updateUser, destroyUser } from '../../assets/user_api';
import { toast } from 'react-toastify';


const UserManagement = ({users, setUsers, roles, setRoles}) => {

    const [formErrors, setFormErrors] = useState({}); // State to hold validation errors
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role_id: '1', });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (headerModal === 'Add User') {
            if (formData.name && formData.email && formData.password) {

                try {

                    const newUser = await addUser(formData);
                    console.log(newUser);
                    setUsers([...users, newUser]);
                    closeModal();
                    // Reset form data
                    setFormErrors({});
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        role_id: '1',
                    });
                    toast.success("User Added successfully!");

                } catch (errors) {
                    setFormErrors(errors)
                }

            }
        }
        // Check if in "Edit" mode
        else if (headerModal === 'Edit User') {
            if (formData.id && formData.name && formData.email) {
                try {
                    const updatedUser = await updateUser(formData.id, formData); // API call to update user
                    console.log(updatedUser);
                    // Update local state
                    setUsers(users.map(user =>
                        user.id === formData.id ? updatedUser : user
                    ));

                    closeModal();

                    // Reset form data
                    setFormErrors({});
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        role_id: '1',
                    });

                    toast.success("Edit User successfully!");

                } catch (errors) {
                    setFormErrors(errors); // Display any errors
                }
            }
        }
    }

    const deleteUser = async (id) => {
        try {
            const destroyuser = await destroyUser(id);
            console.log(id, destroyuser)
            setUsers((prevItems) => prevItems.filter((users) => users.id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error("Failed to delete user. Please try again.");
        }
    };



    useEffect(() => {
    }, [formData, users, formErrors]);

    /// Modal ///
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [headerModal, setHeaderModal] = useState("");

    const openModal = (id) => {

        setIsModalOpen(true);
        setIsExiting(false);

        if (id == null) {
            setHeaderModal("Add User");
        }
        else {
            setHeaderModal("Edit User");
            const dataUser = users.find((user) => user.id === id);
            setFormData({
                id: id,
                name: dataUser.name,
                email: dataUser.email,
                password: "",
                role_id: dataUser.role_id.toString(),
            });
        }

    }

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setIsExiting(true);
        }, 200)
        // Reset form data
        setFormData({
            name: "",
            email: "",
            password: "",
            role_id: "1",
        });
    }
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }



    return (
        <div className=" w-full">

            <div className="">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">⭐User</h2>
                    <div className="flex gap-3">

                        <button onClick={() => openModal(null)} className="flex items-center pl-2 pr-3 py-2 group rounded-full bg-red-500 text-white">
                            <Plus className="group-hover:rotate-90 transition-all w-5 h-5" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>



                <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg">
                    <thead>
                        <tr className="bg-indigo-500 text-white">
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Name
                                <button className="ml-2 text-white hover:text-gray-300">
                                    ▲▼
                                </button>
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Email
                                <button className="ml-2 text-white hover:text-gray-300">
                                    ▲▼
                                </button>
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.email}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.role_name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                                            onClick={() => openModal(user.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            onClick={() => confirm('Are you sure you want to delete this user?') && deleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                >
                                    No users added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>


            {/* Modal */}
            {isModalOpen && (
                <div onClick={handleOverlayClick} className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`} >
                    <div className="bg-white w-1/3 rounded-lg shadow-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">{headerModal}</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="table"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email"
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email[0]}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter Password"
                                    />
                                    {formErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.password[0]}</p>
                                    )}
                                </div>
                                <div >
                                    <label htmlFor="role" className="block text-gray-700 font-medium">
                                        Role
                                    </label>
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.role_id && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.role_id[0]}</p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className=" items-center gap-4">


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


    );
}

export default UserManagement