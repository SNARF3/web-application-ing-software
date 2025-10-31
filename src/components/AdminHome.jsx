import React, { useState } from 'react';
import { 
  Menu, X, LogOut, User, Users, CalendarCheck, School, BarChart3, 
  Mail, MessageSquare, Award, Clock, Settings, TrendingUp, Zap, ThumbsUp,
  AlertCircle, Lock, Eye, Shield, CheckCircle, AlertTriangle,
} from 'lucide-react';
import GestionCuentas from './GestionCuentas';
import GestionContrasenas from './GestionContrasenas';
import UCBHome from './UCBHome';
import { useNavigate } from 'react-router-dom';

// Colores institucionales y tema de la interfaz
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
        @keyframes slideInFromTop {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
            animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        /* Estilo dinámico de la tarjeta de módulo */
        .module-card {
            transition: all 0.3s ease-in-out;
        }
        .module-card:hover {
            transform: translateY(-8px) scale(1.02); 
            box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.2);
        }
        .module-card-icon {
            transition: all 0.3s ease-in-out;
        }
        .module-card:hover .module-card-icon {
            transform: scale(1.1) rotate(-5deg);
            color: #003366; /* Azul UCB */
        }
        `}
    </style>
);


// --- Componente Modal de Confirmación de Cierre de Sesión ---
const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 transform transition-all animate-fadeIn border-t-8 border-[#FFD700]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 mx-auto text-[#003366] mb-4" />
                    <h3 className="text-2xl font-bold text-[#003366] mb-4">¿Cerrar Sesión?</h3>
                    <p className="text-gray-600 mb-8">¿Estás seguro de que deseas cerrar tu sesión en UCB Explorer Manager?</p>
                    
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={onConfirm}
                            className="bg-[#003366] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#004488] transition duration-300 flex items-center"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sí, cerrar sesión
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition duration-300"
                        >
                            No, cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Componente de Navegación Lateral (Sidebar) ---
const AdminSidebar = ({ activeModule, setActiveModule, modules }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutModal(false);
        navigate('/');
    };

    return (
        <>
            {/* Botón de Hamburguesa (Solo en móvil) */}
            <button
                className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-full ${COLORS.primary} ${COLORS.textLight} shadow-lg`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Fija */}
            <nav 
                className={`fixed top-0 left-0 h-full w-64 ${COLORS.primary} text-white p-6 shadow-2xl z-40 
                            transform transition-transform duration-300 ease-in-out 
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                {/* Logo UCB */}
                <div className="flex flex-col items-center border-b border-gray-700 pb-6 mb-6">
                    <img 
                        src="/photos/UCBLogo.png" 
                        alt="UCB Logo" 
                        className="w-16 h-16 object-contain mb-2" 
                    />
                    <span className="text-xl font-black text-white">UCB MANAGER</span>
                    <span className="text-xs text-gray-400">Panel de Administración</span>
                </div>

                {/* Lista de Módulos */}
                <ul className="space-y-3">
                    {modules.map((module) => (
                        <li key={module.name}>
                            <button
                                onClick={() => { 
                                    setActiveModule(module.name);
                                    setIsOpen(false); // Cierra el menú en móvil al seleccionar
                                }}
                                className={`w-full text-left flex items-center p-3 rounded-xl transition duration-300 font-medium 
                                    ${activeModule === module.name 
                                        ? `${COLORS.accent.replace('bg-', 'bg-')} ${COLORS.textDark}`
                                        : 'hover:bg-[#004488] text-gray-200'
                                    }
                                `}
                            >
                                <module.icon className={`w-5 h-5 mr-3 ${activeModule === module.name ? COLORS.textDark : 'text-[#FFD700]'}`} />
                                {module.name}
                            </button>
                        </li>
                    ))}
                </ul>
                
                {/* Botón de Salida (Logout) */}
                <div className="absolute bottom-6 w-full pr-12">
                     <button
                        onClick={() => setShowLogoutModal(true)}
                        className={`w-full text-left flex items-center p-3 rounded-xl transition duration-300 font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg`}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            {/* Modal de Confirmación de Cierre de Sesión */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};


// --- Componente de Tarjeta de Módulo (Dashboard) ---
const ModuleCard = ({ icon: Icon, title, description, delay, onClick }) => (
    <div 
        className={`module-card p-6 rounded-3xl shadow-xl bg-white border-b-8 border-[#FFD700] cursor-pointer 
                    hover:border-b-8 hover:border-[#003366] text-center animate-slide-in`}
        style={{ animationDelay: `${delay}s` }}
        onClick={() => onClick && onClick(title)}
    >
        <div className={`p-5 rounded-full inline-flex mb-4 bg-[#003366]/5`}>
            <Icon className={`w-10 h-10 module-card-icon text-[#FFD700]`} />
        </div>
        <h3 className={`text-xl font-extrabold mb-2 ${COLORS.textDark.replace('text-', 'text-')}`}>{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 inline-block px-4 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500 transition duration-300 group-hover:bg-[#FFD700] group-hover:text-[#003366]">
            Ver Detalles
        </div>
    </div>
);


// --- Componente Principal (AdminHome) ---
const AdminHome = () => {
    const [activeModule, setActiveModule] = useState('Dashboard'); // Módulo inicial

    // Definición de todos los módulos con sus iconos
    const modules = [
        { 
            name: 'Dashboard', 
            icon: Zap, 
            description: 'Vista rápida y principales indicadores de gestión.'
        },
        { 
            name: 'Gestión de Cuentas', 
            icon: Users, 
            description: 'Administración de usuarios, roles y permisos del sistema.' 
        },
        { 
            name: 'Gestión de Visitas', 
            icon: CalendarCheck, 
            description: 'Programación, seguimiento y registro de visitas a la universidad.' 
        },
        { 
            name: 'Colegios y Estudiantes', 
            icon: School, 
            description: 'Manejo de la base de datos de colegios y perfiles de estudiantes.' 
        },
        { 
            name: 'Notificaciones', 
            icon: Mail, 
            description: 'Envío y gestión de alertas, comunicados y mensajes masivos.' 
        },
        { 
            name: 'Reportes y Métricas', 
            icon: BarChart3, 
            description: 'Generación de informes clave y análisis de rendimiento.' 
        },
        { 
            name: 'Feedback y Encuestas', 
            icon: ThumbsUp, 
            description: 'Recolección y análisis de la satisfacción y opiniones de los usuarios.' 
        },
        { 
            name: 'Administración de Contraseñas', 
            icon: Lock, 
            description: 'Gestión y actualización de contraseñas del sistema.' 
        },
    ];

    // Simulación de métricas clave para el Dashboard
    const metrics = [
        { title: 'Visitas Programadas', value: '45', icon: CalendarCheck, color: 'bg-green-500' },
        { title: 'Estudiantes Registrados', value: '1,204', icon: Users, color: 'bg-indigo-500' },
        { title: 'Colegios Activos', value: '52', icon: School, color: 'bg-red-500' },
        { title: 'Satisfacción Promedio', value: '4.7 / 5', icon: ThumbsUp, color: 'bg-yellow-500' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            <CustomStyles />
            
            {/* 1. Sidebar */}
            <AdminSidebar 
                activeModule={activeModule} 
                setActiveModule={setActiveModule} 
                modules={modules}
            />

            {/* 2. Área de Contenido Principal */}
            <div className="flex-grow md:ml-64 p-4 md:p-8 overflow-y-auto">
                
                {/* Barra Superior con Bienvenida y Perfil */}
                <header className="flex justify-between items-center mb-10 pt-4 md:pt-0">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366] animate-slide-in">
                        Panel de Control
                        {activeModule !== 'Dashboard' && (
                            <span className="ml-3 text-2xl font-light text-gray-500"> / {activeModule}</span>
                        )}
                    </h1>
                    
                    {/* Tarjeta de Perfil de Admin */}
                    <div className="flex items-center space-x-3 bg-white p-2 md:p-3 rounded-full shadow-lg border-2 border-[#FFD700] cursor-pointer hover:shadow-xl transition duration-300">
                        <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="hidden md:block text-sm font-semibold text-[#003366]">Bienvenido, Administrador UCB</span>
                    </div>
                </header>

                {/* 3. Contenido Condicional según el módulo activo */}
                {activeModule === 'Dashboard' && (
                    <>
                        {/* Mensaje de Bienvenida */}
                        <div className={`p-6 md:p-10 rounded-2xl mb-10 text-white shadow-2xl animate-slide-in`}
                             style={{ backgroundColor: '#003366', borderLeft: '10px solid #FFD700' }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
                                <Award className="w-7 h-7 mr-3 text-[#FFD700] animate-pulse-slow" />
                                ¡Hola, Administrador!
                            </h2>
                            <p className="text-gray-300">
                                Aquí tienes una visión general y el acceso a todos los módulos de gestión. Tu trabajo es clave para la excelencia en la promoción académica de la UCB.
                            </p>
                        </div>

                        {/* Módulos / Tarjetas de Navegación */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {modules
                                .filter(m => m.name !== 'Dashboard')
                                .map((module, index) => (
                                <ModuleCard 
                                    key={module.name}
                                    icon={module.icon}
                                    title={module.name}
                                    description={module.description}
                                    delay={0.1 + index * 0.1}
                                    onClick={setActiveModule}
                                />
                            ))}
                        </section>
                    </>
                )}

                {/* Componente Gestión de Cuentas */}
                {activeModule === 'Gestión de Cuentas' && <GestionCuentas />}

                {/* Componente Administración de Contraseñas */}
                {activeModule === 'Administración de Contraseñas' && <GestionContrasenas />}
                
                {/* 5. Vista de Métricas Rápidas (Solo en Dashboard) */}
                {activeModule === 'Dashboard' && (
                    <section className="mt-12">
                        <h3 className="text-2xl font-bold text-[#003366] mb-6 border-b pb-2 flex items-center">
                            <TrendingUp className='w-6 h-6 mr-2 text-[#FFD700]'/> Métricas Clave (Resumen)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {metrics.map((metric, index) => (
                                <div 
                                    key={index}
                                    className="bg-white p-5 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:ring-2 hover:ring-[#FFD700] border-t-4 border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                                        <div className={`p-2 rounded-full text-white ${metric.color}`}>
                                            <metric.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-extrabold mt-2 text-[#003366]">{metric.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Footer simple de referencia */}
                <footer className="mt-20 text-center text-sm text-gray-400 py-4 border-t">
                    <p>Sistema de Gestión UCB - Versión 1.0.0</p>
                </footer>

            </div>
        </div>
    );
};

export default AdminHome;
