import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Globe, MapPin, Mail, Phone, Clock, Facebook, Instagram, Send, 
  LogIn, UserPlus, Zap, CheckCircle, TrendingUp, BookOpen, Star, MessageCircle, 
  ShieldCheck, Award, TrendingDown, Layers, Laptop, School, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Home from './Home.jsx';
import LoginModal from './LoginModal';

// Colores institucionales y tema oscuro para el dinamismo
const COLORS = {
  primary: 'bg-[#003366]',
  accent: 'bg-[#FFD700]',
  textLight: 'text-white',
  textDark: 'text-[#003366]',
  hoverPrimary: 'hover:bg-[#004488]',
  hoverAccent: 'hover:bg-[#E0B800]',
};

// Datos de ejemplo para las secciones
const academicServices = [
  {
    icon: BookOpen,
    title: 'Pregrado',
    description: 'Carreras profesionales de alta calidad con enfoque humanista y tecnológico.'
  },
  {
    icon: Award,
    title: 'Postgrado',
    description: 'Maestrías y especializaciones para tu desarrollo profesional continuo.'
  },
  {
    icon: Laptop,
    title: 'Educación Virtual',
    description: 'Modalidades flexibles adaptadas a tus necesidades y horarios.'
  }
];

const competitiveAdvantages = [
  {
    icon: ShieldCheck,
    title: 'Calidad Académica',
    description: 'Acreditación nacional e internacional que garantiza excelencia educativa.',
    delay: 0
  },
  {
    icon: TrendingUp,
    title: 'Alta Empleabilidad',
    description: 'Nuestros graduados tienen una de las tasas más altas de inserción laboral.',
    delay: 0.2
  },
  {
    icon: Globe,
    title: 'Internacionalización',
    description: 'Convenios con universidades de todo el mundo para intercambios estudiantiles.',
    delay: 0.4
  },
  {
    icon: Layers,
    title: 'Infraestructura',
    description: 'Laboratorios y bibliotecas de última generación para tu formación.',
    delay: 0.6
  }
];

