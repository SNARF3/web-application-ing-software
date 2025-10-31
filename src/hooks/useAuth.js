import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const userData = sessionStorage.getItem('user');

      if (token && userData) {
        // Verificar si el token es válido con el backend
        const response = await fetch('http://localhost:3000/api/login/verificar-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.usuario);
        } else {
          // Token inválido, limpiar sessionStorage
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    checkAuth
  };
};