import React, { useState, useEffect, useMemo } from 'react';
import { 
    CalendarCheck, // Icono principal de visitas
    User, // Para los guías
    Clock, // Para la hora
    Tag, // Para el estado
    Edit, 
    Trash2, 
    PlusCircle, // Para registro
    Search, // Para filtros
    Filter, // Para opciones
    RotateCw, // Para carga
    CheckCircle, 
    AlertTriangle, 
    X,
    ClipboardList, // Para el historial
    Save, // Para guardar
} from 'lucide-react';

// Colores institucionales
const COLORS = {
    primary: 'bg-[#003366]', // Azul UCB Oscuro (Navy)
    accent: 'bg-[#FFD700]', // Amarillo UCB/Dorado
    textDark: 'text-[#003366]',
    focusAccent: 'focus:ring-[#FFD700]',
    buttonPrimary: 'bg-[#003366] hover:bg-[#004488]',
    buttonAccent: 'bg-[#FFD700] hover:bg-[#E0B800] text-[#003366]',
    statusProgramada: 'bg-blue-100 text-blue-700 border-blue-400',
    statusEnCurso: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    statusFinalizada: 'bg-green-100 text-green-700 border-green-400',
    statusCancelada: 'bg-red-100 text-red-700 border-red-400',
};

// =======================================================
// DATOS MOCK (Simulación de BBDD)
// =======================================================

// Estados posibles según RF-007
const ESTADOS_VISITA = [
    { value: 'Programada', label: 'Programada', color: COLORS.statusProgramada },
    { value: 'En Curso', label: 'En Curso', color: COLORS.statusEnCurso },
    { value: 'Finalizada', label: 'Finalizada', color: COLORS.statusFinalizada },
    { value: 'Cancelada', label: 'Cancelada', color: COLORS.statusCancelada },
];

// Guías disponibles (RF-006)
const GUIAS_DISPONIBLES = [
    { id: 'g001', name: 'Dr. Alejandro Peña' },
    { id: 'g002', name: 'Lic. Sofía Robles' },
    { id: 'g003', name: 'Ing. Javier Téllez' },
    { id: 'g004', name: 'Sra. Patricia Gómez' },
];

// Visitas iniciales (RF-005)
const initialVisitas = [
    { id: 'v001', colegio: 'Colegio San Ignacio', fecha: '2025-11-20', hora: '10:00', guiaId: 'g001', observaciones: 'Reunión con directores al final.', estado: 'Finalizada' },
    { id: 'v002', colegio: 'Unidad Educativa Domingo Savio', fecha: '2025-11-25', hora: '14:30', guiaId: 'g003', observaciones: 'Foco en carreras de ingeniería.', estado: 'En Curso' },
    { id: 'v003', colegio: 'Instituto Americano', fecha: '2025-12-05', hora: '09:00', guiaId: 'g002', observaciones: 'Grupo de 50 estudiantes. Pedido especial: Ciencias Sociales.', estado: 'Programada' },
    { id: 'v004', colegio: 'Liceo Militar', fecha: '2025-12-10', hora: '16:00', guiaId: 'g004', observaciones: 'Visita cancelada por problemas de transporte.', estado: 'Cancelada' },
];

// =======================================================
// COMPONENTES REUTILIZABLES
// =======================================================

