import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('careerConnect_token');
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Check login status error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data.success) {
        const userData = res.data.data;
        localStorage.setItem('careerConnect_token', userData.token);
        localStorage.setItem('careerConnect_user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Logged in successfully!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/register', { name, email, password, role });
      if (res.data.success) {
        const userData = res.data.data;
        localStorage.setItem('careerConnect_token', userData.token);
        localStorage.setItem('careerConnect_user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Registered successfully!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('careerConnect_token');
    localStorage.removeItem('careerConnect_user');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('careerConnect_user', JSON.stringify(res.data.data));
        toast.success('Profile updated successfully!');
        return { success: true, user: res.data.data };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Profile update failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