const newsItems = [
  {
    title: 'Nuevo Programa de Ingeniería en IA',
    date: '15 Nov 2024',
    excerpt: 'La UCB lanza su nueva carrera en Inteligencia Artificial para el semestre 2025.'
  },
  {
    title: 'Convenio con Universidad de España',
    date: '10 Nov 2024',
    excerpt: 'Firmamos nuevo acuerdo de intercambio estudiantil con prestigiosa universidad europea.'
  },
  {
    title: 'Jornadas de Puertas Abiertas',
    date: '5 Nov 2024',
    excerpt: 'Ven y conoce nuestras instalaciones este sábado 25 de noviembre.'
  }
];

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
            50% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s infinite ease-in-out;
        }
        
        /* Efecto de acercamiento en hover */
        .card-dynamic-hover:hover {
            transform: translateY(-8px) scale(1.03); 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        }
        
        /* Estilo para el botón de llamada */
        .cta-phone {
            transition: all 0.3s ease;
        }
        .cta-phone:hover {
            transform: scale(1.1) rotate(-5deg);
            background-color: #003366;
            color: #FFD700;
        }
        `}
    </style>
);

// --- Componentes Reutilizables ---

// 1. Barra de Navegación Fija (Header)
const Header = ({ scrollToSection, openLoginModal, openRegisterModal, openUcbExplorerManager }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', page: 'hero' },
    { name: 'Acerca de', page: 'about' },
    { name: 'Oferta Académica', page: 'services' },
    { name: 'Novedades', page: 'news' },
    { name: 'Contacto', page: 'footer' },
  ];

  return (
    <header className={`${COLORS.primary} shadow-2xl fixed w-full z-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo y Título */}
        <div 
            className="flex items-center space-x-3 cursor-pointer transform hover:scale-105 transition duration-300" 
            onClick={() => scrollToSection('hero')}
        >
          <img 
            src="/photos/UCBLogo.png" 
            alt="Logo UCB" 
            className="w-24 h-24 object-contain" 
          />
          <span className={`text-2xl font-extrabold ${COLORS.textLight.replace('text-', 'text-')}`}>
            UNIVERSIDAD CATÓLICA <span className={COLORS.accent.replace('bg-', 'text-')}>SAN PABLO</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`transition duration-300 font-medium tracking-wider transform hover:scale-105 ${COLORS.textLight} hover:text-[#FFD700] hover:border-b-4 hover:border-[#FFD700] py-1 cursor-pointer`}
              onClick={() => {
                if (item.page === 'ucbexm') {
                  window.location.hash = '#ucbexm';
                } else {
                  scrollToSection(item.page);
                }
              }}
            >
              {item.name}
            </button>
          ))}
          {/* Botón moderno gris para lanzar UCB-Explorer Manager */}
          <button
            onClick={openUcbExplorerManager}
            className="bg-gray-200 text-[#003366] font-bold py-2 px-4 rounded-full shadow-md transition duration-200 transform hover:scale-105 mr-2 hover:bg-[#FFD700] hover:text-[#003366] border-2 border-transparent hover:border-[#003366]"
          >
            UCB-Explorer Manager
          </button>

          {/* Enlaces de Acción (Regístrate / Log In) - ahora funcionales */}
          <button
            className={`bg-white hover:bg-gray-200 ${COLORS.textDark} font-bold py-2.5 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center space-x-2`}
            onClick={openRegisterModal}
          >
            <UserPlus className="w-5 h-5" />
            <span>Regístrate</span>
          </button>
          <button
            className={`${COLORS.accent} ${COLORS.hoverAccent} ${COLORS.textDark} font-bold py-2.5 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center space-x-2 border-2 border-transparent hover:border-[#003366]`}
            onClick={openLoginModal}
          >
            <LogIn className="w-5 h-5" />
            <span>Log In</span>
          </button>
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
              className={`block px-4 py-3 hover:bg-[#004488] transition duration-200 w-full text-left text-lg ${COLORS.textLight}`}
              onClick={() => { 
                if (item.page === 'ucbexm') { window.location.hash = '#ucbexm'; } 
                else { scrollToSection(item.page); }
                setIsOpen(false); 
              }} 
            >
              {item.name}
            </button>
          ))}
          {/* Botón UCB-Explorer Manager en móvil */}
          <div className="px-4 py-3">
            <button
              onClick={() => { openUcbExplorerManager(); setIsOpen(false); }}
              className="bg-gray-200 w-full text-[#003366] font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 hover:bg-[#FFD700] hover:text-[#003366] border-2 border-transparent hover:border-[#003366]"
            >
              UCB-Explorer Manager
            </button>
          </div>
          <div className="px-4 pt-4 space-y-3">
             <button
                className={`bg-white w-full hover:bg-gray-200 ${COLORS.textDark} font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2`}
                onClick={() => { openRegisterModal(); setIsOpen(false); }} 
              >
                <UserPlus className="w-5 h-5" />
                <span>Regístrate</span>
              </button>
            <button
              className={`${COLORS.accent} w-full ${COLORS.hoverAccent} ${COLORS.textDark} font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2`}
              onClick={() => { openLoginModal(); setIsOpen(false); }} 
            >
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// 2. Tarjeta de Ventaja Competitiva
const AdvantageCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="bg-white p-6 rounded-2xl shadow-xl card-dynamic-hover transition duration-500 border-b-4 border-[#003366] group animate-fadeIn"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className={`bg-gray-100 p-4 rounded-full inline-flex mb-4 transition duration-300 group-hover:bg-[#FFD700] group-hover:shadow-2xl`}>
      <Icon className={`w-8 h-8 ${COLORS.textDark.replace('text-', 'text-')} transition duration-300 group-hover:text-black`} />
    </div>
    <h3 className={`text-xl font-bold mb-3 ${COLORS.textDark.replace('text-', 'text-')} group-hover:text-black transition duration-200`}>{title}</h3>
    <p className="text-gray-600 group-hover:text-gray-800 transition duration-200">{description}</p>
  </div>
);

