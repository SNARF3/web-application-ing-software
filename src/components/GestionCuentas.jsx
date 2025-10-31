import React, { useState } from 'react';
import { 
  UserPlus, User, Mail, Lock, AlertCircle, CheckCircle, 
  Eye, EyeOff, Shield, Users, Clock, LogIn, TrendingDown, Bell, Check, LockKeyhole
} from 'lucide-react';

// Colores institucionales y tema del panel
const COLORS = {
  primary: 'bg-[#003366]', // Azul UCB Oscuro (Navy)
  accent: 'bg-[#FFD700]', // Amarillo UCB/Dorado
  textLight: 'text-white',
  textDark: 'text-[#003366]',
  hoverPrimary: 'hover:bg-[#004488]',
  focusAccent: 'focus:ring-[#FFD700]',
};

// Roles permitidos en el sistema (Actualizados)
const ROLES = [
  { 
    id: 'admin', 
    name: 'Administrador', 
    description: 'Acceso total a todos los módulos y gestión de cuentas, roles y seguridad.' 
  },
  { 
    id: 'collaborator', 
    name: 'Colaborador', 
    description: 'Acceso a Gestión de Visitas, Colegios, Registro de Estudiantes y Reportes básicos.' 
  },
];

// Datos de actividad de ejemplo (Actualizados: SOLO eventos de ACCESO/SESIÓN)
const AUDIT_LOG = [
  { time: 'Hace 5 min', user: 'AdminUCB', event: 'Inicio de sesión exitoso.', type: 'login', status: 'success' },
  { time: 'Hace 10 min', user: 'Colaborador_Laura', event: 'Cierre de sesión manual.', type: 'logout', status: 'info' },
  { time: 'Hace 30 min', user: 'AdminUCB', event: 'Intento de sesión fallido (Contraseña incorrecta).', type: 'security', status: 'warning' },
  { time: 'Hace 1 hr', user: 'Colaborador_Juan', event: 'Bloqueo temporal de cuenta por 5 intentos fallidos.', type: 'security', status: 'error' },
  { time: 'Hace 2 hrs', user: 'Colaborador_Laura', event: 'Inicio de sesión exitoso después de 12 días de inactividad.', type: 'login', status: 'success' },
  { time: 'Hace 3 hrs', user: 'AdminUCB', event: 'Intento de inicio de sesión desde ubicación no reconocida.', type: 'security', status: 'error' },
  { time: 'Hace 4 hrs', user: 'AdminUCB', event: 'Cierre de sesión por inactividad.', type: 'logout', status: 'info' },
];

// --- Estilos CSS Personalizados para Animaciones ---
const CustomStyles = () => (
    <style>
        {`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
        
        .input-focus-effect:focus {
            box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.5); /* Anillo amarillo (UCB) */
            border-color: #003366; /* Borde azul UCB */
        }
        
        .role-card:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
        }
        `}
    </style>
);

