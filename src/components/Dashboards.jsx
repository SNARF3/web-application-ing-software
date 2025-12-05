import React, { useState, useEffect } from 'react';
import { 
    School, Users, Calendar, FileText, TrendingUp, TrendingDown, 
    Clock, CheckCircle, XCircle, AlertTriangle, Eye, UserCheck,
    BarChart3, RefreshCw, Download, CalendarDays, Building, Activity,
    Filter, Printer, MoreVertical, ChevronDown, ChevronUp, Info,
    Target, PieChart, LineChart, Map, Home, ArrowUpRight, ArrowDownRight,
    Award, Star, TrendingUp as TrendingUpIcon, Globe, ChevronRight,
    Zap, Activity as ActivityIcon, TrendingDown as TrendingDownIcon
} from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS UCB ---
const UCB_COLORS = {
    primary: 'bg-[#003366]',
    primaryText: 'text-[#003366]',
    accent: 'bg-[#FFD700]',
    accentText: 'text-[#FFD700]',
    buttonPrimary: 'bg-[#003366] hover:bg-[#004488]',
    buttonAccent: 'bg-[#FFD700] hover:bg-[#E0B800] text-[#003366]',
    buttonDanger: 'bg-red-600 hover:bg-red-700',
    cardBg: 'bg-gradient-to-br from-white to-gray-50',
};

// Función para generar datos simulados según el rango de tiempo
const generateTimeRangeData = (timeRange, baseData) => {
    const now = new Date();
    let labels = [];
    let values = [];
    let title = '';
    
    switch(timeRange) {
        case 'hoy':
            // Datos por hora para hoy
            title = 'Visitas por Hora (Hoy)';
            labels = Array.from({length: 12}, (_, i) => `${i+8}:00`);
            values = Array.from({length: 12}, () => Math.floor(Math.random() * 20) + 5);
            break;
            
        case 'semana':
            // Datos por día de la semana
            title = 'Visitas por Día (Esta Semana)';
            labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            values = Array.from({length: 7}, () => Math.floor(Math.random() * 30) + 10);
            break;
            
        case 'mes':
            // Datos por semana del mes
            title = 'Visitas por Semana (Este Mes)';
            labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            values = Array.from({length: 4}, () => Math.floor(Math.random() * 50) + 20);
            break;
            
        case 'anio':
        default:
            // Datos por mes del año
            title = 'Visitas por Mes (Último Año)';
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            labels = meses;
            values = meses.map(() => Math.floor(Math.random() * 60) + 15);
            break;
    }
    
    return { labels, values, title };
};

