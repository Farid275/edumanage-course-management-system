import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock user on mount
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ email: parsed.email });
        setRole(parsed.role);
      } catch (e) {
        console.error("Failed to parse mock user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, selectedRole) => {
    const mockUser = { email, role: selectedRole };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser({ email });
    setRole(selectedRole);
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex h-screen w-full items-center justify-center bg-surface">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};
