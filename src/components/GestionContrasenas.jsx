import React, { useState, useEffect } from 'react';
import { Lock, Key, Shield, Eye, EyeOff, CheckCircle, AlertTriangle, X } from 'lucide-react';

// Colores institucionales
const COLORS = {
  primary: 'bg-[#003366]', // Azul UCB Oscuro (Navy)
  accent: 'bg-[#FFD700]', // Amarillo UCB/Dorado
  textDark: 'text-[#003366]',
  focusAccent: 'focus:ring-[#FFD700]',
};

// --- Componente de Alerta de Manejo de Errores/Éxito ---
const CustomAlert = ({ message, type }) => {
  if (!message) return null;

  const style = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
  };

  const Icon = type === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div 
      className={`p-4 mb-6 border-l-4 rounded-lg flex items-start animate-fadeIn ${style[type]}`}
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

// --- Componente de Input de Contraseña Reutilizable (MOVIDO FUERA) ---
// Al estar fuera, no se redefine en cada render de GestionContrasenas, evitando la pérdida de foco.
const PasswordInput = ({ name, value, placeholder, show, toggleShow, handleChange }) => (
    <div className="relative">
        <input
            type={show ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] pr-10 transition duration-150`}
            placeholder={placeholder}
            required
        />
        <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#003366]"
            title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
    </div>
);

// --- Componente para los ítems de Requisitos de Contraseña ---
const PasswordRequirementItem = ({ isValid, children }) => {
    const Icon = isValid ? CheckCircle : X;
    const color = isValid ? 'text-green-600' : 'text-red-500';
    
    return (
        <li className="flex items-start transition-colors duration-300">
            <Icon className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${color}`} />
            <span className={`text-gray-700 text-sm ${isValid ? 'font-semibold' : 'font-normal'}`}>{children}</span>
        </li>
    );
};


const GestionContrasenas = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [message, setMessage] = useState({ type: null, text: null });
    const [validation, setValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    // --- Manejo de la Validación en Vivo ---
    useEffect(() => {
        const password = formData.newPassword;
        setValidation({
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            // Caracteres especiales permitidos
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password), 
        });
    }, [formData.newPassword]); // Se ejecuta solo cuando newPassword cambia

    // Función que maneja el cambio en cualquier input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar mensajes al empezar a escribir
        setMessage({ type: null, text: null }); 
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const { currentPassword, newPassword, confirmNewPassword } = formData;
        const allValid = Object.values(validation).every(v => v === true);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return 'Todos los campos de contraseña son obligatorios.';
        }

        if (!allValid) {
            return 'La nueva contraseña no cumple con todos los requisitos de seguridad.';
        }

        if (newPassword !== confirmNewPassword) {
            return 'La Nueva Contraseña y su Confirmación no coinciden.';
        }

        if (newPassword === currentPassword) {
            return 'La nueva contraseña no puede ser igual a la contraseña actual.';
        }

        return null; 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateForm();

        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        // Simulación de Llamada API
        setMessage({ type: 'info', text: 'Procesando cambio de contraseña...' });
        
        setTimeout(() => {
            // Simular una respuesta exitosa del servidor
            setMessage({ 
                type: 'success', 
                text: '¡Contraseña actualizada con éxito! Por favor, mantenga su cuenta segura.' 
            });
            // Enviar log tipo 5 (Cambio de contraseña) usando endpoint bulk
            (async () => {
                try {
                    await fetch('http://localhost:3000/logs/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tipo_log: 5 }),
                    });
                } catch (err) {
                    console.error('Error enviando log de cambio de contraseña:', err);
                }
            })();
            // Resetear formulario
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        }, 1500); // Espera de 1.5 segundos
    };


    return (
        <div className="p-4 md:p-8 bg-gray-50 animate-fadeIn">
            {/* Encabezado */}
            <div className="mb-8 pb-4 border-b border-gray-200">
                <h1 className={`text-4xl font-extrabold ${COLORS.textDark} flex items-center`}>
                    <Lock className="w-8 h-8 mr-3 text-[#FFD700]" />
                    Administración de Contraseñas
                </h1>
                <p className="text-gray-500 mt-1">Gestión y actualización de contraseñas del sistema UCB Explorer.</p>
            </div>

            {/* Formulario de Cambio de Contraseña y Contenido Lateral */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel de Cambio de Contraseña */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-[#003366]">
                    <h2 className={`text-2xl font-bold mb-6 ${COLORS.textDark} flex items-center`}>
                        <Key className="w-6 h-6 mr-3 text-[#FFD700]" />
                        Cambiar Contraseña
                    </h2>
                    
                    <CustomAlert message={message.text} type={message.type} />
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Contraseña Actual */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                            <PasswordInput
                                name="currentPassword"
                                value={formData.currentPassword}
                                placeholder="••••••••"
                                show={showPassword.current}
                                toggleShow={() => toggleShowPassword('current')}
                                handleChange={handleChange}
                            />
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                            <PasswordInput
                                name="newPassword"
                                value={formData.newPassword}
                                placeholder="Nueva contraseña"
                                show={showPassword.new}
                                toggleShow={() => toggleShowPassword('new')}
                                handleChange={handleChange}
                            />
                        </div>

                        {/* Confirmar Nueva Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                            <PasswordInput
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                placeholder="Confirmar contraseña"
                                show={showPassword.confirm}
                                toggleShow={() => toggleShowPassword('confirm')}
                                handleChange={handleChange}
                            />
                        </div>

                        {/* Botón de Guardar */}
                        <button
                            type="submit"
                            className={`w-full ${COLORS.primary} text-white font-bold py-3 rounded-xl shadow-xl hover:bg-[#004488] transition duration-300 flex items-center justify-center mt-6`}
                            disabled={message.type === 'info'} // Deshabilitar durante la simulación de carga
                        >
                            {message.type === 'info' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Actualizando...
                                </span>
                            ) : (
                                <span className='flex items-center'>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Actualizar Contraseña
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Panel de Requisitos y Seguridad */}
                <div className="space-y-6">
                    {/* Requisitos de Contraseña Dinámicos */}
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-8 border-[#FFD700]">
                        <h3 className={`text-xl font-bold mb-4 ${COLORS.textDark} flex items-center`}>
                            <Shield className="w-5 h-5 mr-2 text-[#FFD700]" />
                            Requisitos de la Nueva Contraseña
                        </h3>
                        <ul className="space-y-3">
                            <PasswordRequirementItem isValid={validation.minLength}>
                                Mínimo 8 caracteres
                            </PasswordRequirementItem>
                            <PasswordRequirementItem isValid={validation.hasUpperCase}>
                                Al menos una letra mayúscula (A-Z)
                            </PasswordRequirementItem>
                            <PasswordRequirementItem isValid={validation.hasNumber}>
                                Al menos un número (0-9)
                            </PasswordRequirementItem>
                            <PasswordRequirementItem isValid={validation.hasSpecialChar}>
                                Al menos un carácter especial (!, @, #, $, etc.)
                            </PasswordRequirementItem>
                        </ul>
                    </div>

                    {/* Recomendaciones de Seguridad */}
                    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
                        <h3 className={`text-lg font-bold mb-4 ${COLORS.textDark} flex items-center`}>
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                            Recomendaciones de Seguridad
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                No uses la misma contraseña en múltiples sitios.
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Evita usar información personal fácil de adivinar (nombre, fecha de nacimiento).
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Cambia tu contraseña si sospechas de actividad inusual.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionContrasenas;