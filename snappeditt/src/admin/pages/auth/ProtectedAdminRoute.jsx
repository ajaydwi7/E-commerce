// src/components/ProtectedAdminRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/check-auth`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [location]);

  if (isAuthenticated === null) return <Loader />;

  return isAuthenticated ? children : <Navigate to="/admin/auth/signin" replace />;
};

export default ProtectedAdminRoute;