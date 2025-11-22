import axios from "axios";

const API_URL = "http://localhost:5000/api/donors";

// ✅ Register Donor
export const registerDonor = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

// ✅ Login Donor
export const loginDonor = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// ✅ Get Donor by ID
export const getDonorById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};
