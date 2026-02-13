import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
});

// Add a request interceptor to include the token in headers
// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        // If the request already has an Authorization header, use it
        if (config.headers.Authorization) {
            return config;
        }

        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');
        const token = adminToken || userToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getProducts = async () => {
    const { data } = await api.get('/products');
    return data;
};

export const getProductById = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const adminLogin = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

export const createProduct = async (productData: any) => {
    const { data } = await api.post('/products', productData);
    return data;
};

export const updateProduct = async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

export const uploadImage = async (formData: FormData) => {
    const { data } = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const getSiteSettings = async () => {
    const { data } = await api.get('/settings');
    return data;
};

export const updateSiteSettings = async (settingsData: any) => {
    const { data } = await api.put('/settings', settingsData);
    return data;
};

export const requestOTP = async (identifier: { email?: string, phone?: string }) => {
    const { data } = await api.post('/auth/otp', identifier);
    return data;
};

export const verifyOTP = async (identifier: { email?: string, phone?: string }, otp: string) => {
    const { data } = await api.post('/auth/verify', { ...identifier, otp });
    return data;
};

// User Profile & Address APIs
export const getUserProfile = async (token: string) => {
    const { data } = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const updateUserProfile = async (userData: any, token: string) => {
    const { data } = await api.put('/user/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const addAddress = async (address: any, token: string) => {
    const { data } = await api.post('/user/address', address, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const deleteAddress = async (id: string, token: string) => {
    const { data } = await api.delete(`/user/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export default api;
