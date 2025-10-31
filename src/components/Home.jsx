import React, { useState, useEffect } from 'react';
import UCBHome from './UCBHome';
import { 
  BarChart3, CalendarDays, MessageSquare, Laptop, LogIn, Menu, X, Globe, MapPin, 
  Mail, Phone, Clock, Facebook, Instagram, Twitter, Send, Zap, Loader2, Target, 
  Star, TrendingUp, Eye, EyeOff, Clipboard, ShieldCheck, Lightbulb, Check, AlertCircle,
  UserPlus,
} from 'lucide-react';

// Colores institucionales y tema oscuro para el dinamismo
const COLORS = {
  primary: 'bg-[#003366]', // Azul UCB Oscuro (Navy)
  accent: 'bg-[#FFD700]', // Amarillo UCB/Dorado
  textLight: 'text-white',
  textDark: 'text-[#003366]',
  hoverPrimary: 'hover:bg-[#004488]',
  hoverAccent: 'hover:bg-[#E0B800]',
};

// --- Estilos CSS Personalizados para Animaciones ---
const CustomStyles = () => (
    <style>
        {`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes pulse-slow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s infinite ease-in-out;
        }
        
        /* Efecto de acercamiento en hover */
        .card-dynamic-hover:hover {
            transform: translateY(-8px) scale(1.03); 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        }

        /* Animación para los pasos generados */
        .step-panel {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.7s ease-out forwards;
        }
        .step-panel:nth-child(1) { animation-delay: 0.1s; }
        .step-panel:nth-child(2) { animation-delay: 0.3s; }
        .step-panel:nth-child(3) { animation-delay: 0.5s; }
        .step-panel:nth-child(4) { animation-delay: 0.7s; } /* Para el cuarto elemento (Justificación) */
        `}
    </style>
);

// --- Componentes Reutilizables ---

// Tarjeta de Propuesta de Valor
const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl card-dynamic-hover transition duration-500 border-t-4 border-[#FFD700] group">
    <div className={`${COLORS.primary.replace('bg-', 'bg-')} p-4 rounded-full inline-flex mb-4 transition duration-300 group-hover:bg-[#FFD700] group-hover:shadow-2xl`}>
      <Icon className={`w-8 h-8 ${COLORS.textLight.replace('text-', 'text-')} transition duration-300 group-hover:text-[#003366] group-hover:animate-bounce-custom`} />
    </div>
    <h3 className={`text-xl font-bold mb-3 ${COLORS.textDark.replace('text-', 'text-')} group-hover:text-black transition duration-200`}>{title}</h3>
    <p className="text-gray-600 group-hover:text-gray-800 transition duration-200">{description}</p>
  </div>
);

