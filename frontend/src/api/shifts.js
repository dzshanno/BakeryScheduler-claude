import axios from 'axios';

const API_URL = '/api/shifts';

export const createShift = async (shiftData) => {
    const response = await axios.post(API_URL, shiftData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getShifts = async (start, end) => {
    const response = await axios.get(`${API_URL}?start=${start}&end=${end}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};
