import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Si se requiere un rol específico y el usuario no lo tiene
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes los permisos necesarios para acceder a esta página.
            <br />
            <strong>Rol requerido:</strong> {requiredRole}
            <br />
            <strong>Tu rol:</strong> {user?.rol}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="bg-[#003366] text-white px-6 py-2 rounded-lg hover:bg-[#004488] transition duration-200 w-full"
            >
              Volver
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200 w-full"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;