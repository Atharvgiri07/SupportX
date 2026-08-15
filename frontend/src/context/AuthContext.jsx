import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('supportx_user');
    const storedToken = localStorage.getItem('supportx_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, totpCode, role, adminSecurityKey) => {
    const payload = { email, password, totpCode, role };
    if (role === 'admin' && adminSecurityKey) {
      payload.adminSecurityKey = adminSecurityKey;
    }
    const { data } = await api.post('/auth/login', payload);

    if (data.require2FA) {
      return data; // Requires 2FA verification challenge step
    }

    localStorage.setItem('supportx_token', data.token);
    localStorage.setItem('supportx_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('supportx_token', data.token);
    localStorage.setItem('supportx_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const updateUserState = (newData) => {
    setUser((prev) => {
      const merged = { ...prev, ...newData };
      localStorage.setItem('supportx_user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    localStorage.removeItem('supportx_token');
    localStorage.removeItem('supportx_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUserState, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
