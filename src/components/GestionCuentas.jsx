import React, { useState, useEffect } from 'react';
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

// Estado y utilidades para obtener logs desde la API
// Endpoint esperado: GET http://localhost:3000/logs -> array de objetos con campos como
// { id_log, fechahora, nombre_usuario, apellido_usuario, nombre_rol, tipo_log }

// Mapea tipo_log numérico a texto, estado y icono/colores
const LOG_TYPES = {
  1: { text: 'Inicio de sesión exitoso', status: 'success', Icon: LogIn },
  2: { text: 'Cierre de sesión manual', status: 'info', Icon: Bell },
  3: { text: 'Inicio de sesión fallido', status: 'warning', Icon: AlertCircle },
  4: { text: 'Varios intentos fallidos', status: 'error', Icon: TrendingDown },
  5: { text: 'Cambio de contraseña', status: 'success', Icon: LockKeyhole },
  6: { text: 'Actualización de datos', status: 'info', Icon: Check },
  7: { text: 'Eliminación de registro', status: 'error', Icon: TrendingDown },
  8: { text: 'Acceso a módulo restringido', status: 'warning', Icon: Shield },
  9: { text: 'Visualización de reportes', status: 'info', Icon: Clock },
  10: { text: 'Cambio de contraseña exitoso', status: 'success', Icon: LockKeyhole },
  11: { text: 'Restablecimiento de contraseña', status: 'warning', Icon: Lock },
  12: { text: 'Bloqueo de cuenta', status: 'error', Icon: Shield },
};

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

  // Logs: cargados desde la API /logs
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);

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

    const emailLower = (email || '').toLowerCase();

    if (!/\S+@\S+\.\S+/.test(emailLower)) {
      return 'El formato del correo electrónico no es válido.';
    }

    // Validación específica: solo dominio @ucb.edu.bo
    if (!emailLower.endsWith('@ucb.edu.bo')) {
      return 'El correo debe pertenecer al dominio @ucb.edu.bo.';
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
      const res = await fetch('http://localhost:3000/user/register', {
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

  // --- Util: tiempo relativo en español (Hace X) ---
  const timeAgo = (isoDate) => {
    try {
      const then = new Date(isoDate);
      const now = new Date();
      const diff = Math.floor((now - then) / 1000); // seconds

      if (diff < 60) return `Hace ${diff} ${diff === 1 ? 'segundo' : 'segundos'}`;
      const mins = Math.floor(diff / 60);
      if (mins < 60) return `Hace ${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      const days = Math.floor(hours / 24);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } catch (e) {
      return '';
    }
  };

  // --- Cargar logs desde la API al montar ---
  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      setLoadingLogs(true);
      setErrorLogs(null);
      try {
        const res = await fetch('http://localhost:3000/logs');
        if (!res.ok) throw new Error(`Error ${res.status} - ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;
        // Esperamos un array; normalizamos por seguridad
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
          setErrorLogs('Respuesta inesperada de la API de logs.');
        }
      } catch (err) {
        setErrorLogs(err.message || 'Error al obtener logs');
        setLogs([]);
      } finally {
        if (mounted) setLoadingLogs(false);
      }
    };

    fetchLogs();
    return () => { mounted = false; };
  }, []);

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
                  pattern="^[A-Za-z0-9._%+-]+@ucb\.edu\.bo$"
                  title="El correo debe ser del dominio @ucb.edu.bo"
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
          {loadingLogs && (
            <div className="text-sm text-gray-500">Cargando registros de auditoría...</div>
          )}

          {errorLogs && (
            <div className="text-sm text-red-600">{errorLogs}</div>
          )}

          {!loadingLogs && !errorLogs && logs.length === 0 && (
            <div className="text-sm text-gray-500">No hay registros de auditoría disponibles.</div>
          )}

          {logs.map((log, index) => {
            const meta = LOG_TYPES[log.tipo_log] || { text: 'Evento desconocido', status: 'info', Icon: Bell };
            let color, borderColor, bgColor;

            switch (meta.status) {
              case 'success':
                color = 'text-green-600';
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
                break;
              case 'warning':
                color = 'text-yellow-600';
                borderColor = 'border-yellow-500';
                bgColor = 'bg-yellow-50';
                break;
              case 'error':
                color = 'text-red-600';
                borderColor = 'border-red-500';
                bgColor = 'bg-red-50';
                break;
              default:
                color = 'text-blue-600';
                borderColor = 'border-blue-500';
                bgColor = 'bg-blue-50';
            }

            const Icon = meta.Icon || Bell;

            // Prefijo según rol: si nombre_rol contiene 'Admin' o 'Administrador' => admin_, sino colaborador_
            const roleName = (log.nombre_rol || '').toLowerCase();
            const prefix = roleName.includes('admin') || roleName.includes('administrador') ? 'admin' : 'colaborador';
            const displayUser = `${prefix}_${log.nombre_usuario}`;

            const eventText = meta.text;
            const timeText = timeAgo(log.fechahora);

            return (
              <div
                key={log.id_log ?? index}
                className={`p-4 rounded-xl border-l-4 ${borderColor} ${bgColor} flex items-center justify-between text-sm transition duration-200 hover:shadow-md animate-fadeIn`}
                style={{ animationDelay: `${0.2 + index * 0.03}s` }}
              >
                <div className="flex items-center w-full">
                  <Icon className={`w-5 h-5 mr-3 ${color} flex-shrink-0`} />
                  <div className="flex-grow grid grid-cols-2 md:grid-cols-4 items-center">
                    <p className={`font-bold ${color}`}>{displayUser}</p>
                    <p className="text-gray-700 col-span-2">{eventText}</p>
                    <p className="text-xs text-gray-500 text-right">{timeText}</p>
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
