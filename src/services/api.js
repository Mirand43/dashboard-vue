import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com/',
});

export const fetchProducts = () => api.get('/products');
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products/add', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export default api;