import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makePayment = (paymentData) => api.post('/payment', paymentData);

export const getPaymentStatus = (paymentRef) => api.get(`/payment_status/${paymentRef}`);

export const getTransactions = (transactionData) => api.post('/transactions', transactionData);

export default api;