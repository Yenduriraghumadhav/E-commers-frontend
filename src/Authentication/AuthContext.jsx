import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const getStoredUser = () => {
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('userEmail') || localStorage.getItem('vendore_email') || localStorage.getItem('email');
  const tokenExists = document.cookie.split('; ').some((cookie) => cookie.startsWith('token=') || cookie.startsWith('authToken='));

  return {
    isAuthenticated: Boolean(role || email || tokenExists),
    role: role || null,
    email: email || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  const login = (userData) => {
    const role = userData.role;
    const email = userData.email || userData.userEmail || userData.vendore_email;

    localStorage.setItem('role', role);
    if (email) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('email', email);
    }

    const loggedInUser = {
      isAuthenticated: true,
      role,
      email,
    };
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('vendore_email');
    localStorage.removeItem('email');
    setUser({
      isAuthenticated: false,
      role: null,
      email: null,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    const localUser = getStoredUser();
    return {
      user: localUser,
      login: () => {},
      logout: () => {},
    };
  }

  return context;
};