// 3. Tarjeta de Novedad
const NewsCard = ({ title, date, excerpt }) => (
    <div className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-[#FFD700] hover:shadow-2xl transition duration-300 cursor-pointer flex space-x-3 transform hover:scale-[1.02]">
        <div className="w-12 h-12 flex-shrink-0 bg-[#003366] rounded-lg flex items-center justify-center border-2 border-[#FFD700]">
            <Star className="w-6 h-6 text-white" />
        </div>
        <div className="flex-grow">
            <h4 className="text-base font-bold text-[#003366] line-clamp-2">{title}</h4>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{excerpt}</p>
            <span className="text-xs text-gray-400 mt-1 block italic flex items-center"><Clock className='w-3 h-3 mr-1'/> {date}</span>
        </div>
    </div>
);

// 4. Componente de Formulario de Contacto (Estilizado)
const ContactForm = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simular envío de formulario
        setTimeout(() => {
            console.log('Formulario de contacto enviado');
            setStatus('success');
            setTimeout(() => setStatus(''), 5000); // Reset after 5 seconds
        }, 2000);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-t-4 border-[#FFD700]">
            <h4 className="text-2xl font-bold mb-6 text-[#003366] flex items-center">
                <Mail className="w-6 h-6 mr-3 text-[#FFD700]" />
                Envíanos un Mensaje
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Tu consulta o comentario..."
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-[#FFD700]/50 focus:border-[#003366] transition duration-150 shadow-sm"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`${COLORS.primary} ${COLORS.hoverPrimary} ${COLORS.textLight} font-bold py-3 px-8 rounded-lg shadow-xl text-lg transition duration-300 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50`}
                >
                    {status === 'sending' ? (
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                    ) : (
                        <Send className="w-5 h-5 mr-2" />
                    )}
                    {status === 'sending' ? 'Enviando...' : 'Enviar Consulta'}
                </button>
            </form>

            {status === 'success' && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                </div>
            )}
        </div>
    );
};

