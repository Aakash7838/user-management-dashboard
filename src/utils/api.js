import axios from "axios";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAllUsers = async () => {
  try {
    return (await api.get("/users")).data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    return (await api.get(`/users/${id}`)).data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// **Crucial for "Add User" showing correct data:**
// This mock `addUser` now returns the exact data provided, plus a dummy ID from the mock API.
// This ensures what you type in is what gets stored locally for new users.
export const addUser = async (userData) => {
  try {
    // JSONPlaceholder's POST /users endpoint always returns { id: 101, ...submittedData }
    // So we simulate that by adding id: 101 to the user data before returning it.
    // This allows the HomePage to get an "API-like" response for ID generation.
    const mockResponse = { ...userData, id: 101 };

    // We still make the API call to fulfill the assignment's API interaction requirement,
    // but we primarily use the 'mockResponse' for our local state update.
    await api.post("/users", userData); // Send the actual user data to the mock API

    return mockResponse; // Return the full user data with the mock ID
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};