// --- Componente de Alerta de Manejo de Errores/Éxito ---
const CustomAlert = ({ message, type }) => {
  if (!message) return null;

  const style = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div 
      className={`p-4 mb-4 border-l-4 rounded-lg flex items-start animate-fadeIn ${style[type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="font-bold">{type === 'success' ? 'Éxito' : 'Error de Validación'}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};


// --- Componente Principal (GestionCuentas) ---
const GestionCuentas = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES[0].id,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // <-- agregado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, role } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      return 'Todos los campos son obligatorios para registrar un nuevo usuario.';
    }

    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (password !== confirmPassword) {
      return 'La contraseña y la confirmación de contraseña no coinciden.';
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'El formato del correo electrónico no es válido.';
    }

    return null; // No hay errores
  };

  // --- Cambiado: ahora realiza POST a la API de registro ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    // Mapear role string a id_rol numérico requerido por la API
    const roleMap = { admin: 1, collaborator: 2 };
    const id_rol = roleMap[formData.role] ?? 2; // por defecto 2 (colaborador)

    const payload = {
      nombre: formData.firstName,
      apellido: formData.lastName,
      correo: formData.email,
      contrasenia: formData.password,
      id_rol,
    };

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // intentar obtener mensaje de error del body
        let errMsg = `Error ${res.status} - ${res.statusText}`;
        try {
          const errJson = await res.json();
          if (errJson && (errJson.message || errJson.error)) {
            errMsg = errJson.message || errJson.error;
          }
        } catch (_) { /* ignore JSON parse errors */ }
        setError(errMsg);
        setSuccess(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      setSuccess(data.message || `Usuario '${formData.email}' registrado como ${ROLES.find(r => r.id === formData.role)?.name}.`);
      setError(null);

      // Resetear formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ROLES[0].id,
      });
    } catch (err) {
      setError(err.message || 'Error de red al conectar con la API.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
      <CustomStyles />
      
      {/* 1. Encabezado */}
      <div className="mb-8 pb-4 border-b border-gray-200 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-[#003366] flex items-center">
          <Shield className="w-8 h-8 mr-3 text-[#FFD700]" />
          Gestión de Cuentas y Seguridad
        </h1>
        <p className="text-gray-500 mt-1">Administración centralizada de usuarios, roles y auditoría de acceso UCB.</p>
      </div>

      {/* 2. Formulario de Registro y Roles (Sección Superior) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Columna 1: Formulario de Registro de Nuevo Usuario (2/3 de ancho) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-xl animate-fadeIn border-t-8 border-[#003366]">
          <h2 className="text-2xl font-bold mb-6 text-[#003366] flex items-center">
            <UserPlus className="w-6 h-6 mr-3 text-[#FFD700]" />
            Registro de Nuevo Usuario
          </h2>
          
          <CustomAlert message={error} type="error" />
          <CustomAlert message={success} type="success" />

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campos de Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                  required
                />
              </div>
            </div>

            {/* Campo de Correo Electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@ucb.edu.bo"
                  className={`w-full pl-10 pr-3 p-3 border border-gray-300 rounded-lg focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                  required
                />
              </div>
            </div>

            {/* Campos de Contraseña */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#003366]"
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita la contraseña"
                    className={`w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#003366]"
                    title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Selector de Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignar Rol</label>
              <div className="relative">
                <Users className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-4 ${COLORS.focusAccent} focus:border-[#003366] transition duration-150 input-focus-effect`}
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${COLORS.primary} ${COLORS.hoverPrimary} ${COLORS.textLight} font-bold py-3 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] flex items-center justify-center text-lg mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <UserPlus className="w-5 h-5 mr-3" />
              {loading ? 'Enviando...' : 'Registrar Cuenta de Usuario'}
            </button>
          </form>
        </div>

        {/* Columna 2: Roles y Permisos (1/3 de ancho) */}
        <div className="p-6 bg-white rounded-xl shadow-xl animate-fadeIn border-t-8 border-[#FFD700] h-fit">
            <h2 className="text-2xl font-bold mb-4 text-[#003366] flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#003366]" />
              Roles y Permisos
            </h2>
            <div className="space-y-4">
              {ROLES.map(role => (
                <div 
                  key={role.id} 
                  className={`role-card p-4 rounded-lg border border-gray-200 transition duration-300 shadow-sm 
                            ${role.id === formData.role ? 'bg-[#FFD700]/20 border-[#FFD700]' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start">
                      <p className={`font-extrabold text-lg ${role.id === formData.role ? COLORS.textDark : 'text-gray-900'}`}>{role.name}</p>
                      {role.id === formData.role && <Check className='w-5 h-5 text-green-600 flex-shrink-0 mt-1'/> }
                  </div>
                  <p className="text-sm text-gray-600 mt-1 italic">{role.description}</p>
                </div>
              ))}
            </div>
        </div>
        
      </div>

      {/* 3. Registro de Actividades (Sección Inferior, Full Width y Destacada) */}
      <div className="p-6 bg-white rounded-xl shadow-2xl animate-fadeIn border-t-8 border-gray-400" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold mb-6 text-[#003366] flex items-center border-b pb-2">
            <LockKeyhole className="w-7 h-7 mr-3 text-red-500" />
            Auditoría de Acceso y Sesiones
        </h2>
        <p className="text-gray-600 mb-4">Registro detallado de inicios de sesión, cierres, intentos fallidos y bloqueos por seguridad.</p>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {AUDIT_LOG.map((log, index) => {
            let color, Icon, borderColor, bgColor;
            
            switch (log.status) {
              case 'success':
                color = 'text-green-600';
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
                Icon = LogIn;
                break;
              case 'warning':
                color = 'text-yellow-600';
                borderColor = 'border-yellow-500';
                bgColor = 'bg-yellow-50';
                Icon = AlertCircle;
                break;
              case 'error':
                color = 'text-red-600';
                borderColor = 'border-red-500';
                bgColor = 'bg-red-50';
                Icon = TrendingDown;
                break;
              default: // info (cierre de sesión)
                color = 'text-blue-600';
                borderColor = 'border-blue-500';
                bgColor = 'bg-blue-50';
                Icon = Bell;
            }

            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-l-4 ${borderColor} ${bgColor} flex items-center justify-between text-sm transition duration-200 hover:shadow-md animate-fadeIn`}
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-center w-full">
                  <Icon className={`w-5 h-5 mr-3 ${color} flex-shrink-0`} />
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 items-center">
                    <p className={`font-bold ${color}`}>{log.user}</p>
                    <p className="text-gray-700 col-span-2">{log.event}</p>
                    <p className="text-xs text-gray-500 text-right">{log.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4 italic text-right">Esta lista es crucial para monitorear patrones de acceso y actividad potencialmente maliciosa.</p>
      </div>
    </div>
  );
};

export default GestionCuentas;