// Barra de Navegación Fija (Header) - CORREGIDO
const Header = ({ openLoginModal, openRegisterModal, currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', page: 'Inicio' },
    { name: 'Misión', page: 'Misión' },
    { name: 'Visión', page: 'Visión' },
  ];

  return (
    <header className={`${COLORS.primary} shadow-2xl fixed w-full z-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        {/* Logo y Título - logo reducido a la mitad (no gira) */}
        <div className="flex items-center space-x-3 cursor-pointer transform hover:scale-105 transition duration-300" onClick={() => setCurrentPage('Inicio')}>
          <img src="/photos/UCBLogo.png" alt="UCB Logo" className="w-24 h-24 rounded-sm object-contain" />
          <span className={`text-2xl font-extrabold ${COLORS.textLight.replace('text-', 'text-')}`}>
            UCB <span className={COLORS.accent.replace('bg-', 'text-')}>Explorer Manager</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center space-x-4 mr-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`transition duration-300 font-medium text-lg tracking-wider transform hover:scale-105 ${
                  currentPage === item.page 
                    ? 'text-[#FFD700] border-b-4 border-[#FFD700] pb-1' 
                    : `${COLORS.textLight} hover:text-[#FFD700]`
                } py-1 cursor-pointer`}
                onClick={() => setCurrentPage(item.page)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 border-l pl-8 border-gray-600">
            {/* Botón Home */}
            <button
              onClick={() => {
                window.location.href = '/';
                setCurrentPage('Inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gray-200 text-[#003366] font-semibold py-2 px-4 rounded-full shadow-md transition duration-200 transform hover:scale-105"
            >
              Home
            </button>

            {/* Registrarte (estilo secundario) */}
            <button
              onClick={openRegisterModal}
              className={`text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 border-2 border-white bg-white/0 hover:bg-white/10`}
            >
              Registrarte
            </button>

            {/* Acceder (estilo primario) */}
            <button
              className={`${COLORS.accent} ${COLORS.hoverAccent} ${COLORS.textDark} font-bold py-2.5 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center space-x-2 border-2 border-transparent hover:border-[#003366]`}
              onClick={openLoginModal} 
            >
              <LogIn className="w-5 h-5" />
              <span>Acceder</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className={`${COLORS.textLight.replace('text-', 'text-')} w-6 h-6`} /> : <Menu className={`${COLORS.textLight.replace('text-', 'text-')} w-6 h-6`} />}
        </button>
      </div>
 
      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${COLORS.primary} pb-4`}>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`block px-4 py-3 hover:bg-[#004488] transition duration-200 w-full text-left text-lg ${
                currentPage === item.page 
                  ? 'text-[#FFD700] font-bold border-l-4 border-[#FFD700]' 
                  : `${COLORS.textLight}`
              }`}
              onClick={() => { setCurrentPage(item.page); setIsOpen(false); }} 
            >
              {item.name}
            </button>
          ))}

          <div className="px-4 pt-2 space-y-2">
            <button
              className={`w-full text-center text-white font-bold py-3 rounded-lg transition duration-300`}
              onClick={() => { openRegisterModal(); setIsOpen(false); }}
            >
              Registrarte
            </button>
            <button
              className={`${COLORS.accent} w-full ${COLORS.hoverAccent} ${COLORS.textDark} font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2`}
              onClick={() => { openLoginModal(); setIsOpen(false); }} 
            >
              <LogIn className="w-5 h-5" />
              <span>Acceder</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Contador Animado Simple
const AnimatedCounter = ({ endValue, label }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Simulación de animación de contador en el frontend
  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(endValue / 100); 
    const interval = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        current = endValue;
        clearInterval(interval);
      }
      setDisplayValue(current);
    }, 15); 

    return () => clearInterval(interval);
  }, [endValue]);

  return (
    <div className="flex flex-col items-center p-3 transform transition duration-300 hover:scale-110">
      <span className="text-6xl font-black text-[#FFD700] leading-none drop-shadow-lg">{displayValue.toLocaleString()}+</span>
      <span className="text-xl font-medium text-gray-200 mt-2 tracking-wide border-b border-[#FFD700]/50">{label}</span>
    </div>
  );
};

// Tarjeta de Novedad
const NewsCard = ({ title, date, excerpt }) => (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer flex space-x-3 transform hover:scale-[1.02]">
        <div className="w-12 h-12 flex-shrink-0 bg-[#003366] rounded-lg flex items-center justify-center border-2 border-[#FFD700]">
            <Star className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="flex-grow">
            <h4 className="text-base font-bold text-[#003366] line-clamp-2">{title}</h4>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{excerpt}</p>
            <span className="text-xs text-gray-400 mt-1 block italic">{date}</span>
        </div>
    </div>
);

// Modal de Acceso Estilizada
const LoginModal = ({ isOpen, closeModal }) => {
    // ESTADO para el toggle de contraseña
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-[100] flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-3xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 opacity-100 border-t-8 border-[#FFD700]">
                
                <div className={`${COLORS.primary} p-6 rounded-t-xl flex justify-between items-center`}>
                    <h3 className="text-2xl font-bold text-white flex items-center">
                        <LogIn className="w-6 h-6 mr-3 text-[#FFD700] animate-pulse" />
                        Acceso UCB Explorer
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-white hover:text-[#FFD700] transition duration-200 p-1 rounded-full hover:bg-[#004488]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-8">
                    <p className="text-gray-600 mb-6 text-center font-semibold">
                        Inicia sesión con tus credenciales UCB.
                    </p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); console.log('Login Attempt via Modal'); closeModal(); }}>
                        <div className="mb-4">
                            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Institucional
                            </label>
                            <input
                                type="email"
                                id="modal-email"
                                placeholder="ejemplo@ucb.edu.bo"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            
                            {/* Contenedor para el campo de contraseña con toggle */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} // Toggles type based on state
                                    id="modal-password"
                                    placeholder="••••••••"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm pr-10"
                                    required
                                />
                                <button
                                    type="button" // Previene el envío del formulario
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
                            className={`${COLORS.accent} ${COLORS.hoverAccent} w-full ${COLORS.textDark} font-black py-3 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-[#003366]`}
                            onClick={() => { console.log('Login Attempt'); closeModal(); }}
                        >
                            ¡A Acceder!
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm">
                        <a href="#" className={`text-[#003366] hover:text-[#FFD700] font-medium transition duration-150 underline`} onClick={() => console.log('Forgot Password')}>
                            ¿Problemas para iniciar sesión?
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Modal de Registro (nuevo)
const RegisterModal = ({ isOpen, closeModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-[100] flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-3xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 opacity-100 border-t-8 border-[#FFD700]">
        <div className={`${COLORS.primary} p-6 rounded-t-xl`}>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-3 text-[#FFD700]" />
            Registro UCB Explorer
          </h3>
        </div>
        <div className="p-8">
          <form onSubmit={(e) => { e.preventDefault(); console.log('Register:', { name, email }); closeModal(); }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input className="w-full p-3 border border-gray-300 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
              <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className={`${COLORS.accent} ${COLORS.hoverAccent} w-full ${COLORS.textDark} font-black py-3 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-[#003366]`}>
              Crear cuenta
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button className="text-[#003366] underline" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal "Ver todas las noticias" (nuevo)
const AllNewsModal = ({ isOpen, closeModal, news }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#003366]">Centro de Anuncios — Todas las Noticias</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-[#003366]"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-4">
          {news.map((n, i) => (
            <NewsCard key={i} {...n} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Componente: Misión (Vibrante y con Imagen de Fondo) ---
const MissionSection = () => (
    <section className="relative min-h-screen flex items-center bg-gray-900 py-20 overflow-hidden">
        {/* Background Image con Opacidad para Contraste */}
        <div 
            className="absolute inset-0 bg-cover bg-fixed bg-center transition-transform duration-700 hover:scale-[1.03]"
            style={{ 
                backgroundImage: "url('https://placehold.co/1920x1080/002244/ffffff?text=UCB+Investigación')",
                filter: 'brightness(0.7)',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-md p-8 md:p-16 rounded-3xl shadow-2xl border-b-8 border-[#FFD700] transition duration-500 hover:shadow-3xl transform hover:scale-[1.01]">
                <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
                    
                    <div className="flex-shrink-0 mb-8 lg:mb-0 lg:w-1/4 text-center">
                        <Globe className="w-28 h-28 mx-auto text-[#003366] animate-pulse-slow drop-shadow-lg" /> 
                        <h2 className="text-5xl font-extrabold mt-4 text-[#003366] drop-shadow-md">Nuestra <span className="text-[#FFD700]">Misión</span></h2>
                        <p className="text-gray-500 mt-2 italic font-semibold">El motor de la verdad.</p>
                    </div>

                    <div className="lg:w-3/4">
                        <blockquote className="text-3xl italic font-serif text-gray-800 leading-snug border-l-8 border-[#003366] pl-6 py-4 transition-all duration-300 hover:border-[#FFD700] hover:text-black">
                            "La constante **búsqueda de la verdad** mediante la investigación, la conservación y la comunicación del saber para el bien de la sociedad. La Universidad Católica participa en esta misión aportando sus características específicas y su finalidad (EcE,1990, núm. 30; Ests. 2021, Art. 10)."
                        </blockquote>
                        <p className="mt-8 text-2xl text-gray-700 font-bold tracking-wide">
                          <span className="text-[#FFD700] mr-3 text-3xl transition duration-500 hover:scale-125 inline-block">★</span> **Impacto Clave:** Generar conocimiento para el bienestar social.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Componente: Visión (Enfocado en el Futuro y con Mucha Energía) ---
const VisionSection = () => (
    <section className="relative min-h-screen flex items-center bg-[#003366] py-20 overflow-hidden">
        {/* Fondo con Patrón o Textura de Red Futurista */}
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
                backgroundImage: "url('https://placehold.co/1920x1080/003366/FFD700/texture.png?text=FUTURO+UCB+DINÁMICO')", 
                opacity: 0.25 
            }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fadeIn">
            <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl border-l-8 border-[#FFD700] transform transition duration-500 hover:shadow-3xl hover:scale-[1.01]">
                <div className="flex flex-col lg:flex-row items-center lg:space-x-12 text-[#003366]">
                    
                    <div className="lg:w-3/4 order-2 lg:order-1">
                        <h2 className="text-5xl font-extrabold mb-6 text-[#003366]">Visión: <span className="text-[#FFD700]">Forjando Agentes de Cambio</span></h2>
                        <p className="text-2xl leading-relaxed text-gray-800 mb-8 font-light italic">
                            Ser universidad católica en salida, que desde su identidad **investiga éticamente**, forma integralmente profesionales de calidad y brinda educación para la vida, interactuando socialmente en internacionalización, con responsabilidad social ambiental, aportando **agentes de cambio humanistas** para el desarrollo sostenible de la humanidad (U.C.B., Modelo Institucional, 2022).
                        </p>
                        <div className="flex flex-wrap gap-4">
                           <span className="bg-[#FFD700] text-[#003366] font-extrabold px-6 py-3 rounded-full shadow-lg transition duration-300 hover:scale-110 transform cursor-pointer flex items-center border border-[#003366]"><Target className="w-5 h-5 mr-3"/> Agentes de Cambio</span>
                           <span className="bg-[#003366] text-white font-extrabold px-6 py-3 rounded-full shadow-lg transition duration-300 hover:scale-110 transform cursor-pointer flex items-center"><Zap className="w-5 h-5 mr-3 text-[#FFD700]"/> Desarrollo Sostenible Global</span>
                           <span className="bg-gray-200 text-[#003366] font-extrabold px-6 py-3 rounded-full shadow-lg transition duration-300 hover:scale-110 transform cursor-pointer flex items-center"><Globe className="w-5 h-5 mr-3"/> Internacionalización Activa</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mb-8 lg:mb-0 lg:w-1/4 text-center order-1 lg:order-2">
                        <Target className="w-28 h-28 mx-auto text-[#FFD700] animate-bounce drop-shadow-xl" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ====================================================================
// --- Componente: Generador de Estrategias con IA (Estético y Estructurado) ---
// ====================================================================
const AIStrategyGenerator = () => {
  const [goal, setGoal] = useState('');
  const [strategyResult, setStrategyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Helper para copiar al portapapeles
  const handleCopy = () => {
    if (!strategyResult) return;
    
    // Construir el texto a copiar
    const justificationText = strategyResult.justification 
        ? `Justificación Clave:\n${strategyResult.justification.replace(/justificaci[óo]n:/i, '').trim()}\n\n`
        : '';
    
    const stepsText = strategyResult.steps.map((step, index) => 
        `PASO ${index + 1}:\n${step}`
    ).join('\n\n');

    const fullText = `${justificationText}Plan de Acción de 3 Pasos:\n\n${stepsText}`;

    // Usar document.execCommand('copy') como fallback seguro en iframes
    const el = document.createElement('textarea');
    el.value = fullText;
    document.body.appendChild(el);
    el.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } else {
            console.error('Copy command failed');
        }
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }
    document.body.removeChild(el);
  };


  // Función para parsear el resultado en pasos individuales
  const parseStrategy = (text) => {
    // La IA está instruida para usar '---PASO---' como marcador de separación
    const parts = text.split('---PASO---').map(p => p.trim()).filter(p => p.length > 0);
    
    // El primer elemento es la justificación (si existe)
    let justification = parts.length > 0 && parts[0].toLowerCase().includes('justificación:') ? parts.shift() : '';

    // Los siguientes son los pasos
    const steps = parts.map((step, index) => {
        // Limpiamos los números de inicio si el modelo los puso (e.g., "1. Paso")
        return step.replace(/^\d+\.\s*/, '').trim();
    });

    // Si la justificación no se encontró como primer elemento, lo buscamos en el texto original
    if (!justification) {
        const match = text.match(/(justificación|primer paso):/i);
        if (match) {
            justification = text.substring(match.index).split('---PASO---')[0].trim();
        }
    }
    
    // Manejo de caso en que el modelo se vuelve loco (asegura 3 pasos)
    while (steps.length > 3) {
        steps.pop();
    }
    
    return { justification, steps };
  };

  // Lógica de la API (Instrucción modificada para estructurar la respuesta)
  const generateStrategy = async (goal) => {
    // lee la clave desde env en build si está disponible
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
    const model = 'gemini-2.5-flash-preview-09-2025';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Si no hay API key configurada, devolvemos un mock para evitar 403 en cliente
    if (!apiKey) {
      // fallback mock (rápido) para probar UI sin key
      await new Promise(r => setTimeout(r, 500)); // simula latencia
      const mockText = [
        'Justificación: Una acción inicial centrada en segmentar colegios permite optimizar recursos y diseñar experiencias personalizadas.',
        '---PASO--- Identificar y priorizar colegios objetivos por perfil (bilingües, tamaño, ubicación).',
        '---PASO--- Diseñar jornadas experienciales y materiales diferenciales para cada segmento y activar campañas directas.',
        '---PASO--- Medir conversiones y retroalimentación para iterar la oferta en ciclos mensuales.'
      ].join(' ');
      return { text: mockText, sources: [] };
    }

    // Payload y lógica original (con manejo de errores más robusto)
    const systemPrompt = `Actúa como un estratega de marketing educativo y atracción de talento de nivel mundial. Basado en el objetivo de atracción proporcionado por el usuario, genera una estrategia concisa y práctica de TRES (3) pasos. El formato de salida DEBE ser: una justificación de por qué es el mejor primer paso, seguida del marcador '---PASO---', y luego los tres pasos separados por el mismo marcador '---PASO---'. Ejemplo: Justificación: [texto]. ---PASO--- Primer Paso. ---PASO--- Segundo Paso. ---PASO--- Tercer Paso. Asegúrate de que los pasos estén enfocados en el contexto de una universidad boliviana (UCB) que gestiona visitas de colegios. El idioma de respuesta debe ser español.`;
    const userQuery = `Estrategia de atracción de estudiantes para una universidad boliviana con el objetivo: "${goal}".`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    let response = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const text = candidate.content.parts[0].text;
                    let sources = [];
                    const groundingMetadata = candidate.groundingMetadata;
                    if (groundingMetadata && groundingMetadata.groundingAttributions) {
                        sources = groundingMetadata.groundingAttributions
                            .map(attribution => ({
                                uri: attribution.web?.uri,
                                title: attribution.web?.title,
                            }))
                            .filter(source => source.uri && source.title);
                    }
                    return { text, sources };
                }
            } else if (response.status === 429) {
                attempts++;
                const delay = Math.pow(2, attempts) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; 
            } else {
                // error no 429 -> lanzar con mensaje claro
                const body = await response.text().catch(() => '');
                throw new Error(`API Error ${response.status}: ${body}`); 
            }

            throw new Error(`API returned status ${response.status}`);
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                throw new Error("Error al contactar a la IA. Verifica tu API key o comprueba la red.");
            }
            const delay = Math.pow(2, attempts) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Error desconocido al generar la estrategia.");
  };


  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("Por favor, introduce un objetivo válido.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setStrategyResult(null);

    try {
      const result = await generateStrategy(goal);
      const parsed = parseStrategy(result.text);
      setStrategyResult({ ...parsed, sources: result.sources, raw: result.text });
    } catch (e) {
      setError(e.message || "Ocurrió un error inesperado al generar la estrategia.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nuevo componente para mostrar un Paso de la Estrategia
  const StrategyStepPanel = ({ step, index, title }) => (
    <div className="step-panel bg-white p-8 rounded-xl shadow-xl border-t-8 border-[#003366] transition duration-500 transform hover:scale-[1.01] hover:shadow-2xl">
        <div className="flex items-center mb-4">
            <span className={`${COLORS.accent.replace('bg-', 'bg-')} text-[#003366] w-10 h-10 flex items-center justify-center rounded-full font-black text-xl mr-4 shadow-lg border-2 border-[#003366]`}>
                {index}
            </span>
            <h5 className="text-2xl font-black text-[#003366]">{title}</h5>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{step}</p>
    </div>
  );
  
  // Componente para la Justificación
  const JustificationPanel = ({ justification }) => (
      <div className="step-panel bg-[#003366]/90 p-8 rounded-xl shadow-2xl border-b-8 border-[#FFD700] text-white mb-8">
          <h4 className="text-2xl font-bold mb-4 flex items-center text-[#FFD700]">
              <ShieldCheck className="w-6 h-6 mr-3" />
              Justificación de la Estrategia
          </h4>
          <p className="leading-relaxed italic text-gray-200 text-lg">
              {justification.replace(/justificaci[óo]n:/i, '').trim() || "La IA no proporcionó una justificación explícita, pero el primer paso es crucial para el objetivo."}
          </p>
      </div>
  );


  return (
    <section className="bg-[#003366] py-20 bg-opacity-95" id="ai-strategy" style={{ 
        backgroundImage: "url('https://placehold.co/1920x1080/003366/004488/texture.png?text=DATA+GRID')",
        backgroundBlendMode: 'multiply'
    }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título y Descripción mejorados */}
        <div className="text-center mb-12">
          <Zap className={`w-12 h-12 mx-auto text-[#FFD700] mb-3 animate-pulse`} />
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg`}>
            Asistente Estratégico <span className="text-[#FFD700]">IA</span> Avanzado
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-light">
            Define un objetivo y recibe un plan práctico y accionable en 3 pasos. Ideal para campañas de atracción de colegios.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-3xl border-t-8 border-[#FFD700]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario (col 1-2) */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-[#003366] flex items-center">
                <Target className="w-6 h-6 mr-3 text-[#FFD700]" />
                Define el Objetivo de Atracción
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Ej: Aumentar en 20% la visita de colegios bilingües de la zona sur."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="flex-grow p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-inner"
                  maxLength={150}
                  disabled={isLoading}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !goal.trim()}
                  className={`${COLORS.primary} ${COLORS.hoverPrimary} text-white font-black py-3 px-6 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 border-2 border-[#FFD700]`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2 text-[#FFD700]" />}
                  {isLoading ? 'Analizando...' : 'Generar'}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 shadow-md flex items-center">
                  <AlertCircle className='w-5 h-5 mr-3 flex-shrink-0' />
                  <span className="font-bold">Error:</span> <span className="block sm:inline ml-2">{error}</span>
                </div>
              )}

              {/* Resultado / Placeholder */}
              {isLoading && (
                <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-[#003366]" />
                  <p className="text-gray-600">Generando estrategia — esto puede tardar unos segundos...</p>
                </div>
              )}

              {!isLoading && !strategyResult && !error && (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100 shadow-inner">
                    <Lightbulb className="w-10 h-10 mx-auto text-[#003366] opacity-60 mb-3" />
                    <p className="text-gray-600">Introduce un objetivo para recibir un plan de acción de 3 pasos optimizado para UCB.</p>
                </div>
              )}

              {/* Botón copiar (cuando hay resultado) */}
              {strategyResult && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCopy}
                    className={`bg-gray-100 hover:bg-gray-200 text-[#003366] font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center text-sm shadow-md ${isCopied ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Clipboard className="w-4 h-4 mr-2" />}
                    {isCopied ? '¡Copiado!' : 'Copiar Estrategia'}
                  </button>
                </div>
              )}
            </div>

            {/* Vista Previa / Resultados (col 3) */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold text-[#003366] mb-3">Vista Previa</h4>

              {strategyResult ? (
                <div className="space-y-4">
                  <div className="bg-[#003366]/95 p-4 rounded-lg text-white">
                    <h5 className="font-bold text-[#FFD700] mb-2">Justificación</h5>
                    <p className="text-sm leading-relaxed">{strategyResult.justification ? strategyResult.justification.replace(/justificaci[óo]n:/i, '').trim() : 'No hay justificación proporcionada.'}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-100">
                    <h5 className="font-bold text-[#003366] mb-2">Pasos (resumen)</h5>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      {strategyResult.steps.map((s, i) => (
                        <li key={i} className="text-sm">{s.length > 120 ? s.slice(0, 120) + '...' : s}</li>
                      ))}
                    </ol>
                  </div>

                  {strategyResult.sources && strategyResult.sources.length > 0 && (
                    <div className="bg-gray-50 p-2 rounded-md text-xs text-gray-600 border border-gray-100">
                      <strong className="block text-[#003366] mb-2">Fuentes</strong>
                      <ul className="space-y-1">
                        {strategyResult.sources.map((src, idx) => (
                          <li key={idx}><a href={src.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm">{src.title || src.uri}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center text-sm text-gray-500">
                  Aquí aparecerá la justificación y los pasos generados.
                </div>
              )}
            </div>
          </div>

          {/* Resultados detallados (cuando existen) */}
          {strategyResult && strategyResult.steps.length > 0 && (
            <div className="mt-8">
              <div className='flex justify-between items-center mb-6'>
                <h3 className="text-3xl font-black text-[#003366] flex items-center">
                    <TrendingUp className="w-7 h-7 mr-3 text-[#FFD700]"/>
                    Plan de Acción Generado
                </h3>
              </div>

              <JustificationPanel justification={strategyResult.justification} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <StrategyStepPanel step={strategyResult.steps[0]} index={1} title="Análisis y Segmentación" />
                <StrategyStepPanel step={strategyResult.steps[1]} index={2} title="Activación y Experiencia" />
                <StrategyStepPanel step={strategyResult.steps[2]} index={3} title="Medición y Seguimiento" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// --- Componente Principal Exportado (Home) CORREGIDO ---
const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAllNewsModal, setShowAllNewsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState('Inicio');
 
     const openLoginModal = () => setShowLoginModal(true);
     const closeLoginModal = () => setShowLoginModal(false);
 
     const openRegisterModal = () => setShowRegisterModal(true);
     const closeRegisterModal = () => setShowRegisterModal(false);
 
     const openAllNewsModal = () => setShowAllNewsModal(true);
     const closeAllNewsModal = () => setShowAllNewsModal(false);
 
    const valuePropositions = [
        { icon: CalendarDays, title: 'Gestión Centralizada', description: 'Registra, administra y centraliza la información de colegios y visitas en una única plataforma web eficiente.' },
        { icon: BarChart3, title: 'Análisis de Impacto', description: 'Genera reportes y dashboards para optimizar la planificación y mejorar la toma de decisiones basada en datos.' },
        { icon: MessageSquare, title: 'Feedback Estudiantil', description: 'Captura y analiza la retroalimentación obtenida de los estudiantes visitantes para mejorar su experiencia en los recorridos.' },
        { icon: Laptop, title: 'Interfaz Intuitiva', description: 'Diseñada con una experiencia de usuario (UX) fluida y accesible para todos los perfiles, facilitando su adopción.' },
    ];

    const newsItems = [
        { title: 'Nueva funcionalidad: Módulo de Encuestas 2.0', date: '15 Octubre, 2025', excerpt: 'Mejoras significativas en la recolección de feedback post-visita.' },
        { title: 'Actualización de seguridad programada para la próxima semana', date: '10 Octubre, 2025', excerpt: 'Revisa las notas de la versión para los detalles.' },
        { title: 'Cierre de la gestión 2024 y reportes anuales disponibles', date: '01 Octubre, 2025', excerpt: 'Accede a los dashboards históricos y comparativas.' },
    ];

    // Noticias extendidas (7 reales y plausibles para UCB)
    const expandedNews = [
      { title: 'Lanzamiento del Módulo de Encuestas 2.0', date: '15 Octubre, 2025', excerpt: 'Mejoras en recolección de feedback y análisis automático por carrera.' },
      { title: 'Convocatoria Central de Becas 2026', date: '10 Octubre, 2025', excerpt: 'Nuevos criterios de elegibilidad y prórroga de postulaciones.' },
      { title: 'Feria Vocacional Intercolegial 2025', date: '01 Octubre, 2025', excerpt: 'Más de 60 colegios participantes y stands interactivos por facultad.' },
      { title: 'Actualización de Seguridad IT', date: '20 Septiembre, 2025', excerpt: 'Mantenimiento programado y despliegue de autenticación multifactor.' },
      { title: 'Publicación del Reporte Anual de Investigación', date: '05 Septiembre, 2025', excerpt: 'Resultados y métricas de impacto social de proyectos financiados.' },
      { title: 'Programa de Internacionalización: Convenio con Uni. España', date: '22 Agosto, 2025', excerpt: 'Movilidad de profesores y estudiantes para el próximo semestre.' },
      { title: 'Capacitación Docente en Metodologías Híbridas', date: '10 Agosto, 2025', excerpt: 'Talleres prácticos y certificación interna para docentes UCB.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            
            <CustomStyles /> {/* Añadimos los estilos personalizados */} 
            
            {/* 1. Header: pasar openRegisterModal también */}
            <Header 
                openLoginModal={openLoginModal} 
                openRegisterModal={openRegisterModal}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* Aumenté el padding-top para evitar que el header fijo se sobreponga al contenido */}
            <main className="pt-28"> 

                {/* --- CONTENIDO CONDICIONAL --- */}

                {currentPage === 'Inicio' && (
                    <React.Fragment>
                        {/* 2. CONTENIDO PRINCIPAL: Hero con Video de Fondo Local */}
                        <section className="bg-white">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    
                                    <div className="lg:col-span-8">
                                        <div className="relative min-h-[580px] flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-3xl card-dynamic-hover transition duration-500">
                                            
                                            {/* Contenedor del Video Local */}
                                            <div className="absolute inset-0 w-full h-full z-0">
                                                <div className="relative w-full h-full">
                                                    {/* Video local desde public/videos/ */}
                                                    <video 
                                                        autoPlay 
                                                        muted 
                                                        loop 
                                                        playsInline
                                                        className="absolute top-0 left-0 w-full h-full object-cover scale-105"
                                                    >
                                                        <source src="/videos/UCBCampus.mp4" type="video/mp4" />
                                                        Tu navegador no soporta el elemento de video.
                                                    </video>
                                                    
                                                    {/* Capas de overlay para mejor legibilidad */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 to-[#003366]/60"></div>
                                                    <div className="absolute inset-0 bg-black/30"></div>
                                                </div>
                                            </div>

                                            {/* Contenido sobre el video */}
                                            <div className="p-8 text-center relative z-10 w-full max-w-4xl mx-auto">
                                                <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight text-white drop-shadow-2xl animate-fadeIn">
                                                    UCB <span className='text-[#FFD700]'>EXPLORER</span>
                                                </h1>

                                                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-100 font-light italic bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                                                    Donde los datos de visitas se transforman en <strong>estrategias de crecimiento</strong> efectivo.
                                                </p>

                                                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-12 pt-4 border-t border-gray-300/50 mt-4">
                                                    <AnimatedCounter endValue={380} label="Colegios Activos" />
                                                    <AnimatedCounter endValue={5500} label="Futuros Líderes Impactados" />
                                                </div>
                                                
                                                <button
                                                    className={`mt-10 ${COLORS.accent} ${COLORS.hoverAccent} ${COLORS.textDark} font-black py-3.5 px-10 rounded-full shadow-2xl text-xl transition duration-300 transform hover:scale-[1.05] border-2 border-transparent hover:border-[#003366] hover:shadow-3xl`}
                                                    onClick={() => console.log('Explorar Dashboard')}
                                                >
                                                    Ir al Dashboard
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna Lateral (Novedades) */}
                                    <div className="lg:col-span-4 p-4 lg:p-0">
                                        <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 sticky top-24 shadow-xl">
                                            <h2 className={`text-2xl font-bold mb-5 ${COLORS.textDark.replace('text-', 'text-')} flex items-center border-b pb-3`}>
                                                <Clock className="w-5 h-5 mr-3 text-[#FFD700] animate-spin-slow" />
                                                Lo Más Reciente
                                            </h2>
                                            <div className="space-y-4">
                                                {newsItems.map((item, index) => (
                                                    <NewsCard key={index} {...item} />
                                                ))}
                                                <button onClick={openAllNewsModal} className="w-full text-center text-sm font-bold text-[#003366] hover:text-[#FFD700] transition duration-150 mt-4 underline">
                                                    Ver Centro de Anuncios &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                        {/* 3. SECCIÓN PROPOSICIÓN DE VALOR (FEATURES) */}
                        <section id="features" className="py-20 bg-gray-50">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-4 ${COLORS.textDark.replace('text-', 'text-')}`}>
                                    <span className="text-[#FFD700]">UCB Explorer:</span> Tu Ventaja Competitiva
                                </h2>
                                <p className="text-xl text-gray-500 text-center mb-16 max-w-3xl mx-auto font-light">
                                    Cuatro pilares para una gestión de atracción de talento sin precedentes.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {valuePropositions.map((prop) => (
                                        <ValueCard key={prop.title} {...prop} />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 4. SECCIÓN: Generador de Estrategias con IA */}
                        <AIStrategyGenerator />
                    </React.Fragment>
                )}

                {/* 5. SECCIÓN MISIÓN (Dinámica y con Background) */}
                {currentPage === 'Misión' && <MissionSection />}
                
                {/* 6. SECCIÓN VISIÓN (Enfoque Futurista) */}
                {currentPage === 'Visión' && <VisionSection />}

                {/* 7. FOOTER */}
                <footer className={`${COLORS.primary} text-white pt-12 pb-6`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-8 mb-6">
                            
                            {/* Columna 1: Información de Contacto */}
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-[#FFD700]">Contáctanos</h4>
                                <div className="space-y-3 text-sm text-gray-300">
                                    <div className="flex items-start transition duration-200 hover:text-[#FFD700]">
                                        <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                                        <p>Av. 14 de Septiembre Nº 4807 esq. calle 2 de Obrajes</p>
                                    </div>
                                    <div className="flex items-center transition duration-200 hover:text-[#FFD700]">
                                        <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <p>+ 591 (2) 2782222</p>
                                    </div>
                                    <div className="flex items-center transition duration-200 hover:text-[#FFD700]">
                                        <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <p>informaciones@ucb.edu.bo</p>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 2: Redes Sociales */}
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <p className="text-2xl font-extrabold text-[#FFD700]">#UCBExplorer</p>
                                <div className="flex space-x-6">
                                    <a href="https://www.facebook.com/UCB.BOLIVIA/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="UCB Facebook" className="p-3 rounded-full bg-gray-700 hover:bg-[#FFD700] transition duration-300 transform hover:scale-110 shadow-lg">
                                        <Facebook className="w-6 h-6 text-white hover:text-[#003366]" />
                                    </a>
                                    <a href="https://api.whatsapp.com/send?phone=59175851671&text=%C2%A1Hola!%20tengo%20una%20consulta." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp UCB" className="p-3 rounded-full bg-gray-700 hover:bg-[#25D366] transition duration-300 transform hover:scale-110 shadow-lg">
                                        <Phone className="w-6 h-6 text-white" />
                                    </a>
                                    <a href="https://www.instagram.com/ucb.lapaz/" target="_blank" rel="noopener noreferrer" aria-label="UCB Instagram" className="p-3 rounded-full bg-gray-700 hover:bg-[#FFD700] transition duration-300 transform hover:scale-110 shadow-lg">
                                        <Instagram className="w-6 h-6 text-white hover:text-[#003366]" />
                                    </a>
                                </div>

                                {/* Mini-mapa en recuadro que abre Google Maps al hacer clic */}
                                <div className="mt-4 w-full flex justify-center">
                                  <a href="https://maps.app.goo.gl/99wGAuNZWeH23qi87" target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md max-w-xs w-full">
                                    <div className="relative">
                                      <iframe
                                        title="UCB La Paz - Mini Map"
                                        src="https://www.google.com/maps?q=Universidad%20Catolica%20Boliviana%20San%20Pablo%20Sede%20La%20Paz&output=embed"
                                        className="w-full h-28"
                                        loading="lazy"
                                      ></iframe>
                                      <div className="text-center text-xs text-gray-300 bg-[#003366] py-2">Universidad Católica Boliviana — Abrir en Google Maps</div>
                                    </div>
                                  </a>
                                </div>
                            </div>

                            {/* Columna 3: Suscripción */}
                            <div className="md:text-right">
                                <h4 className="text-xl font-bold mb-4 text-[#FFD700]">Únete a la Vanguardia</h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    Suscríbete para recibir noticias y ultimas novedades.
                                </p>
                                <form onSubmit={(e) => { e.preventDefault(); console.log('Subscription Attempt'); }} className="flex md:justify-end">
                                    <input
                                        type="email"
                                        placeholder="Tu email..."
                                        className="p-3 rounded-l-lg border-none text-gray-800 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-[#FFD700] hover:bg-[#E0B800] text-[#003366] font-bold p-3 rounded-r-lg transition duration-200 flex items-center justify-center transform hover:translate-x-1`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>

                        </div>
                        
                        {/* Copyright Final */}
                        <div className="text-center text-sm text-gray-400 pt-4">
                            <p>© {new Date().getFullYear()} UCB Explorer Manager. Desarrollado por BACK4END</p>
                        </div>
                    </div>
                </footer>

            </main>

            {/* Modal de Login, Registro y Todas las Noticias */}
            <LoginModal 
                isOpen={showLoginModal} 
                closeModal={closeLoginModal} 
            />
            <RegisterModal 
                isOpen={showRegisterModal}
                closeModal={closeRegisterModal}
            />
            <AllNewsModal
                isOpen={showAllNewsModal}
                closeModal={closeAllNewsModal}
                news={expandedNews}
            />
        </div>
    );
};

export default Home;