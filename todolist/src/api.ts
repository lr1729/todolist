// Importing necessary modules
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Creating an instance of axios with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080', // replace with your API base URL
});

// Adding a request interceptor to the axios instance
api.interceptors.request.use(
  (config) => {
    // Getting the token from local storage
    const token = localStorage.getItem('token');
    // If the token exists, add it to the request header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the config object
    return config;
  },
  (error) => {
    // If there's an error, reject the Promise and return the error
    return Promise.reject(error);
  }
);

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // Check if token exists and is valid
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      if (expirationDate < new Date()) {
        // Token has expired
        return false;
      }
      return true;
    } catch (error) {
      // Token is not valid
      console.error('Error decoding token:', error);
      return false;
    }
  }
  // Token does not exist
  return false;
};

// Function to get user ID from JWT token
export const getUserId = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId; // Replace 'userId' with the actual claim name for user ID
    } catch (error) {
      // Token is not valid or does not contain userId claim
      console.error('Error decoding token:', error);
      return null;
    }
  }
  // Token does not exist
  return null;
};

// Function to login a user and store the token in local storage
export const login = async (username: string, password: string) => {
  const response = await api.post('/users/login', { username, password });
  localStorage.setItem('token', response.data.token);
  
  return response.data.userId; // assuming the response contains userId
};

// Function to get tasks of a user
export const getUserTasks = async (userId: string) => {
  const response = await api.get(`/users/${userId}/tasks`);
  
  return response.data;
};

// Function to register a new user and store the token in local storage
export const register = async (username: string, password: string) => {
  const response = await api.post('/users/register', { username, password });
  
  localStorage.setItem('token', response.data.token);

  return response.data.userId; // assuming the response contains userId
};

// Function to get details of a user
export const getUserDetails = async (userId: string) => {
  const response = await api.get(`/users/${userId}/username`);
  response.data[0].id = userId;
  return response.data[0];
};

// Function to create a new task for a user
export const createTask = async (userId: string, title: string, description: string, status: string) => {
  // Implementation here...
  const response = await api.post(`/users/${userId}/tasks`, { title, description, status });

  return response.data; // assuming the response contains the created task
};

// Function to get a specific task of a user
export const getTask = async (userId: string, taskId: string) => {
  const response = await api.get(`/users/${userId}/tasks/${taskId}`);

  return response.data; // assuming the response contains the task details
};

// Function to update a specific task of a user
export const updateTask = async (userId: string, taskId: string, title?: string, description?: string, status?: 'Pending' | 'In Progress' | 'Completed') => {
  const response = await api.put(`/users/${userId}/tasks/${taskId}`, { title, description, status });

  return response.data; // assuming the response contains the updated task details
};

// Function to delete a specific task of a user
export const deleteTask = async (userId: string, taskId: string) => {
  const response = await api.delete(`/users/${userId}/tasks/${taskId}`);

  return response.data; // assuming the response contains some status message
};

// Function to logout a user by removing the token from local storage 
export const logout = () => {
localStorage.removeItem('token');
};

