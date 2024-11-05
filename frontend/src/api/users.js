import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getUser = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users/`, userData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
