// src/UserContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user information, including role

  const login = (userData) => {
    setUser(userData); // Set user data upon login
    console.log("User logged in:", userData); // Debugging log
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
  };

  const isAdmin = () => {
    return user && user.role === "admin"; // Check if the user is an admin
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
