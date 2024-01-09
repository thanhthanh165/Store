import axios from 'axios';
import { API_URL } from './apiUrl';

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axios.post(`${API_URL}/products/store`, product);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};