// --- Componente de Alerta de Manejo de Errores/Éxito ---
const CustomAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    const style = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700',
    };

    const Icon = type === 'success' ? CheckCircle : AlertTriangle;

    return (
        <div 
            className={`p-4 mb-6 border-l-4 rounded-lg flex items-start animate-fadeIn ${style[type]}`}
            role="alert"
        >
            <Icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-bold">{type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Información'}</p>
                <p className="text-sm">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-opacity-50 transition">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// --- Componente de Badge de Estado (RF-007) ---
const StatusBadge = ({ estado }) => {
    const estadoInfo = ESTADOS_VISITA.find(e => e.value === estado) || ESTADOS_VISITA[0];
    return (
        <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${estadoInfo.color}`}
        >
            <span className="w-2 h-2 mr-2 rounded-full bg-current"></span>
            {estadoInfo.label}
        </span>
    );
};

// --- Helpers para fecha/hora ---
// Normaliza una posible fecha que venga como ISO datetime o YYYY-MM-DD
const normalizeFecha = (fechaRaw) => {
    if (!fechaRaw) return '';
    // Si contiene 'T' es probable que venga como ISO datetime
    if (typeof fechaRaw === 'string' && fechaRaw.includes('T')) {
        try {
            const d = new Date(fechaRaw);
            if (!isNaN(d)) {
                return d.toISOString().slice(0, 10);
            }
        } catch (e) {
            return fechaRaw.slice(0,10);
        }
    }
    // Si ya está en formato YYYY-MM-DD, devolver tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaRaw)) return fechaRaw;
    // Intentar parseo suelto
    try {
        const d2 = new Date(fechaRaw);
        if (!isNaN(d2)) return d2.toISOString().slice(0,10);
    } catch (e) {}
    return '';
};

// Formatea YYYY-MM-DD a DD/MM/YYYY para presentación
const formatFechaDisplay = (fechaIso) => {
    if (!fechaIso) return '';
    const m = fechaIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return fechaIso;
    return `${m[3]}/${m[2]}/${m[1]}`;
};

// =======================================================
// COMPONENTE DE PESTAÑA: REGISTRO Y EDICIÓN (RF-001, RF-002, RF-006)
// =======================================================
const FormularioVisita = ({ visitaToEdit, onSave, onCancel, guias, colegios }) => {
    const isEditing = !!visitaToEdit;
    const initialFormState = {
        colegio: '',
        id_colegio: '',
        fecha: new Date().toISOString().slice(0, 10),
        hora: '10:00',
        guiaId: guias[0]?.id || '',
        observaciones: '',
        estado: 'Programada',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [message, setMessage] = useState({ type: null, text: null });

    useEffect(() => {
        if (visitaToEdit) {
            setFormData(visitaToEdit);
        } else {
            setFormData(initialFormState);
        }
    }, [visitaToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setMessage({ type: null, text: null });
    };

    const validateForm = () => {
        // For new visits require an explicit colegio selection (id_colegio). For editing legacy entries allow colegio name.
        const colegioOk = isEditing ? (formData.colegio || formData.id_colegio) : formData.id_colegio;
        if (!colegioOk || !formData.fecha || !formData.hora || !formData.guiaId || !formData.estado) {
            return 'Por favor, complete todos los campos obligatorios (Colegio, Fecha, Hora, Guía y Estado).';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();

        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        // Guardado real: para nuevos registros hacemos POST a /visits
        setMessage({ type: 'info', text: isEditing ? 'Actualizando visita...' : 'Registrando nueva visita...' });

        try {
            if (isEditing) {
                // En edición, llamar al endpoint PUT /visits/:id
                const token = sessionStorage.getItem('token') || '';
                const updatePayload = {
                    fecha: formData.fecha,
                    hora: formData.hora,
                    id_guia: formData.guiaId,
                    estado: formData.estado,
                    observaciones: formData.observaciones || '',
                    id_colegio: formData.id_colegio || undefined,
                };

                try {
                    const resUpdate = await fetch(`http://localhost:3000/visits/${formData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify(updatePayload),
                    });

                    if (!resUpdate.ok) {
                        const err = await resUpdate.json().catch(() => ({ message: 'Error desconocido' }));
                        setMessage({ type: 'error', text: `No se pudo actualizar la visita: ${err.message || resUpdate.status}` });
                        return;
                    }

                    const updated = await resUpdate.json().catch(() => null);
                    const updatedVisit = updated && (updated.id || updated.id_visita) ? {
                        id: updated.id || updated.id_visita || formData.id,
                        fecha: updated.fecha || formData.fecha,
                        hora: (updated.hora && updated.hora.length === 8) ? updated.hora.slice(0,5) : (updated.hora || formData.hora),
                        guiaId: updated.id_guia || formData.guiaId,
                        guiaNombre: updated.guia_nombre || formData.guiaNombre,
                        id_colegio: updated.id_colegio || formData.id_colegio,
                        colegio: updated.colegio_nombre || formData.colegio,
                        observaciones: updated.observaciones || formData.observaciones,
                        estado: updated.estado || formData.estado,
                    } : formData;

                    onSave(updatedVisit);
                    setMessage({ type: 'success', text: 'Visita actualizada con éxito.' });
                    return;
                } catch (err) {
                    console.error('Error actualizando visita:', err);
                    setMessage({ type: 'error', text: 'Error al actualizar la visita.' });
                    return;
                }
            }

            // Obtener id_usuario desde sessionStorage (usuario autenticado)
            let userObj = null;
            try { userObj = JSON.parse(sessionStorage.getItem('user') || 'null'); } catch (e) { userObj = null; }
            const id_usuario = userObj?.id || userObj?.id_usuario;
            if (!id_usuario) {
                setMessage({ type: 'error', text: 'No se encontró usuario autenticado. Inicia sesión antes de crear una visita.' });
                return;
            }

            const payload = {
                fecha: formData.fecha,
                hora: formData.hora,
                id_guia: formData.guiaId,
                estado: formData.estado,
                observaciones: formData.observaciones || '',
                id_usuario,
                id_colegio: formData.id_colegio,
            };

            const token = sessionStorage.getItem('token') || '';
            const res = await fetch('http://localhost:3000/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
                setMessage({ type: 'error', text: `Error al crear visita: ${err.message || res.status}` });
                return;
            }

            const created = await res.json().catch(() => null);
            const createdVisit = created && (created.id || created.id_visita) ? created : { ...formData, id: created?.id || `v${Date.now()}` };

            onSave(createdVisit);
            setMessage({ type: 'success', text: 'Visita registrada con éxito.' });
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error creando visita:', error);
            setMessage({ type: 'error', text: 'Error al procesar la solicitud de guardado.' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-[#003366] lg:col-span-1">
            <h2 className={`text-2xl font-bold mb-6 ${COLORS.textDark} flex items-center`}>
                {isEditing ? 
                    <>
                        <Edit className="w-6 h-6 mr-3 text-[#FFD700]" />
                        Editar Visita: {formData.colegio}
                    </> 
                    : 
                    <>
                        <PlusCircle className="w-6 h-6 mr-3 text-[#FFD700]" />
                        Registrar Nueva Visita
                    </>
                }
            </h2>
            
            <CustomAlert message={message.text} type={message.type} onClose={() => setMessage({ type: null, text: null })} />
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nombre del Colegio (selección desde API) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colegio / Institución (*)</label>
                    {colegios && colegios.length > 0 ? (
                        <select
                            name="id_colegio"
                            value={formData.id_colegio}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            required
                        >
                            <option value="">Seleccione un colegio</option>
                            {colegios.map(c => (
                                <option key={c.id_colegio} value={c.id_colegio}>{c.nombre}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="colegio"
                            value={formData.colegio}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            placeholder="Ej: Colegio Don Bosco"
                            required
                        />
                    )}
                </div>

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (*)</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora (*)</label>
                        <input
                            type="time"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            required
                        />
                    </div>
                </div>

                {/* Asignación de Guía (RF-006) y Control de Estado (RF-007) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guía Asignado (*)</label>
                        <select
                            name="guiaId"
                            value={formData.guiaId}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            required
                        >
                            {guias.map(guia => (
                                <option key={guia.id} value={guia.id}>{guia.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Visita (*)</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                            required
                        >
                            {ESTADOS_VISITA.map(estado => (
                                <option key={estado.value} value={estado.value}>{estado.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Observaciones (RF-001) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-3 border border-gray-300 rounded-lg ${COLORS.focusAccent}/50 focus:border-[#003366] transition duration-150`}
                        placeholder="Detalles adicionales, foco de la visita, etc."
                    ></textarea>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end space-x-4 pt-4">
                    {isEditing && (
                         <button
                            type="button"
                            onClick={onCancel}
                            className={`px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 flex items-center`}
                            disabled={message.type === 'info'}
                        >
                            <X className="w-5 h-5 mr-2" />
                            Cancelar Edición
                        </button>
                    )}
                    <button
                        type="submit"
                        className={`px-6 py-3 ${COLORS.buttonPrimary} text-white font-bold rounded-lg shadow-xl transition duration-300 flex items-center justify-center`}
                        disabled={message.type === 'info'}
                    >
                        {message.type === 'info' ? (
                            <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {isEditing ? 'Guardar Cambios' : 'Registrar Visita'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// =======================================================
// COMPONENTE DE PESTAÑA: HISTORIAL Y GESTIÓN (RF-005, RF-002)
// =======================================================
const HistorialVisitas = ({ visitas, guias, colegios, onEdit, onDelete, onUpdateStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGuia, setFilterGuia] = useState('');
    const [filterColegio, setFilterColegio] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [message, setMessage] = useState({ type: null, text: null });

    // Mapeo para nombres de guías
    const guiaMap = useMemo(() => {
        return guias.reduce((acc, guia) => {
            acc[guia.id] = guia.name;
            return acc;
        }, {});
    }, [guias]);

    // Filtrado y búsqueda del historial (RF-005)
    const filteredVisitas = useMemo(() => {
        return visitas
            .filter(visita => {
                const colegioText = (visita.colegio || '').toLowerCase();
                const guiaText = (visita.guiaNombre || guiaMap[visita.guiaId] || '').toLowerCase();
                const searchMatch = (
                    colegioText.includes(searchTerm.toLowerCase()) ||
                    guiaText.includes(searchTerm.toLowerCase()) ||
                    (visita.fecha || '').includes(searchTerm)
                );

                const guiaMatch = filterGuia ? String(visita.guiaId) === String(filterGuia) : true;
                const colegioMatch = filterColegio ? String(visita.id_colegio) === String(filterColegio) : true;
                const estadoMatch = filterEstado ? visita.estado === filterEstado : true;

                return searchMatch && guiaMatch && colegioMatch && estadoMatch;
            })
            // Ordenar por fecha más reciente primero
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [visitas, searchTerm, filterGuia, filterColegio, filterEstado, guiaMap]);

    // Eliminación real via API (RF-002)
    const handleDelete = async (visita) => {
        if (!window.confirm(`¿Está seguro de que desea eliminar la visita del ${visita.colegio} el ${visita.fecha}?`)) return;
        setMessage({ type: 'info', text: 'Eliminando visita...' });
        try {
            const token = sessionStorage.getItem('token') || '';
            const res = await fetch(`http://localhost:3000/visits/${visita.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
                setMessage({ type: 'error', text: `No se pudo eliminar la visita: ${err.message || res.status}` });
                return;
            }
            onDelete(visita.id);
            setMessage({ type: 'success', text: `Visita de ${visita.colegio} eliminada con éxito.` });
        } catch (err) {
            console.error('Error eliminando visita:', err);
            setMessage({ type: 'error', text: 'Error al eliminar la visita.' });
        }
    };

    // Manejo de cambio de estado rápido (RF-007)
    const handleStatusChange = async (visitaId, newStatus) => {
        setMessage({ type: 'info', text: 'Actualizando estado...' });
        try {
            const token = sessionStorage.getItem('token') || '';
            const res = await fetch(`http://localhost:3000/visits/${visitaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ estado: newStatus })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
                setMessage({ type: 'error', text: `No se pudo actualizar estado: ${err.message || res.status}` });
                return;
            }
            // Actualizar en memoria
            onUpdateStatus(visitaId, newStatus);
            const statusLabel = ESTADOS_VISITA.find(e => e.value === newStatus)?.label;
            setMessage({ type: 'success', text: `Estado de la visita ${visitaId} actualizado a "${statusLabel}".` });
        } catch (err) {
            console.error('Error actualizando estado:', err);
            setMessage({ type: 'error', text: 'Error actualizando estado de la visita.' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-8 border-[#FFD700] lg:col-span-2">
            <h2 className={`text-2xl font-bold mb-6 ${COLORS.textDark} flex items-center`}>
                <ClipboardList className="w-6 h-6 mr-3 text-[#003366]" />
                Historial de Visitas Programadas
            </h2>

            <CustomAlert message={message.text} type={message.type} onClose={() => setMessage({ type: null, text: null })} />

            {/* Controles de Filtro y Búsqueda */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                
                {/* Búsqueda general */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por colegio, guía o fecha..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#003366] ${COLORS.focusAccent}/50 transition duration-150`}
                    />
                </div>

                {/* Filtro por Guía (RF-006) */}
                <div className="md:w-1/4 relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                        value={filterGuia}
                        onChange={(e) => setFilterGuia(e.target.value)}
                        className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#003366] ${COLORS.focusAccent}/50 transition duration-150 appearance-none bg-white`}
                    >
                        <option value="">Todos los Guías</option>
                        {guias.map(guia => (
                            <option key={guia.id} value={guia.id}>{guia.name}</option>
                        ))}
                    </select>
                </div>
                {/* Filtro por Colegio */}
                <div className="md:w-1/4 relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                        value={filterColegio}
                        onChange={(e) => setFilterColegio(e.target.value)}
                        className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#003366] ${COLORS.focusAccent}/50 transition duration-150 appearance-none bg-white`}
                    >
                        <option value="">Todos los Colegios</option>
                        {colegios && colegios.map(c => (
                            <option key={c.id_colegio} value={c.id_colegio}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                
                {/* Filtro por Estado (RF-007) */}
                <div className="md:w-1/4 relative">
                    <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#003366] ${COLORS.focusAccent}/50 transition duration-150 appearance-none bg-white`}
                    >
                        <option value="">Todos los Estados</option>
                        {ESTADOS_VISITA.map(estado => (
                            <option key={estado.value} value={estado.value}>{estado.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabla de Historial (RF-005) */}
            <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={COLORS.primary}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Colegio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Guía</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredVisitas.length > 0 ? (
                            filteredVisitas.map((visita) => (
                                <tr key={visita.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {visita.colegio}
                                        <p className="text-xs text-gray-500 truncate mt-1 max-w-xs">{visita.observaciones || 'Sin observaciones.'}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatFechaDisplay(visita.fecha)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {visita.hora}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {visita.guiaNombre || guiaMap[visita.guiaId] || 'Guía Desconocido'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <StatusBadge estado={visita.estado} />
                                            {/* Selector rápido de estado (RF-007) */}
                                            <select
                                                value={visita.estado}
                                                onChange={(e) => handleStatusChange(visita.id, e.target.value)}
                                                className="block w-auto py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none text-xs"
                                            >
                                                {ESTADOS_VISITA.map(estado => (
                                                    <option key={estado.value} value={estado.value} disabled={estado.value === visita.estado}>
                                                        {estado.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <button 
                                                onClick={() => onEdit(visita)} 
                                                className={`text-[#003366] hover:text-blue-700 p-2 rounded-full transition hover:bg-gray-100`}
                                                title="Editar Visita"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(visita)} 
                                                className="text-red-600 hover:text-red-800 p-2 rounded-full transition hover:bg-red-50"
                                                title="Eliminar Visita"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">
                                    No se encontraron visitas que coincidan con los filtros aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// =======================================================
// COMPONENTE PRINCIPAL: GESTIÓN DE VISITAS
// =======================================================

const GestionVisitas = () => {
    // Estado de visitas (se cargan desde backend)
    const [visitas, setVisitas] = useState([]);
    const [colegios, setColegios] = useState([]);
    const [guiasList, setGuiasList] = useState([]);
    // Estado para saber si estamos editando o registrando
    const [visitaToEdit, setVisitaToEdit] = useState(null);
    // Estado para controlar las pestañas
    const [activeTab, setActiveTab] = useState('historial');
    
    // Al seleccionar una visita para editar, cambiamos a la pestaña de formulario
    const handleEdit = (visita) => {
        setVisitaToEdit(visita);
        setActiveTab('formulario');
    };

    // Al cancelar, volvemos a la pestaña de historial y limpiamos la edición
    const handleCancelEdit = () => {
        setVisitaToEdit(null);
        setActiveTab('historial');
    };

    // Lógica para guardar o actualizar una visita (RF-001, RF-002)
    const handleSave = (formData) => {
        if (formData.id) {
            // Actualizar en memoria (se espera que FormularioVisita haga PUT al backend)
            setVisitas(prev => prev.map(v => v.id === formData.id ? { ...v, ...formData } : v));
            setVisitaToEdit(null); // Terminar edición
            setActiveTab('historial');
        } else {
            // Registrar nuevo (creado por la API y retornado a onSave)
            const colegioNombre = formData.id_colegio ? (colegios.find(c => c.id_colegio === formData.id_colegio)?.nombre || formData.colegio) : formData.colegio;
            const newVisita = { ...formData, colegio: colegioNombre, id: formData.id || `v${Date.now()}` };
            setVisitas(prev => [newVisita, ...prev]);
        }
    };

    // Lógica para eliminar una visita (RF-002)
    const handleDelete = (id) => {
        setVisitas(prev => prev.filter(v => v.id !== id));
    };

    // Lógica para actualizar el estado (RF-007)
    const handleUpdateStatus = (id, newStatus) => {
        setVisitas(prev => prev.map(v => v.id === id ? { ...v, estado: newStatus } : v));
    };

    // Cargar colegios y guías simples desde el backend
    useEffect(() => {
        const token = sessionStorage.getItem('token') || '';

        // Colegios
        fetch('http://localhost:3000/colegios/simple', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
            if (Array.isArray(data)) setColegios(data);
        })
        .catch(err => console.error('Error cargando colegios:', err));

        // Guías
        fetch('http://localhost:3000/guias/simple', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
            if (Array.isArray(data)) {
                // Map backend shape { id_guia, nombre, apellido } to { id, name }
                const mapped = data.map(g => ({ id: g.id_guia, name: `${g.nombre} ${g.apellido}` }));
                setGuiasList(mapped);
            }
        })
        .catch(err => console.error('Error cargando guías:', err));
        
        // Visitas
        fetch('http://localhost:3000/visits', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
                if (Array.isArray(data)) {
                // Normalizar visitas a la forma usada por la UI
                const mapped = data.map(v => ({
                    id: v.id || v.id_visita || v._id || String(v.id) || `v${Date.now()}${Math.random()}`,
                    fecha: normalizeFecha(v.fecha),
                    hora: v.hora && v.hora.length === 8 ? v.hora.slice(0,5) : (v.hora || ''),
                    guiaId: v.id_guia || v.guiaId || v.guia_id,
                    guiaNombre: v.guia_nombre || `${v.guia_nombre || ''}`,
                    id_colegio: v.id_colegio || v.colegioId,
                    colegio: v.colegio_nombre || v.colegio || v.nombre_colegio || '',
                    observaciones: v.observaciones || v.notas || '',
                    estado: v.estado || 'Programada',
                }));
                setVisitas(mapped);
            }
        })
        .catch(err => console.error('Error cargando visitas:', err));
    }, []);


    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans animate-fadeIn">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
            
            {/* Encabezado */}
            <div className="mb-8 pb-4 border-b border-gray-200">
                <h1 className={`text-4xl font-extrabold ${COLORS.textDark} flex items-center`}>
                    <CalendarCheck className="w-8 h-8 mr-3 text-[#FFD700]" />
                    Módulo de Gestión de Visitas
                </h1>
                <p className="text-gray-500 mt-1">
                    Control centralizado de registro, asignación y seguimiento de visitas de colegios.
                </p>
            </div>

            {/* Navegación de Pestañas */}
            <div className="flex mb-6 border-b border-gray-200">
                <button
                    onClick={() => { setActiveTab('historial'); setVisitaToEdit(null); }}
                    className={`py-3 px-6 text-lg font-semibold transition-colors duration-200 flex items-center ${
                        activeTab === 'historial' 
                        ? `${COLORS.textDark} border-b-4 border-[#FFD700]` 
                        : 'text-gray-500 hover:text-[#003366]'
                    }`}
                >
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Historial y Gestión
                </button>
                <button
                    onClick={() => setActiveTab('formulario')}
                    className={`py-3 px-6 text-lg font-semibold transition-colors duration-200 flex items-center ${
                        activeTab === 'formulario' 
                        ? `${COLORS.textDark} border-b-4 border-[#FFD700]` 
                        : 'text-gray-500 hover:text-[#003366]'
                    }`}
                >
                    {visitaToEdit ? 
                        <><Edit className="w-5 h-5 mr-2" /> Editar Visita</> 
                        : 
                        <><PlusCircle className="w-5 h-5 mr-2" /> Registrar Nueva</>
                    }
                </button>
            </div>

            {/* Contenido de la Pestaña */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'formulario' && (
                    <div className="lg:col-span-3">
                        <FormularioVisita 
                            visitaToEdit={visitaToEdit} 
                            onSave={handleSave} 
                            onCancel={handleCancelEdit} 
                            guias={guiasList}
                            colegios={colegios}
                        />
                    </div>
                )}

                {activeTab === 'historial' && (
                    <div className="lg:col-span-3">
                        <HistorialVisitas 
                            visitas={visitas} 
                            guias={guiasList} 
                            colegios={colegios}
                            onEdit={handleEdit} 
                            onDelete={handleDelete}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};

export default GestionVisitas;