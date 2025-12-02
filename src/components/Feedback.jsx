import React, { useEffect, useState } from 'react';
import { Star, BarChart3, MessageSquare, TrendingUp, Users, Clock, AlertCircle, Sparkles, Quote, ArrowUpRight, Activity, Calendar } from 'lucide-react';
import { motion, useAnimation, animate, useMotionValue, useTransform } from 'framer-motion';

// --- CONFIGURACIÓN DE COLORES & ESTILOS UCB ---
const THEME = {
    primary: '#003366',    // Azul UCB Institucional
    primaryDark: '#002244', 
    accent: '#FFD700',     // Amarillo UCB (Oro)
    accentLight: '#FFF5CC',
    bg: '#F1F5F9',         // Slate-100 para más contraste
    cardBg: '#FFFFFF',     
    textMain: '#0F172A',   
    textMuted: '#64748B',  
    success: '#10B981',    
    warning: '#F59E0B',    
    danger: '#EF4444',     
};

// --- DATOS ESTÁTICOS MEJORADOS ---
const DATA = {
    totalResponses: 125,
    averageRating: 3.96,
    npsScore: 72, // Net Promoter Score simulado
    responseRate: 85, // Porcentaje simulado
    chartData: [
        { rating: '5', label: 'Excelente', count: 50, color: THEME.success },
        { rating: '4', label: 'Bueno', count: 40, color: '#3B82F6' },
        { rating: '3', label: 'Regular', count: 20, color: THEME.accent },
        { rating: '2', label: 'Malo', count: 10, color: THEME.warning },
        { rating: '1', label: 'Pésimo', count: 5, color: THEME.danger },
    ],
    // Simulamos una tendencia de los últimos 7 días
    trendData: [3.2, 3.5, 3.8, 3.6, 4.0, 4.2, 3.96],
    comments: [
        { id: 'c1', comment: 'Excelente organización y guía turística, la visita superó mis expectativas.', timestamp: 'Hace 2 horas', mood: 'positive', author: 'Ana M.' },
        { id: 'c2', comment: 'El proceso de registro al inicio fue un poco lento, pero la experiencia dentro fue genial.', timestamp: 'Hace 5 horas', mood: 'neutral', author: 'Carlos R.' },
        { id: 'c3', comment: 'Me gustó mucho el laboratorio de robótica. ¡Deberían darle más tiempo!', timestamp: 'Ayer', mood: 'positive', author: 'Sofía L.' },
        { id: 'c4', comment: 'El personal es muy amable, pero la señalización dentro del campus puede mejorar.', timestamp: 'Ayer', mood: 'negative', author: 'Jorge B.' },
        { id: 'c5', comment: 'Una experiencia educativa y muy motivadora para mi futuro.', timestamp: 'Hace 2 días', mood: 'positive', author: 'Valeria T.' },
        { id: 'c6', comment: 'La comida de la cafetería estaba fría, ojo con eso.', timestamp: 'Hace 2 días', mood: 'negative', author: 'Pedro P.' },
    ],
};

// --- SUB-COMPONENTES DE ANIMACIÓN ---