const Dashboard = () => {
    // --- ESTADOS PARA LOS DATOS DEL DASHBOARD ---
    const [dashboardData, setDashboardData] = useState({
        totalColegios: 0,
        totalEstudiantes: 0,
        totalVisitas: 0,
        visitasHoy: 0,
        visitasProgramadas: 0,
        visitasEnCurso: 0,
        visitasFinalizadas: 0,
        visitasCanceladas: 0,
        totalUsuarios: 0,
        totalReportes: 0,
        estudiantesPorColegio: [],
        visitasRecientes: [],
        tendenciaColegios: 0,
        tendenciaEstudiantes: 0,
        tendenciaVisitas: 0,
        visitasPorMes: [],
        estudiantesPorEdad: [],
        colegiosPorCiudad: [],
        satisfaccionPromedio: 0,
        metricasGenerales: {}
    });

    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('semana');
    const [exporting, setExporting] = useState(false);
    const [expandedSection, setExpandedSection] = useState('general');
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [],
        values: [],
        title: 'Visitas por Mes (Último Año)'
    });

    // --- GENERAR DATOS DE GRÁFICA SEGÚN RANGO DE TIEMPO ---
    useEffect(() => {
        const { labels, values, title } = generateTimeRangeData(timeRange, dashboardData);
        setChartData({ labels, values, title });
    }, [timeRange, dashboardData]);

    // --- OBTENER DATOS DEL DASHBOARD DESDE LA API ÚNICA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            const token = sessionStorage.getItem('token') || '';

            try {
                const response = await fetch('http://localhost:3000/api/dashboard', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setDashboardData(result.data);
                    } else {
                        setError(result.message || 'Error en la respuesta del servidor');
                        console.error('Error en la respuesta del dashboard:', result.message);
                    }
                } else if (response.status === 403) {
                    setError('No tienes permisos para acceder al dashboard');
                } else if (response.status === 401) {
                    setError('Sesión expirada. Por favor, inicia sesión nuevamente');
                } else {
                    setError(`Error HTTP: ${response.status}`);
                }
            } catch (error) {
                setError('Error de conexión con el servidor');
                console.error('Error cargando datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        
        // Actualizar cada 5 minutos
        const interval = setInterval(fetchDashboardData, 300000);
        return () => clearInterval(interval);
    }, []); // Se ejecuta solo al montar el componente

    // --- FUNCIONES AUXILIARES ---
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Hora no disponible';
        return timeString.substring(0, 5); // Formato HH:MM
    };

    const handleExport = async () => {
        setExporting(true);
        const token = sessionStorage.getItem('token') || '';
        
        try {
            const response = await fetch('http://localhost:3000/api/dashboard/export', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const dataStr = JSON.stringify(result.data, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    
                    const exportFileDefaultName = `dashboard_${new Date().toISOString().split('T')[0]}.json`;
                    
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                    
                    alert('Reporte exportado exitosamente');
                } else {
                    alert('Error al exportar el reporte: ' + result.message);
                }
            } else {
                alert('Error al conectar con el servidor para exportar');
            }
        } catch (error) {
            console.error('Error exportando reporte:', error);
            alert('Error al exportar el reporte');
        } finally {
            setExporting(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    // --- FILTRAR DATOS SEGÚN RANGO DE TIEMPO ---
    const getFilteredData = () => {
        const { visitasRecientes } = dashboardData;
        const now = new Date();
        let filteredVisitas = [];
        
        switch(timeRange) {
            case 'hoy':
                const today = now.toISOString().split('T')[0];
                filteredVisitas = visitasRecientes.filter(v => v.fecha === today);
                break;
            case 'semana':
                const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
                filteredVisitas = visitasRecientes.filter(v => new Date(v.fecha) >= new Date(weekAgo));
                break;
            case 'mes':
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
                filteredVisitas = visitasRecientes.filter(v => new Date(v.fecha) >= new Date(monthAgo));
                break;
            case 'anio':
                const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
                filteredVisitas = visitasRecientes.filter(v => new Date(v.fecha) >= new Date(yearAgo));
                break;
            default:
                filteredVisitas = visitasRecientes;
        }
        
        return filteredVisitas;
    };

    // --- COMPONENTES REUTILIZABLES ---
    const KpiCard = ({ title, value, icon: Icon, trend, subtitle, color = 'blue', percentage = false }) => {
        const colorClasses = {
            blue: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-[#003366]',
            gold: 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-[#FFD700]',
            green: 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500',
            red: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500',
            purple: 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500',
            indigo: 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-500'
        };

        const iconColorClasses = {
            blue: 'bg-blue-100 text-[#003366]',
            gold: 'bg-amber-100 text-[#FFD700]',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600',
            purple: 'bg-purple-100 text-purple-600',
            indigo: 'bg-indigo-100 text-indigo-600'
        };

        const formattedValue = percentage ? `${value}%` : 
            typeof value === 'number' ? value.toLocaleString() : 
            value || '0';

        return (
            <div className={`${colorClasses[color]} rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {formattedValue}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${iconColorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{subtitle}</span>
                    {trend !== undefined && !isNaN(trend) && (
                        <div className={`flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const EstadoVisita = ({ estado }) => {
        const estados = {
            'Programada': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
            'En curso': { icon: ActivityIcon, color: 'text-amber-600', bg: 'bg-amber-100' },
            'Finalizada': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
            'Cancelada': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
        };

        const config = estados[estado] || estados['Programada'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {estado}
            </span>
        );
    };

    const MetricBar = ({ label, value, max = 100, color = 'blue' }) => {
        const width = Math.min((value / max) * 100, 100);
        const colorClasses = {
            blue: 'bg-blue-500',
            gold: 'bg-[#FFD700]',
            green: 'bg-green-500',
            red: 'bg-red-500',
            purple: 'bg-purple-500'
        };

        return (
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${colorClasses[color]}`}
                        style={{ width: `${width}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Componente de gráfica mejorada
    const EnhancedBarChart = ({ data, title, maxHeight = 180 }) => {
        if (!data.values || data.values.length === 0) {
            return (
                <div className="text-center py-10">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay datos disponibles para mostrar</p>
                </div>
            );
        }

        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const hasVariation = maxValue > minValue;

        return (
            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="flex items-center mr-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                            Visitas
                        </span>
                        {hasVariation && (
                            <span className={`flex items-center ${maxValue > minValue ? 'text-green-600' : 'text-red-600'}`}>
                                {maxValue > minValue ? <TrendingUpIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
                                {maxValue > minValue ? 'En aumento' : 'En disminución'}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="relative">
                    {/* Líneas de fondo */}
                    <div className="absolute inset-0 flex flex-col justify-between h-48">
                        {[0, 25, 50, 75, 100].map((percent) => (
                            <div key={percent} className="border-t border-gray-100"></div>
                        ))}
                    </div>
                    
                    {/* Gráfica de barras */}
                    <div className="flex items-end h-48 space-x-1 md:space-x-2 relative z-10">
                        {data.values.map((value, index) => {
                            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                            const isPeak = value === maxValue;
                            
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    {/* Barra con efecto hover */}
                                    <div className="relative w-full">
                                        <div 
                                            className={`w-full rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${
                                                isPeak 
                                                    ? 'bg-gradient-to-t from-[#FFD700] to-[#E0B800]' 
                                                    : 'bg-gradient-to-t from-[#003366] to-blue-400'
                                            }`}
                                            style={{ 
                                                height: `${height}%`,
                                                minHeight: '20px'
                                            }}
                                        >
                                            {/* Valor en la barra */}
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                                                    {value} visitas
                                                    {isPeak && <Zap className="w-3 h-3 inline ml-1 text-[#FFD700]" />}
                                                </div>
                                                <div className="w-2 h-2 bg-gray-800 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Etiqueta inferior */}
                                    <div className="mt-2 text-center">
                                        <span className="text-xs font-medium text-gray-700">{data.labels[index]}</span>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {value} <span className="text-gray-400">vis.</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Leyenda de valores */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                        <span>Mín: {minValue}</span>
                        <span className="text-gray-700 font-medium">Promedio: {Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)}</span>
                        <span>Máx: {maxValue}</span>
                    </div>
                    
                    {/* Eje Y */}
                    <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                        {maxValue > 0 && [100, 75, 50, 25, 0].map((percent) => (
                            <span key={percent}>
                                {Math.round((percent / 100) * maxValue)}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Resumen estadístico */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#003366]">{data.values.reduce((a, b) => a + b, 0)}</div>
                        <div className="text-gray-600 text-xs">Total</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)}
                        </div>
                        <div className="text-gray-600 text-xs">Promedio</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600">{maxValue}</div>
                        <div className="text-gray-600 text-xs">Pico</div>
                    </div>
                </div>
            </div>
        );
    };

    // --- COMPONENTE DE CARGA ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366] mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando datos del dashboard...</p>
                </div>
            </div>
        );
    }

    // --- COMPONENTE DE ERROR ---
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 font-sans flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar el dashboard</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#004488] transition font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Extraer datos para facilitar el acceso
    const {
        totalColegios,
        totalEstudiantes,
        totalVisitas,
        visitasHoy,
        visitasProgramadas,
        visitasEnCurso,
        visitasFinalizadas,
        visitasCanceladas,
        totalUsuarios,
        totalReportes,
        estudiantesPorColegio,
        visitasRecientes,
        tendenciaColegios,
        tendenciaEstudiantes,
        tendenciaVisitas,
        visitasPorMes,
        estudiantesPorEdad,
        colegiosPorCiudad,
        satisfaccionPromedio,
        metricasGenerales
    } = dashboardData;

    // Filtrar visitas según el rango seleccionado
    const filteredVisitas = getFilteredData();

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            {/* HEADER */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className={`${UCB_COLORS.primaryText} text-3xl sm:text-4xl font-extrabold flex items-center mb-2`}>
                            <BarChart3 className={`w-8 h-8 sm:w-10 sm:h-10 mr-3 ${UCB_COLORS.accentText}`} />
                            Reportes y Métricas
                        </h1>
                        <p className="text-gray-600 text-lg">Dashboard analítico del sistema de gestión de visitas UCB</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="flex bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
                            {[
                                { key: 'hoy', label: 'Hoy' },
                                { key: 'semana', label: 'Semana' },
                                { key: 'mes', label: 'Mes' },
                                { key: 'anio', label: 'Año' }
                            ].map((range) => (
                                <button
                                    key={range.key}
                                    onClick={() => setTimeRange(range.key)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                                        timeRange === range.key 
                                            ? 'bg-[#003366] text-white shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {timeRange === range.key && <Filter className="w-4 h-4 mr-2" />}
                                    {range.label}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleRefresh}
                            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition shadow-sm"
                            title="Actualizar datos"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                            onClick={handleExport}
                            disabled={exporting}
                            className="p-2 rounded-lg bg-[#003366] text-white hover:bg-[#004488] transition flex items-center shadow-sm"
                            title="Exportar reporte"
                        >
                            <Download className="w-5 h-5" />
                            {exporting && <span className="ml-2 text-sm">Exportando...</span>}
                        </button>
                    </div>
                </div>
                
                {/* Indicador de filtro activo */}
                <div className="mt-4 flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Filtro activo:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {timeRange === 'hoy' ? 'Hoy' : 
                         timeRange === 'semana' ? 'Esta semana' : 
                         timeRange === 'mes' ? 'Este mes' : 
                         'Este año'}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-500">
                        Mostrando {filteredVisitas.length} visitas del período
                    </span>
                </div>
            </header>

            {/* RESUMEN GENERAL - KPI CARDS */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#003366]" />
                    Indicadores Clave de Desempeño (KPI)
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        • Período: {timeRange === 'hoy' ? 'Hoy' : timeRange === 'semana' ? 'Semanal' : timeRange === 'mes' ? 'Mensual' : 'Anual'}
                    </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard
                        title="Colegios Registrados"
                        value={totalColegios}
                        icon={School}
                        trend={tendenciaColegios}
                        subtitle={timeRange === 'hoy' ? 'Nuevos hoy' : 
                                timeRange === 'semana' ? 'Nuevos esta semana' : 
                                timeRange === 'mes' ? 'Nuevos este mes' : 
                                'Total registrados'}
                        color="blue"
                    />
                    <KpiCard
                        title="Estudiantes"
                        value={totalEstudiantes}
                        icon={Users}
                        trend={tendenciaEstudiantes}
                        subtitle={timeRange === 'hoy' ? 'Nuevos hoy' : 
                                timeRange === 'semana' ? 'Nuevos esta semana' : 
                                timeRange === 'mes' ? 'Nuevos este mes' : 
                                'Total en sistema'}
                        color="gold"
                    />
                    <KpiCard
                        title="Visitas Totales"
                        value={totalVisitas}
                        icon={Calendar}
                        trend={tendenciaVisitas}
                        subtitle={timeRange === 'hoy' ? 'Programadas hoy' : 
                                timeRange === 'semana' ? 'Esta semana' : 
                                timeRange === 'mes' ? 'Este mes' : 
                                'Programadas y realizadas'}
                        color="green"
                    />
                    <KpiCard
                        title="Satisfacción"
                        value={satisfaccionPromedio}
                        icon={Star}
                        trend={2.1}
                        subtitle="Promedio (1-5)"
                        color="purple"
                        percentage={false}
                    />
                </div>

                {/* SEGUNDA FILA DE KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard
                        title={timeRange === 'hoy' ? 'Visitas Hoy' : 
                               timeRange === 'semana' ? 'Visitas Semana' : 
                               timeRange === 'mes' ? 'Visitas Mes' : 
                               'Visitas Año'}
                        value={timeRange === 'hoy' ? visitasHoy : 
                               timeRange === 'semana' ? filteredVisitas.length : 
                               timeRange === 'mes' ? filteredVisitas.length : 
                               totalVisitas}
                        icon={CalendarDays}
                        subtitle={timeRange === 'hoy' ? 'Programadas para hoy' : 
                                timeRange === 'semana' ? 'Esta semana' : 
                                timeRange === 'mes' ? 'Este mes' : 
                                'Este año'}
                        color="blue"
                    />
                    <KpiCard
                        title="Tasa de Conversión"
                        value={metricasGenerales?.tasaConversion || '0%'}
                        icon={TrendingUpIcon}
                        trend={5.3}
                        subtitle="Visitas finalizadas"
                        color="green"
                        percentage={true}
                    />
                    <KpiCard
                        title="Usuarios Activos"
                        value={totalUsuarios}
                        icon={UserCheck}
                        subtitle="Equipo de gestión"
                        color="indigo"
                    />
                </div>
            </div>

            {/* SECCIÓN CON DOS COLUMNAS PRINCIPALES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* COLUMNA IZQUIERDA: ESTADÍSTICAS DE VISITAS CON GRÁFICA MEJORADA */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <PieChart className="w-5 h-5 mr-2 text-[#003366]" />
                            Distribución de Visitas por Estado
                        </h3>
                        <div className="flex items-center space-x-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Período: {timeRange}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-blue-700">Programadas</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-800">{visitasProgramadas}</p>
                            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${((visitasProgramadas || 0) / Math.max(totalVisitas || 1, 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <ActivityIcon className="w-5 h-5 text-amber-600 mr-2" />
                                <span className="text-sm font-medium text-amber-700">En curso</span>
                            </div>
                            <p className="text-2xl font-bold text-amber-800">{visitasEnCurso}</p>
                            <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-amber-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${((visitasEnCurso || 0) / Math.max(totalVisitas || 1, 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-green-700">Finalizadas</span>
                            </div>
                            <p className="text-2xl font-bold text-green-800">{visitasFinalizadas}</p>
                            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${((visitasFinalizadas || 0) / Math.max(totalVisitas || 1, 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                                <span className="text-sm font-medium text-red-700">Canceladas</span>
                            </div>
                            <p className="text-2xl font-bold text-red-800">{visitasCanceladas}</p>
                            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${((visitasCanceladas || 0) / Math.max(totalVisitas || 1, 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* GRÁFICA MEJORADA */}
                    <EnhancedBarChart data={chartData} title={chartData.title} />
                </div>

                {/* COLUMNA DERECHA: TOP COLEGIOS Y ESTUDIANTES */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-[#003366]" />
                            Top 5 Colegios con más Estudiantes
                        </h3>
                        <button 
                            onClick={() => setExpandedSection(expandedSection === 'colegios' ? '' : 'colegios')}
                            className="text-sm text-[#003366] font-medium hover:underline flex items-center"
                        >
                            {expandedSection === 'colegios' ? 'Ver menos' : 'Ver detalles'}
                            {expandedSection === 'colegios' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {(estudiantesPorColegio || []).length > 0 ? (
                            estudiantesPorColegio.map((colegio, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100 group">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? 'bg-[#FFD700] text-[#003366]' : 'bg-gray-100 text-gray-600'} font-bold mr-3 group-hover:scale-110 transition`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{colegio.nombre}</p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Map className="w-3 h-3 mr-1" />
                                                {colegio.direccion || 'Sin dirección'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[#003366]">{colegio.cantidad || 0}</p>
                                        <p className="text-xs text-gray-500">estudiantes</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <School className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No hay datos de colegios disponibles</p>
                            </div>
                        )}
                    </div>

                    {/* DISTRIBUCIÓN POR EDAD (solo si está expandido) */}
                    {expandedSection === 'colegios' && (
                        <div className="mt-8 pt-6 border-t">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Estudiantes por Edad</h4>
                            {(estudiantesPorEdad || []).map((item, index) => (
                                <MetricBar 
                                    key={index}
                                    label={`${item.edad} años`}
                                    value={item.cantidad || 0}
                                    max={Math.max(...(estudiantesPorEdad || []).map(e => e.cantidad || 0), 1)}
                                    color={index === 0 ? 'blue' : index === 1 ? 'green' : index === 2 ? 'gold' : 'purple'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* TERCERA FILA: VISITAS RECIENTES Y REPORTES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* VISITAS RECIENTES FILTRADAS */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-[#003366]" />
                            Visitas {timeRange === 'hoy' ? 'de Hoy' : 
                                   timeRange === 'semana' ? 'de la Semana' : 
                                   timeRange === 'mes' ? 'del Mes' : 
                                   'del Año'}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {filteredVisitas.length} registros
                            </span>
                            <span className="text-xs text-gray-500">
                                Filtro: {timeRange}
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {filteredVisitas.length > 0 ? (
                            filteredVisitas.slice(0, 5).map((visita) => (
                                <div key={visita.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-[#003366]">{visita.colegio}</p>
                                            <p className="text-sm text-gray-500">Guía: {visita.guia || 'Por asignar'}</p>
                                        </div>
                                        <EstadoVisita estado={visita.estado} />
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {formatDate(visita.fecha)}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {formatTime(visita.hora) || '--:--'}
                                        </div>
                                        <div className="flex items-center">
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No hay visitas para el período seleccionado</p>
                                <p className="text-sm text-gray-400 mt-1">Intenta cambiar el filtro de tiempo</p>
                            </div>
                        )}
                        
                        {filteredVisitas.length > 5 && (
                            <div className="text-center pt-2">
                                <button className="text-sm text-[#003366] font-medium hover:underline flex items-center justify-center mx-auto">
                                    Ver todas las {filteredVisitas.length} visitas
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* REPORTES Y MÉTRICAS GENERALES */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <LineChart className="w-5 h-5 mr-2 text-[#003366]" />
                            Métricas de Desempeño
                        </h3>
                        <div className="flex items-center space-x-2">
                            <Printer className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" onClick={handlePrint} />
                            <span className="text-xs text-gray-500">Actualizado: {new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <Target className="w-4 h-4 mr-2 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Tasa de Conversión</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{metricasGenerales?.tasaConversion || '0%'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Tiempo Promedio</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{metricasGenerales?.tiempoPromedioVisita || '0 horas'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <Users className="w-4 h-4 mr-2 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">Estudiantes/Visita</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{metricasGenerales?.estudiantesPorVisita || 0}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition">
                            <div className="flex items-center mb-2">
                                <Home className="w-4 h-4 mr-2 text-amber-600" />
                                <span className="text-sm font-medium text-gray-700">Colegios Activos</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{metricasGenerales?.colegiosActivos || 0}</p>
                        </div>
                    </div>

                    {/* DISTRIBUCIÓN GEOGRÁFICA */}
                    <div className="mt-6 pt-6 border-t">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-[#003366]" />
                            Distribución por Ciudad
                        </h4>
                        <div className="space-y-3">
                            {(colegiosPorCiudad || []).map((ciudad, index) => (
                                <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-[#003366]' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-[#FFD700]' : 'bg-purple-500'}`}></div>
                                        <span className="text-gray-700">{ciudad.ciudad}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-900 mr-2">{ciudad.cantidad || 0}</span>
                                        <span className="text-xs text-gray-500">colegios</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RESUMEN FINAL */}
            <div className="mt-8 bg-gradient-to-r from-[#003366] to-blue-800 rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center">
                            <TrendingUpIcon className="w-6 h-6 mr-2 text-[#FFD700]" />
                            Resumen del Período ({timeRange === 'hoy' ? 'Hoy' : 
                                                 timeRange === 'semana' ? 'Esta semana' : 
                                                 timeRange === 'mes' ? 'Este mes' : 
                                                 'Este año'})
                        </h3>
                        <p className="text-gray-300">
                            El sistema ha registrado un crecimiento del {Math.abs(tendenciaEstudiantes || 0).toFixed(1)}% en estudiantes 
                            y {tendenciaColegios >= 0 ? 'un aumento' : 'una disminución'} del {Math.abs(tendenciaColegios || 0).toFixed(1)}% en colegios registrados.
                            Se han realizado {filteredVisitas.length} visitas en el período seleccionado con una tasa de conversión del {metricasGenerales?.tasaConversion || '0%'}.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-center md:text-right">
                        <p className="text-3xl font-bold">{totalReportes || 0}</p>
                        <p className="text-gray-300">Reportes generados</p>
                        <p className="text-sm text-gray-400 mt-1">Filtro activo: {timeRange}</p>
                    </div>
                </div>
            </div>

            {/* FOOTER DEL DASHBOARD */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-2 md:mb-0">
                        <p>Última actualización: {new Date().toLocaleString('es-ES')}</p>
                        <p className="mt-1 flex items-center justify-center md:justify-start">
                            <span className="mr-2">Dashboard v1.0</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="ml-2">Sistema conectado - Datos en tiempo real</span>
                        </p>
                    </div>
                    <div className="text-xs text-gray-400">
                        <span className="flex items-center">
                            <Filter className="w-3 h-3 mr-1" />
                            Filtro activo: {timeRange} • 
                            Visitas mostradas: {filteredVisitas.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;