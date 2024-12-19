import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';


export const fetchOrder = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_order`);
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const fetchOrderItem = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_order_item/${id}`);
        return response; 
    } catch (error) {
        throw error;
    }
};