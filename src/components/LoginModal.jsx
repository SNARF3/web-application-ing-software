import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, X, Mail, Shield, CheckCircle } from 'lucide-react';

const COLORS = {
  primary: 'bg-[#003366]',
  accent: 'bg-[#FFD700]',
  textLight: 'text-white',
  textDark: 'text-[#003366]',
  hoverPrimary: 'hover:bg-[#004488]',
  hoverAccent: 'hover:bg-[#E0B800]',
};

const LoginModal = ({ isOpen, closeModal, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para la verificación
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  
  // Estado para pantalla de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/login/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contrasenia: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Mostrar pantalla de verificación
        setShowVerification(true);
        console.log('✅ Código enviado al correo:', data.message);
      } else {
        setError(data.message || 'Error al iniciar sesión');
        // Registrar intento fallido de inicio de sesión (registro individual)
        try {
          // Contador de intentos por correo (localStorage para persistir entre recargas)
          const key = `failed_login_${(email || '').toLowerCase()}`;
          let count = parseInt(localStorage.getItem(key) || '0', 10) || 0;
          count += 1;
          localStorage.setItem(key, String(count));

          // Enviar log de intento fallido
          // El backend requiere id_usuario; si no hay usuario autenticado usamos 0
          const userStr_local = sessionStorage.getItem('user');
          let userObj_local = null;
          try { userObj_local = userStr_local ? JSON.parse(userStr_local) : null; } catch (e) { userObj_local = null; }
          const payload = {
            tipo_log: 3,
            // Usar null cuando no hay usuario autenticado para evitar claves foráneas inválidas en BD
            id_usuario: userObj_local ? (userObj_local.id || userObj_local.id_usuario || userObj_local.ID || null) : null,
            correo_intento: email,
            intentos: count,
            fechahora: new Date().toISOString(),
          };
          console.debug('Enviando log (intento fallido):', payload);
          const res = await fetch('http://localhost:3000/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            try {
              const body = await res.json();
              console.error('Log API responded with', res.status, body);
            } catch (e) {
              const text = await res.text().catch(() => '');
              console.error('Log API responded with', res.status, text);
            }
          }

          // Si se alcanzan 3 intentos fallidos seguidos, registrar intento de acceso no autorizado (tipo 4)
          if (count >= 3) {
            try {
              const payload2 = {
                tipo_log: 4,
                id_usuario: userObj_local ? (userObj_local.id || userObj_local.id_usuario || userObj_local.ID || null) : null,
                correo_intento: email,
                detalle: '3_intentos_fallidos',
                fechahora: new Date().toISOString(),
              };
              console.debug('Enviando log (acceso no autorizado - 3 intentos):', payload2);
              const res2 = await fetch('http://localhost:3000/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload2),
              });
              if (!res2.ok) {
                try {
                  const body2 = await res2.json();
                  console.error('Log API responded with', res2.status, body2);
                } catch (e2) {
                  const text2 = await res2.text().catch(() => '');
                  console.error('Log API responded with', res2.status, text2);
                }
              }
            } catch (err2) {
              console.error('Error al registrar log de acceso no autorizado tras 3 intentos:', err2);
            }
            // Resetear contador para evitar múltiples logs tipo 4 por el mismo bloqueo
            localStorage.removeItem(key);
          }
        } catch (logError) {
          console.error('Error al registrar log de inicio fallido:', logError);
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setVerificationLoading(true);
    setVerificationError('');

    try {
      const response = await fetch('http://localhost:3000/api/login/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          codigo: verificationCode
        })
      });

      const data = await response.json();

      console.log('🔍 RESPUESTA COMPLETA DEL BACKEND:', data);
      console.log('🔍 DATOS DEL USUARIO:', data.usuario);
      
      if (data.usuario) {
        console.log('🔍 PROPIEDADES DEL USUARIO:', Object.keys(data.usuario));
        console.log('🔍 VALOR DE rol:', data.usuario.rol);
      }

      if (data.success) {
        // Guardar token y datos del usuario en sessionStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.usuario));
        
        console.log('💾 Token guardado');
        console.log('💾 Usuario guardado:', data.usuario);
        
  // Mostrar pantalla de éxito
        setShowSuccess(true);
        
        // Esperar 2 segundos y luego redirigir según el rol
        setTimeout(async () => {
          closeModal();
          
          console.log('🎯 INICIANDO REDIRECCIÓN...');
          console.log('🎯 Datos del usuario:', data.usuario);
          console.log('🎯 rol value:', data.usuario.rol);
          
          // REDIRECCIÓN SEGÚN ROL - USANDO EL CAMPO "rol" (STRING)
          let redirectPath = '/UCB-Explorer-Manager'; // Ruta por defecto
          
          // Verificar usando rol (string)
          if (data.usuario.rol === 'Administrador' || data.usuario.rol === 'Admin') {
            console.log('🚀 REDIRIGIENDO A ADMIN - rol = Administrador');
            redirectPath = '/admin';
          } else if (data.usuario.rol === 'Docente' || data.usuario.rol === 'Colaborador' || data.usuario.rol === 'Profesor') {
            console.log('🚀 REDIRIGIENDO A COLABORADOR - rol =', data.usuario.rol);
            redirectPath = '/colaborador';
          } else {
            console.log('⚠️ Rol no reconocido:', data.usuario.rol);
          }
          
          console.log('📍 Ruta final de redirección:', redirectPath);
          
          // Registrar log de inicio de sesión exitoso (registro individual con datos de usuario)
          try {
            const userStr = sessionStorage.getItem('user');
            let userObj = null;
            try { userObj = userStr ? JSON.parse(userStr) : null; } catch (e) { userObj = null; }
            const token = sessionStorage.getItem('token');
            const payload = { tipo_log: 1, fechahora: new Date().toISOString() };
            // Asegurar id_usuario (requerido por backend)
            payload.id_usuario = userObj ? (userObj.id || userObj.id_usuario || userObj.ID || null) : null;
            if (userObj) {
              payload.nombre_usuario = userObj.nombre || userObj.nombre_usuario || userObj.correo || '';
              payload.apellido_usuario = userObj.apellido || userObj.apellido_usuario || '';
              payload.nombre_rol = userObj.rol || userObj.nombre_rol || '';
            }
            console.debug('Enviando log (login exitoso):', payload);
            const resLog = await fetch('http://localhost:3000/logs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(payload),
            });
            if (!resLog.ok) {
              try {
                const bodyLog = await resLog.json();
                console.error('Log API responded with', resLog.status, bodyLog);
              } catch (e) {
                const txt = await resLog.text().catch(() => '');
                console.error('Log API responded with', resLog.status, txt);
              }
            }
            // Al inicio exitoso, limpiar contador de intentos fallidos para este correo
            try {
              const failKey = `failed_login_${(email || '').toLowerCase()}`;
              localStorage.removeItem(failKey);
            } catch (_) { /* ignore */ }
          } catch (logError) {
            console.error('Error al registrar log de inicio exitoso:', logError);
          }

          // Redirigir
          navigate(redirectPath);
          
          if (onLoginSuccess) {
            onLoginSuccess(data.usuario);
          }
          
          // Resetear estados para próxima vez
          setShowSuccess(false);
          setShowVerification(false);
          setVerificationCode('');
          setEmail('');
          setPassword('');
        }, 2000);
        
        console.log('✅ Login exitoso:', data.message);
      } else {
        setVerificationError(data.message || 'Código inválido');
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      setVerificationError('Error de conexión con el servidor');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setVerificationCode('');
    setVerificationError('');
  };

  const handleResendCode = async () => {
    setVerificationLoading(true);
    setVerificationError('');

    try {
      const response = await fetch('http://localhost:3000/api/login/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contrasenia: password
        })
      });

      const data = await response.json();

      if (data.success) {
        setVerificationError('');
        console.log('✅ Código reenviado');
      } else {
        setVerificationError('Error al reenviar código');
      }
    } catch (error) {
      console.error('Error al reenviar:', error);
      setVerificationError('Error de conexión');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Función para renderizar el contenido según el estado
  const renderContent = () => {
    // PANTALLA DE ÉXITO
    if (showSuccess) {
      return (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Inicio de Sesión Exitoso!
          </h4>
          <p className="text-gray-600 text-lg">
            Bienvenido a UCB Explorer
          </p>
          <div className="pt-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Redirigiendo...
            </div>
          </div>
        </div>
      );
    }

    // PANTALLA DE VERIFICACIÓN
    if (showVerification) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#003366]" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              Verificación de Seguridad
            </h4>
            <p className="text-gray-600">
              Hemos enviado un código de 6 dígitos a:
            </p>
            <p className="font-semibold text-[#003366] mt-1">{email}</p>
            <p className="text-sm text-gray-500 mt-2">
              El código expirará en 10 minutos
            </p>
          </div>

          {verificationError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {verificationError}
            </div>
          )}

          <form onSubmit={handleVerificationSubmit}>
            <div className="mb-4">
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <input 
                type="text" 
                id="verification-code" 
                placeholder="123456" 
                maxLength={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm text-center text-xl font-mono tracking-widest" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={verificationLoading || verificationCode.length !== 6}
              className={`${COLORS.accent} ${COLORS.hoverAccent} w-full ${COLORS.textDark} font-black py-3 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-[#003366] disabled:opacity-50 disabled:cursor-not-allowed mb-3`}
            >
              {verificationLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#003366] mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Verificar Código'
              )}
            </button>

            <div className="flex justify-between text-sm">
              <button 
                type="button"
                onClick={handleBackToLogin}
                className="text-[#003366] hover:text-[#FFD700] font-medium transition duration-150"
              >
                ← Volver
              </button>
              
              <button 
                type="button"
                onClick={handleResendCode}
                disabled={verificationLoading}
                className="text-[#003366] hover:text-[#FFD700] font-medium transition duration-150 disabled:opacity-50"
              >
                Reenviar código
              </button>
            </div>
          </form>
        </div>
      );
    }

    // PANTALLA DE LOGIN ORIGINAL
    return (
      <>
        <p className="text-gray-600 mb-6 text-center font-semibold">
          Inicia sesión con tus credenciales UCB.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Institucional
            </label>
            <input 
              type="email" 
              id="modal-email" 
              placeholder="ejemplo@ucb.edu.bo" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-6">
            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="modal-password" 
                placeholder="••••••••" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm pr-10" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#003366] transition duration-150" 
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`${COLORS.accent} ${COLORS.hoverAccent} w-full ${COLORS.textDark} font-black py-3 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-[#003366] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#003366] mr-2"></div>
                Enviando código...
              </div>
            ) : (
              '¡A Acceder!'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="#" className={`text-[#003366] hover:text-[#FFD700] font-medium transition duration-150 underline`}>
            ¿Problemas para iniciar sesión?
          </a>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-[100] flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-3xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 opacity-100 border-t-8 border-[#FFD700]">
        <div className={`${COLORS.primary} p-6 rounded-t-xl flex justify-between items-center`}>
          <h3 className="text-2xl font-bold text-white flex items-center">
            {showSuccess ? (
              <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
            ) : showVerification ? (
              <Shield className="w-6 h-6 mr-3 text-[#FFD700] animate-pulse" />
            ) : (
              <LogIn className="w-6 h-6 mr-3 text-[#FFD700] animate-pulse" />
            )}
            {showSuccess ? 'Éxito' : showVerification ? 'Verificación' : 'Acceso UCB Explorer'}
          </h3>
          {!showSuccess && (
            <button 
              onClick={closeModal} 
              className="text-white hover:text-[#FFD700] transition duration-200 p-1 rounded-full hover:bg-[#004488]"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;