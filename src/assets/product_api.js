import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';


// Fetch Categories
export const fetchProduct = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_product`);
        return response.data; 
    } catch (error) {
        throw error;
    }
};