// 5. Componente Footer (Replicado del Home.jsx con ajuste de Call to Action)
const Footer = () => (
    <footer className={`${COLORS.primary} text-white pt-12 pb-6`} id="footer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-8 mb-6">
                
                {/* Columna 1: Información de Contacto y Formulario */}
                <div>
                    <ContactForm />
                </div>

                {/* Columna 2: Redes Sociales y Mapa */}
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <p className="text-2xl font-extrabold text-[#FFD700]">#UCBLaPaz</p>
                    <div className="flex space-x-6">
                        {/* Facebook */}
                        <a 
                            href="https://www.facebook.com/UCB.BOLIVIA/?locale=es_LA" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-3 rounded-full bg-gray-700 hover:bg-[#FFD700] transition duration-300 transform hover:scale-110 shadow-lg"
                            aria-label="Facebook de UCB"
                        >
                            <Facebook className="w-6 h-6 text-white hover:text-[#003366]" />
                        </a>
                        
                        {/* WhatsApp */}
                        <a 
                            href="https://api.whatsapp.com/send?phone=59175851671&text=%C2%A1Hola!%20tengo%20una%20consulta." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-3 rounded-full bg-gray-700 hover:bg-[#FFD700] transition duration-300 transform hover:scale-110 shadow-lg"
                            aria-label="WhatsApp de UCB"
                        >
                            <MessageCircle className="w-6 h-6 text-white hover:text-[#003366]" />
                        </a>

                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/ucb.lapaz/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-3 rounded-full bg-gray-700 hover:bg-[#FFD700] transition duration-300 transform hover:scale-110 shadow-lg"
                            aria-label="Instagram de UCB"
                        >
                            <Instagram className="w-6 h-6 text-white hover:text-[#003366]" />
                        </a>
                        
                        {/* CALL TO ACTION: Llamada Telefónica */}
                        <a 
                            href="tel:+59122782222" 
                            className="p-3 rounded-full bg-[#FFD700] hover:bg-[#003366] transition duration-300 transform hover:scale-110 shadow-lg cta-phone"
                            aria-label="Llamar a UCB"
                        >
                            <Phone className="w-6 h-6 text-[#003366] hover:text-[#FFD700]" />
                        </a>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="mt-6 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-4 border-gray-700">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1529.9866952864692!2d-68.10688195431633!3d-16.531778945781335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20658e4549f7%3A0x2a98f1f77f52f360!2sMuseo%20de%20Etnograf%C3%ADa%20y%20Folklore!5e0!3m2!1ses!2sbo!4v1700000000000!5m2!1ses!2sbo" 
                            width="100%" 
                            height="250" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa de Ubicación UCB La Paz"
                        ></iframe>
                    </div>
                </div>

                {/* Columna 3: Información de Contacto Detallada */}
                <div className="md:text-right">
                    <h4 className="text-xl font-bold mb-4 text-[#FFD700]">Datos de Contacto UCB</h4>
                    <div className="space-y-3 text-sm text-gray-300 md:text-left md:pl-16">
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
                        <div className="flex items-center transition duration-200 hover:text-[#FFD700]">
                            <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                            <p>Atención: Lun-Vie 8:30 - 16:30</p>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Copyright Final */}
            <div className="text-center text-sm text-gray-400 pt-4">
                <p>© {new Date().getFullYear()} Universidad Católica Boliviana San Pablo. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
);

// --- Componente Principal Exportado (UCBHome) ---
const UCBHome = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate(); // Hook para navegación
  
  // Función para manejar scroll suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para manejar login exitoso
  const handleLoginSuccess = (userData) => {
    console.log('Login exitoso:', userData);
    setShowLoginModal(false);
    // Aquí puedes agregar más lógica post-login si es necesario
  };

  // Función para abrir UCB-Explorer Manager (redirige a Home.jsx)
  const openUcbExplorerManager = () => {
    console.log('Redirigiendo a UCB-Explorer Manager...');
    navigate('/UCB-Explorer-Manager'); // Redirige a la ruta de Home.jsx
  };

  // Funciones para otros modales (placeholder)
  const openRegisterModal = () => {
    console.log('Abrir modal de registro');
    // Aquí puedes implementar la lógica para abrir el modal de registro
  };

  const openAllNewsModal = () => {
    console.log('Abrir todas las noticias');
    // Aquí puedes implementar la lógica para mostrar todas las noticias
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomStyles />
      
      <Header 
        scrollToSection={scrollToSection}
        openLoginModal={() => setShowLoginModal(true)}
        openRegisterModal={openRegisterModal}
        openUcbExplorerManager={openUcbExplorerManager} // Cambiado el nombre
      />

      <main className="pt-20"> 

        {/* 2. SECCIÓN PRINCIPAL: Hero / Bienvenida */}
        <section 
            id="hero" 
            className={`${COLORS.primary} relative min-h-screen flex items-center overflow-hidden`}
        >
            {/* Video de fondo local + overlay azul leve para contraste */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/UCBCampus.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            {/* Tono azul leve sobre el video */}
            <div className="absolute inset-0 bg-[#003366]/60"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-4xl mx-auto text-center animate-fadeIn">
                    {/* Logo (ampliado para mejor visibilidad) */}
                    <img 
                        src="/photos/UCBLogo.png" 
                        alt="Logo UCB" 
                        className="w-48 h-48 mx-auto mb-6 animate-pulse-slow drop-shadow-lg object-contain" 
                    />
                    
                    {/* Nombre y Slogan */}
                    <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight text-white drop-shadow-xl">
                        Universidad Católica Boliviana <span className='text-[#FFD700]'>San Pablo</span>
                    </h1>

                    <p className="text-xl md:text-3xl mb-10 max-w-3xl mx-auto text-gray-200 font-light italic border-t border-b border-gray-400/50 py-4">
                        "Aqui tienes tu lugar"
                    </p>

                    {/* CTA Principal */}
                    <button
                        className={`${COLORS.accent} ${COLORS.hoverAccent} ${COLORS.textDark} font-black py-4 px-12 rounded-full shadow-2xl text-xl transition duration-300 transform hover:scale-[1.05] border-2 border-transparent hover:border-white`}
                        onClick={() => scrollToSection('services')}
                    >
                        Explora Nuestra Oferta Académica
                    </button>
                </div>
            </div>
        </section>
        
        {/* 3. SECCIÓN: Acerca de Nosotros (Historia, Misión y Visión) */}
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-16 ${COLORS.textDark.replace('text-', 'text-')}`}>
                    <span className="text-[#FFD700]">Acerca</span> de Nosotros
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Columna de Texto - Historia y Misión/Visión */}
                    <div className="space-y-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        
                        {/* Historia */}
                        <div className="p-6 bg-gray-50 rounded-xl shadow-lg border-l-8 border-[#003366]">
                            <h3 className="text-3xl font-bold mb-3 text-[#003366]">Historia y Logros</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Fundada en 1966, la Universidad Católica Boliviana "San Pablo" ha sido pionera en la educación superior del país. A lo largo de sus décadas, ha sido elogiada por su excelencia académica y su compromiso con la formación humanista, destacando logros en investigación y liderazgo social. Es una institución de derecho público, sin fines de lucro, bajo la tuición de la Conferencia Episcopal Boliviana.
                            </p>
                        </div>
                        
                        {/* Misión */}
                        <div className="p-6 bg-[#003366]/5 rounded-xl shadow-lg border-l-8 border-[#FFD700]">
                            <h3 className="text-3xl font-bold mb-3 text-[#003366] flex items-center"><CheckCircle className='w-6 h-6 mr-3'/> Nuestra Misión</h3>
                            <p className="text-gray-700 leading-relaxed italic">
                                "La constante búsqueda de la verdad mediante la investigación, la conservación y la comunicación del saber para el bien de la sociedad."
                            </p>
                        </div>
                        
                        {/* Visión */}
                        <div className="p-6 bg-[#003366]/5 rounded-xl shadow-lg border-l-8 border-gray-400">
                            <h3 className="text-3xl font-bold mb-3 text-[#003366] flex items-center"><TrendingUp className='w-6 h-6 mr-3'/> Nuestra Visión</h3>
                            <p className="text-gray-700 leading-relaxed italic">
                                "Ser universidad católica en salida, que desde su identidad investiga éticamente, forma integralmente profesionales de calidad y brinda educación para la vida, aportando agentes de cambio humanistas para el desarrollo sostenible de la humanidad."
                            </p>
                        </div>
                        
                    </div>

                    {/* Columna de Imagen/Gráfico (Placeholder) */}
                    <div className="hidden lg:block animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner border-2 border-dashed border-gray-300">
                            <h3 className="text-2xl font-bold text-center text-gray-700 mb-6">Nuestra Misión — Visual</h3>
                            <div className="w-full h-80 rounded-xl overflow-hidden border-4 border-[#003366]/30">
                                <img
                                    src="/photos/mision.png"
                                    alt="Imagen de la Misión UCB"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* 4. SECCIÓN: Productos o Servicios (Oferta Académica) */}
        <section id="services" className={`py-20 ${COLORS.primary} bg-opacity-95`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-4 ${COLORS.textLight.replace('text-', 'text-')}`}>
                    Nuestra <span className="text-[#FFD700]">Oferta Académica</span>
                </h2>
                <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
                    Formando profesionales y líderes en todas las áreas del conocimiento.
                </p>

                {/* Descripción de Servicios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {academicServices.map((service, index) => (
                        <div 
                            key={index}
                            className="p-6 bg-white rounded-2xl shadow-xl border-t-8 border-[#FFD700] text-center transform hover:scale-[1.02] transition duration-300"
                        >
                            <service.icon className={`w-12 h-12 mx-auto mb-4 ${COLORS.textDark.replace('text-', 'text-')}`} />
                            <h3 className="text-2xl font-bold mb-3 text-[#003366]">{service.title}</h3>
                            <p className="text-gray-700">{service.description}</p>
                        </div>
                    ))}
                </div>
                
                {/* Ventajas Competitivas */}
                <div className="mt-20">
                    <h3 className="text-3xl font-bold text-center mb-10 text-[#FFD700] flex items-center justify-center">
                        <Zap className='w-6 h-6 mr-3'/> Ventajas Competitivas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {competitiveAdvantages.map((adv, index) => (
                            <AdvantageCard key={index} {...adv} />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 5. SECCIÓN: Noticias o Novedades */}
        <section id="news" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-4 ${COLORS.textDark.replace('text-', 'text-')}`}>
                    Últimas <span className="text-[#FFD700]">Novedades</span>
                </h2>
                <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
                    Mantente al día con nuestros eventos, ofertas y logros institucionales.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsItems.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <button
                        className={`${COLORS.primary} ${COLORS.hoverPrimary} ${COLORS.textLight} font-bold py-3 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto`}
                        onClick={openAllNewsModal}
                    >
                        Ver Todas las Noticias
                    </button>
                </div>
            </div>
        </section>
        
        {/* 6. Footer (Incluye Contacto, Formulario, Redes y Mapa) */}
        <Footer />

      </main>

      {/* Modal de Login */}
      <LoginModal 
        isOpen={showLoginModal}
        closeModal={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default UCBHome;