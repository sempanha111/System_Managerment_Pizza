import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Fetch roles
export const fetchRoles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_role`);
        return response.data; // Assuming it returns an array of roles
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

// Add user
export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/adduser`, userData);
        return response.data; 
    } catch (error) {
        if (error.response && error.response.status === 422) {
            throw error.response.data.errors;
        } else {
            console.error('Error adding user:', error);
            throw new Error('Something went wrong, please try again later.');
        }
    }
};

export const fetchUser = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/fetchuser`);
        return response.data;
    } catch (error){
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export const updateUser = async (id, formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/updateuser/${id}`, formData);
        return response.data;
    } catch (error){
        if (error.response && error.response.status === 422) {
            throw error.response.data.errors;
        } else {
            console.error('Error Updating user:', error);
            throw new Error('Something went wrong, please try again later.');
        }
    }
}

export const destroyUser = async (id) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/deleteuser/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

// Other API methods can go here...
