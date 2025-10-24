import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import UserDetailsPage from "./Pages/UserDetailsPage";
import { getAllUsers } from "./utils/api";

function App() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [localUsers, setLocalUsers] = useState(() => {
    const savedUsers = localStorage.getItem("localUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [apiUsers, setApiUsers] = useState([]);

  useEffect(() => {
    const fetchInitialApiUsers = async () => {
      try {
        const data = await getAllUsers();
        setApiUsers(data);
      } catch (error) {
        console.error("Error fetching initial API users:", error);
      }
    };
    fetchInitialApiUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("localUsers", JSON.stringify(localUsers));
  }, [localUsers]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header setShowAddUserModal={setShowAddUserModal} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              showAddUserModal={showAddUserModal}
              setShowAddUserModal={setShowAddUserModal}
              localUsers={localUsers}
              setLocalUsers={setLocalUsers}
              apiUsers={apiUsers}
              setApiUsers={setApiUsers}
            />
          }
        />
        <Route
          path="/user/:id"
          element={
            <UserDetailsPage
              localUsers={localUsers}
              setLocalUsers={setLocalUsers}
              apiUsers={apiUsers}
              setApiUsers={setApiUsers}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
