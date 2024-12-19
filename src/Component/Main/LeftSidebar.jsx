import React from 'react'
import { Search, Bell} from 'lucide-react';
import { logout } from '../../assets/authservice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const LeftSidebar = ({activeCategory, setActiveCategory, categories}) => {
const navigate = useNavigate();

const handleLogout = async () => {
    try {
        const message = await logout();
        console.log(message); // Show success message

        toast.success("You have successfully logged out!");

        navigate('./login')
    } catch (error) {
        console.error(error);
    }
}

    return (
        <>
            {/* Left Sidebar - Categories */}
            <div className="min-w-[18rem] ">
                <div className="flex items-center space-x-2 mb-6">
                    <input type="text" placeholder="Find Product" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    <Search className="w-5 h-5 text-gray-500" />
                </div>

                <h2 className="text-lg font-semibold mb-4">MENU</h2>

                <div className="space-y-2">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(category)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeCategory.name === category.name
                                ? 'bg-red-500 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <span><img className='w-[2rem]' src={`http://127.0.0.1:8000/storage/${category.image}`} alt="" /></span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>

                <button onClick={handleLogout} className=" bottom-4 left-4 w-52 flex items-center justify-center space-x-2 bg-red-50 text-red-500 px-4 py-3 rounded-lg">
                    <Bell className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
};

export default LeftSidebar