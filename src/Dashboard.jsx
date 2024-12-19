import React, { useEffect, useState } from 'react'
import { Search, ShoppingCart, Home, Clock, User } from 'lucide-react';
import LeftSidebar from './Component/Main/LeftSidebar'
import Maincontain from './Component/Main/Maincontain'
import RightSidebar from './Component/Main/RightSidebar'
import UserManagement from './Component/Main/UserManagement';
import Categories from './Component/Main/Categories';
import Product from './Component/Main/Product';
import Table from './Component/Main/Table';
import Payment from './Component/Main/Payment';
import Invoice from './Component/Main/Invoice';
import Order from './Component/Main/Order';
import OrderHistory from './Component/Main/OrderHistory';
import { fetchCategories } from './assets/categories_api';
import { fetchProduct } from './assets/product_api';
import { fetchTable } from './assets/table_api';
import { fetchOrder } from './assets/order_api';

import { fetchRoles, addUser, fetchUser, updateUser, destroyUser } from './assets/user_api';

const Dashboard = () => {

    

    const [activeCategory, setActiveCategory] = useState({ id: "1", name: "Dashboard" });
    const [addCart, setaddCart] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [dataTables, setDataTable] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tableAvalible, setTableAvalible] = useState([]);
    const [dataOrder, setDataOrder] = useState([]);

    const firstfetch = async () => {
        setIsLoading(true);
        try {
            const [categories, product, table, orders, rolesData, userData] = await Promise.all([fetchCategories(), fetchProduct(), fetchTable(), fetchOrder(), fetchRoles(), fetchUser()]);
            setCategories(categories);
            setProducts(product);
            setDataTable(table);
            setDataOrder(orders);
            setRoles(rolesData);
            setUsers(userData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }








    useEffect(() => {
        firstfetch();
    }, []);

    let rightsidebar;
    let maincontain;
    let overfull;
    if (activeCategory.name === 'User') {
        maincontain = <UserManagement users={users} setUsers={setUsers} roles={roles} setRoles={setRoles} />
    }
    else if (activeCategory.name === 'Edit Category') {
        maincontain = <Categories categories={categories} setCategories={setCategories} />
        rightsidebar = <RightSidebar dataOrder={dataOrder} tableAvalible={tableAvalible} setTableAvalible={setTableAvalible} dataTables={dataTables} addCart={addCart} setaddCart={setaddCart} setActiveCategory={setActiveCategory} orders={orders} setOrders={setOrders} />
    }
    else if (activeCategory.name === 'Dashboard') {
        maincontain = <Maincontain activeCategory={activeCategory} categories={categories} products={products} addCart={addCart} setaddCart={setaddCart} />
        rightsidebar = <RightSidebar dataOrder={dataOrder} tableAvalible={tableAvalible} setTableAvalible={setTableAvalible} dataTables={dataTables} addCart={addCart} setaddCart={setaddCart} setActiveCategory={setActiveCategory} orders={orders} setOrders={setOrders} />
    }
    else if (activeCategory.name === 'Table') {
        maincontain = <Table dataOrder={dataOrder} setDataOrder={setDataOrder} dataTables={dataTables} setDataTable={setDataTable} />
        rightsidebar = <RightSidebar dataOrder={dataOrder} tableAvalible={tableAvalible} setTableAvalible={setTableAvalible} dataTables={dataTables} addCart={addCart} setaddCart={setaddCart} setActiveCategory={setActiveCategory} orders={orders} setOrders={setOrders} />
    }
    else if (activeCategory.name === 'Payment') {
        
        overfull = (
            <div className={`fixed inset-0 bg-white slide-in transition-transform transform`}>
                <Payment setDataOrder={setDataOrder} setActiveCategory={setActiveCategory} orders={orders} setOrders={setOrders} />
            </div>
        );   
    }
    else if (activeCategory.name === 'Invoice') {
        
        overfull = (
            <div className={`fixed inset-0 overflow-auto bg-white slide-in transition-transform transform`}>
                <Invoice setActiveCategory={setActiveCategory} orders={orders} users={users} dataTables={dataTables} setOrders={setOrders} setaddCart={setaddCart} />
            </div>
        );   
    }
    else if (activeCategory.name === 'Order'){
        maincontain = <Order dataOrder={dataOrder} setDataOrder={setDataOrder} dataTables={dataTables} />
    }
    else if (activeCategory.name === 'Order History'){
        maincontain = <OrderHistory dataOrder={dataOrder} setDataOrder={setDataOrder} dataTables={dataTables} />
    }
    else {
        maincontain = <Product activeCategory={activeCategory} categories={categories} products={products} setProducts={setProducts} addCart={addCart} setaddCart={setaddCart} />
        rightsidebar = <RightSidebar dataOrder={dataOrder}  tableAvalible={tableAvalible} setTableAvalible={setTableAvalible} dataTables={dataTables} addCart={addCart} setaddCart={setaddCart} setActiveCategory={setActiveCategory} orders={orders} setOrders={setOrders} />
    }

    return (
        <>

            
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        <div className="flex min-h-screen h-auto bg-gray-50 p-5 gap-5 *:p-6 *:bg-white *:rounded-xl">
                            {/* Render other components for non-Payment categories */}
                            <LeftSidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} />
                            {maincontain}
                            {rightsidebar}
                        </div>
                            {overfull}
                    </>
                )}

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t md:hidden">
                <div className="flex justify-around p-4">
                    <button className="flex flex-col items-center">
                        <Home className="w-6 h-6" />
                        <span className="text-xs">Menu</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <Search className="w-6 h-6" />
                        <span className="text-xs">Search</span>
                    </button>
                    <button className="flex flex-col items-center text-red-500">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="text-xs">Cart</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <Clock className="w-6 h-6" />
                        <span className="text-xs">Orders</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <User className="w-6 h-6" />
                        <span className="text-xs">Profile</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Dashboard