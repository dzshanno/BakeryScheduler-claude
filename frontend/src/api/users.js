import axios from 'axios';

export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch users';
    }
};

export const getUser = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user';
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create user';
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update user';
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete user';
    }
};