// Contador animado (de 0 al número final)
const Counter = ({ value, duration = 2, decimals = 0 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

    useEffect(() => {
        const controls = animate(count, value, { duration: duration, ease: "easeOut" });
        return controls.stop;
    }, [value]);

    return <motion.span>{rounded}</motion.span>;
};

// Tarjeta Base "Bento"
const BentoCard = ({ children, className = "", colSpan = "col-span-1" }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 overflow-hidden relative ${className} ${colSpan}`}
    >
        {children}
    </motion.div>
);

// Barra de Progreso Minimalista
const ProgressBar = ({ value, max, color, label, icon: Icon }) => {
    const percent = (value / max) * 100;
    return (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    {Icon && <Icon size={14} className="text-slate-400" />} {label}
                </span>
                <span className="text-xs font-semibold text-slate-500">{value} ({percent.toFixed(0)}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---

export default function DashboardUCB() {
    const maxCount = Math.max(...DATA.chartData.map(d => d.count));

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-800 pb-12">
            
            {/* 1. TOP NAVBAR (Ancho completo) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#003366] p-2 rounded-lg">
                            <BarChart3 className="text-[#FFD700] w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#003366] tracking-tight leading-none">UCB ANALYTICS</h1>
                            <span className="text-xs text-slate-400 font-medium tracking-wide">PANEL DE CONTROL</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-xs font-bold text-slate-500">Última actualización</span>
                            <span className="text-sm font-bold text-[#003366]">Ahora mismo</span>
                        </div>
                        <button className="bg-[#003366] hover:bg-[#002244] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                            <Calendar size={16} /> Exportar Informe
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. MAIN CONTAINER (Grid Ancho) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.08 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    
                    {/* --- ROW 1: KPI CARDS --- */}
                    
                    {/* Card 1: Score Principal */}
                    <BentoCard colSpan="col-span-1 lg:col-span-2" className="bg-gradient-to-br from-[#003366] to-[#001a33] text-white">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Sparkles size={120} />
                        </div>
                        <div className="flex items-center justify-between h-full relative z-10">
                            <div>
                                <h2 className="text-blue-200 font-medium text-sm uppercase tracking-widest mb-1">Satisfacción Global</h2>
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter">
                                        <Counter value={DATA.averageRating} decimals={2} />
                                    </span>
                                    <div className="flex flex-col mb-2">
                                        <div className="flex text-[#FFD700]">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s<=4 ? "currentColor" : "none"} className={s>4 ? "text-slate-600" : ""} />)}
                                        </div>
                                        <span className="text-sm text-blue-300 font-medium">de 5.0 Estrellas</span>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#FFD700] border border-white/10">
                                    <TrendingUp size={12} /> +0.4 vs mes anterior
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card 2: Total Respuestas */}
                    <BentoCard className="flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-50 rounded-2xl text-[#003366]">
                                <Users size={24} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <ArrowUpRight size={12} /> 12%
                            </span>
                        </div>
                        <div>
                            <span className="text-4xl font-extrabold text-slate-800 block mb-1">
                                <Counter value={DATA.totalResponses} />
                            </span>
                            <span className="text-sm font-medium text-slate-500">Encuestas Totales</span>
                        </div>
                    </BentoCard>

                    {/* Card 3: NPS Score */}
                    <BentoCard className="flex flex-col justify-between border-l-8 border-l-[#FFD700]">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-yellow-50 rounded-2xl text-[#F59E0B]">
                                <Activity size={24} />
                            </div>
                        </div>
                        <div>
                            <span className="text-4xl font-extrabold text-slate-800 block mb-1">
                                <Counter value={DATA.npsScore} />
                            </span>
                            <span className="text-sm font-medium text-slate-500">NPS Score (Excelente)</span>
                        </div>
                    </BentoCard>


                    {/* --- ROW 2: DETAILED CHARTS & FEEDBACK --- */}

                    {/* Chart Section (Ancho) */}
                    <BentoCard colSpan="col-span-1 lg:col-span-3" className="min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Desglose de Calificaciones</h3>
                                <p className="text-sm text-slate-500">Distribución de respuestas por nivel de estrella</p>
                            </div>
                            <div className="hidden sm:flex gap-2">
                                <button className="px-3 py-1 text-xs font-bold bg-[#003366] text-white rounded-md">General</button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Gráfico de Barras */}
                            <div className="space-y-1">
                                {DATA.chartData.map((item, idx) => (
                                    <ProgressBar 
                                        key={idx} 
                                        value={item.count} 
                                        max={125} 
                                        color={item.color} 
                                        label={`${item.label} (${item.rating} ★)`}
                                        icon={Star}
                                    />
                                ))}
                            </div>

                            {/* Gráfico de Tendencia (Simulado visualmente) */}
                            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} /> Tendencia Semanal
                                </h4>
                                <div className="flex items-end justify-between h-40 gap-2 px-2">
                                    {DATA.trendData.map((val, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${(val/5)*100}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="w-full bg-blue-200 rounded-t-md relative group hover:bg-[#003366] transition-colors cursor-pointer"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="border-t border-slate-300 mt-0 w-full"></div>
                                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Comments Feed (Columna derecha) */}
                    <BentoCard colSpan="col-span-1 lg:col-span-1" className="bg-white flex flex-col h-full max-h-[500px] lg:max-h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-50 p-2 rounded-lg text-[#003366]">
                                <MessageSquare size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800">Feedback</h3>
                        </div>
                        
                        <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
                            {DATA.comments.map((c, i) => (
                                <motion.div 
                                    key={c.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group border border-slate-100"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            c.mood === 'positive' ? 'bg-green-50 text-green-600 border-green-100' : 
                                            c.mood === 'negative' ? 'bg-red-50 text-red-600 border-red-100' : 
                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                        }`}>
                                            {c.mood === 'positive' ? 'Positivo' : c.mood === 'negative' ? 'Negativo' : 'Neutral'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Clock size={10} /> {c.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium mb-2">"{c.comment}"</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-[#003366] text-white flex items-center justify-center text-[10px] font-bold">
                                            {c.author.charAt(0)}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-bold">{c.author}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-[#003366] border border-[#003366]/20 rounded-lg hover:bg-[#003366] hover:text-white transition-all">
                            Ver todos los comentarios
                        </button>
                    </BentoCard>

                </motion.div>
            </main>
        </div>
    );
}