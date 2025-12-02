import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
    School, Plus, Edit, Trash2, Search, X, Save, UploadCloud, AlertCircle, 
    Clipboard, Check, List, MapPin, User, ChevronLeft, Users, Hash, Mail, FileText, 
    UserPlus, FileCheck
} from 'lucide-react';

// --- CONFIGURACIÓN Y ESTILOS INSTITUCIONALES ---
const UCB_COLORS = {
    primary: 'bg-[#003366]', 
    primaryText: 'text-[#003366]',
    accent: 'bg-[#FFD700]', 
    accentText: 'text-[#FFD700]',
    buttonPrimary: 'bg-[#003366] hover:bg-[#004488]',
    buttonAccent: 'bg-[#FFD700] hover:bg-[#E0B800] text-[#003366]',
    buttonDanger: 'bg-red-600 hover:bg-red-700',
};

// --- SIMULACIÓN DE DATOS INICIALES ---
// Initial empty: we'll load from API
const initialColleges = [];
const initialStudents = [];

// --- ESTRUCTURAS DE DATOS DE FORMULARIO ---
const initialCollegeFormData = { id: null, nombre: '', direccion: '', contacto: '', telefono: '' };
const initialStudentFormData = { id: null, collegeId: null, nombre: '', ci: '', email: '' };

// --- COMPONENTE SEPARADO: MODAL DE COLEGIO ---
const CollegeFormModal = ({ 
    show, 
    isEditing, 
    formData, 
    onClose, 
    onSubmit, 
    onChange 
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className={`text-[#003366] text-2xl font-extrabold flex items-center`}>
                        {isEditing ? <Edit className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                        {isEditing ? 'Editar Colegio (RF-003)' : 'Registrar Nuevo Colegio (RF-003)'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Colegio</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={onChange} placeholder="Nombre" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><MapPin className='w-4 h-4 mr-1 text-gray-500'/> Dirección</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={onChange} placeholder="Ej: Avenida 6 de Agosto #1234" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><User className='w-4 h-4 mr-1 text-gray-500'/> Persona de Contacto</label>
                        <input type="text" name="contacto" value={formData.contacto} onChange={onChange} placeholder="Ej: Lic. María Durán" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input type="tel" name="telefono" value={formData.telefono} onChange={onChange} placeholder="Ej: 77712345" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>

                    <button type="submit" className={`w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-[#003366] hover:bg-[#004488] text-white`}>
                        <Save className="w-5 h-5 mr-2" />
                        {isEditing ? 'Guardar Cambios' : 'Registrar Colegio'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENTE SEPARADO: MODAL DE ESTUDIANTE ---
const StudentFormModal = ({ 
    show, 
    isEditing, 
    formData, 
    onClose, 
    onSubmit, 
    onChange 
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className={`text-[#003366] text-xl font-extrabold flex items-center`}>
                        {isEditing ? <Edit className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        {isEditing ? 'Editar Estudiante' : 'Añadir Estudiante (RF-004)'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={onChange} placeholder="Nombre y Apellido" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><FileText className='w-4 h-4 mr-1 text-gray-500'/> Cédula de Identidad (CI)</label>
                        <input type="text" name="ci" value={formData.ci} onChange={onChange} placeholder="Ej: 1234567LP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><Mail className='w-4 h-4 mr-1 text-gray-500'/> Email</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="ejemplo@correo.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none" required />
                    </div>

                    <button type="submit" className={`w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-[#003366] hover:bg-[#004488] text-white`}>
                        <Save className="w-5 h-5 mr-2" />
                        {isEditing ? 'Guardar Cambios' : 'Registrar Estudiante'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const GestionColegiosYEstudiantes = () => {
    // --- ESTADO GENERAL ---
    const [view, setView] = useState('list_colleges'); // 'list_colleges' o 'manage_students'
    const [colegios, setColegios] = useState(initialColleges);
    const [estudiantes, setEstudiantes] = useState(initialStudents);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [message, setMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Referencia para el input de archivo
    const fileInputRef = useRef(null);

    // Cargar colegios y estudiantes desde la API al montar el componente
    useEffect(() => {
        const token = sessionStorage.getItem('token') || '';

        // Colegios - usar /colegios en lugar de /colegios/simple para obtener más información
        fetch('http://localhost:3000/colegios', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
            if (Array.isArray(data)) {
                // Normalize: ensure each colegio has id and proper fields
                const mapped = data.map(c => ({
                    id: c.id || c.id_colegio || c._id || String(Math.random()),
                    id_colegio: c.id_colegio || c.id || c._id || null,
                    nombre: c.nombre || '',
                    direccion: c.direccion || c.ciudad || '',
                    contacto: c.contacto || '',
                    telefono: c.telefono || '',
                }));
                setColegios(mapped);
                console.log('Colegios cargados:', mapped);
            }
        })
        .catch(err => console.error('Error cargando colegios:', err));

        // Estudiantes
        fetch('http://localhost:3000/estudiantes', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
            if (Array.isArray(data)) {
                // Normalizar campos: correo -> email, id_colegio, colegio_nombre -> colegio
                const mapped = data.map(s => ({
                    id: s.id || s.id_estudiante || String(s.id),
                    nombre: s.nombre,
                    ci: s.ci,
                    email: s.correo || s.email,
                    collegeId: s.id_colegio || s.collegeId || null,
                    colegio: s.colegio_nombre || s.colegio || '',
                    curso: s.curso || s.grade || null,
                    edad: s.edad || null,
                }));
                setEstudiantes(mapped);
            }
        })
        .catch(err => console.error('Error cargando estudiantes:', err));
    }, []);
    
    // --- ESTADO DE MODALES Y FORMULARIOS ---
    const [showCollegeModal, setShowCollegeModal] = useState(false);
    const [collegeFormData, setCollegeFormData] = useState(initialCollegeFormData);
    const [isCollegeEditing, setIsCollegeEditing] = useState(false);
    
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentFormData, setStudentFormData] = useState(initialStudentFormData);
    const [isStudentEditing, setIsStudentEditing] = useState(false);

    // --- MANEJO DE MENSAJES DE RETROALIMENTACIÓN ---
    const showFeedback = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 7000); // 7 segundos para mensajes de carga
    };

    // --- RF-003: LÓGICA CRUD DE COLEGIOS ---

    const handleCollegeChange = useCallback((e) => {
        setCollegeFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSaveCollege = useCallback((e) => {
        e.preventDefault();
        
        // 1. Validar duplicados (por nombre)
        const isDuplicate = colegios.some(c => 
            c.nombre.toLowerCase() === collegeFormData.nombre.toLowerCase() && c.id !== collegeFormData.id
        );
        if (isDuplicate) {
            showFeedback('error', `El colegio "${collegeFormData.nombre}" ya existe.`);
            return;
        }

        const token = sessionStorage.getItem('token') || '';
        if (isCollegeEditing) {
            // PUT /colegios/:id
            fetch(`http://localhost:3000/colegios/${collegeFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: collegeFormData.nombre, direccion: collegeFormData.direccion, contacto: collegeFormData.contacto, telefono: collegeFormData.telefono })
            })
            .then(r => {
                if (!r.ok) throw r;
                return r.json().catch(() => collegeFormData);
            })
            .then(updated => {
                const up = updated || collegeFormData;
                const mapped = { ...up, id: up.id || up.id_colegio || up._id || collegeFormData.id, id_colegio: up.id_colegio || up.id || up._id || collegeFormData.id };
                setColegios(prev => prev.map(c => c.id === collegeFormData.id ? mapped : c));
                showFeedback('success', `Colegio "${collegeFormData.nombre}" actualizado.`);
                setShowCollegeModal(false);
                setCollegeFormData(initialCollegeFormData);
            })
            .catch(err => {
                console.error('Error actualizando colegio:', err);
                showFeedback('error', 'No se pudo actualizar el colegio.');
            });
        } else {
            // POST /colegios
            fetch('http://localhost:3000/colegios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: collegeFormData.nombre, direccion: collegeFormData.direccion, contacto: collegeFormData.contacto, telefono: collegeFormData.telefono })
            })
            .then(r => {
                if (!r.ok) throw r;
                return r.json();
            })
            .then(created => {
                const c = created || { ...collegeFormData, id: Date.now().toString() };
                const toAdd = { ...c, id: c.id || c.id_colegio || c._id || Date.now().toString(), id_colegio: c.id_colegio || c.id || c._id || null };
                setColegios(prev => [...prev, toAdd]);
                showFeedback('success', `Colegio "${toAdd.nombre}" registrado exitosamente.`);
                setShowCollegeModal(false);
                setCollegeFormData(initialCollegeFormData);
            })
            .catch(err => {
                console.error('Error creando colegio:', err);
                showFeedback('error', 'No se pudo crear el colegio.');
            });
        }
    }, [collegeFormData, colegios, isCollegeEditing]);

    const handleEditCollege = useCallback((college) => {
        setCollegeFormData(college);
        setIsCollegeEditing(true);
        setShowCollegeModal(true);
    }, []);

    const handleDeleteCollege = useCallback((id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar el colegio "${nombre}"? También se eliminarán sus estudiantes asociados.`)) {
            const token = sessionStorage.getItem('token') || '';
            fetch(`http://localhost:3000/colegios/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            })
            .then(r => {
                if (!r.ok) throw r;
                // Backend deleted; update UI
                setColegios(prev => prev.filter(c => String(c.id) !== String(id)));
                setEstudiantes(prev => prev.filter(s => String(s.collegeId) !== String(id)));
                showFeedback('success', `Colegio "${nombre}" y sus estudiantes han sido eliminados.`);
            })
            .catch(err => {
                console.error('Error eliminando colegio:', err);
                showFeedback('error', 'No se pudo eliminar el colegio.');
            });
        }
    }, []);
    
    const openNewCollegeModal = useCallback(() => {
        setCollegeFormData(initialCollegeFormData);
        setIsCollegeEditing(false);
        setShowCollegeModal(true);
    }, []);

    // --- LÓGICA DE BÚSQUEDA Y FILTRADO DE COLEGIOS ---
    const filteredColleges = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return colegios.filter(colegio => 
            colegio.nombre.toLowerCase().includes(lowerCaseSearch) ||
            (colegio.direccion || '').toLowerCase().includes(lowerCaseSearch) ||
            colegio.contacto.toLowerCase().includes(lowerCaseSearch)
        ).sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [colegios, searchTerm]);

    // --- RF-004: LÓGICA DE GESTIÓN DE ESTUDIANTES ---

    const goToStudentManagement = useCallback((college) => {
        setSelectedCollege(college);
        setSearchTerm('');
        setView('manage_students');
    }, []);

    const filteredStudents = useMemo(() => {
        if (!selectedCollege) return [];
        const collegeStudents = estudiantes.filter(s => String(s.collegeId) === String(selectedCollege.id));

        const lowerCaseSearch = searchTerm.toLowerCase();
        return collegeStudents.filter(student => 
            student.nombre.toLowerCase().includes(lowerCaseSearch) ||
            student.ci.toLowerCase().includes(lowerCaseSearch) ||
            student.email.toLowerCase().includes(lowerCaseSearch)
        ).sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [estudiantes, selectedCollege, searchTerm]);
    
    // --- LÓGICA DE CARGA DE ARCHIVOS (CSV) ---

    // Función pura JS para parsear CSV
    const parseCSV = (csvText, collegeId) => {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return { students: [], errors: ['El archivo CSV está vacío.'] };

        // Cabeceras esperadas
        const expectedHeaders = ['nombre', 'ci', 'email'];
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        // Mapear índices de las cabeceras
        const headerMap = {};
        expectedHeaders.forEach(expected => {
            headerMap[expected] = headers.indexOf(expected);
        });

        // Validar que las cabeceras requeridas existan
        if (Object.values(headerMap).some(index => index === -1)) {
            return { students: [], errors: [`El archivo debe contener las columnas: ${expectedHeaders.join(', ')}.`] };
        }

        const newStudents = [];
        const errors = [];
        const existingCIs = new Set(estudiantes.map(s => s.ci));
        const currentBatchCIs = new Set();
        
        // Procesar filas de datos (a partir de la línea 1)
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            
            // Validar número de columnas
            if (values.length < expectedHeaders.length) {
                errors.push(`Fila ${i + 1}: Datos incompletos.`);
                continue;
            }

            const studentData = {
                id: Date.now().toString() + '-' + i, // Generar ID único temporal
                collegeId: collegeId,
                nombre: values[headerMap['nombre']] || '',
                ci: values[headerMap['ci']] || '',
                email: values[headerMap['email']] || '',
            };
            
            // Criterio de Aceptación: Validar datos incompletos
            if (!studentData.nombre || !studentData.ci || !studentData.email) {
                errors.push(`Fila ${i + 1} (${studentData.ci}): Campos nombre, ci o email están vacíos.`);
                continue;
            }
            
            // Criterio de Aceptación: Validar datos duplicados (CI) en la base de datos existente
            if (existingCIs.has(studentData.ci)) {
                errors.push(`Fila ${i + 1} (${studentData.ci}): CI duplicado (ya existe en el sistema).`);
                continue;
            }

            // Validar duplicados dentro del lote actual (por si el archivo tiene duplicados)
            if (currentBatchCIs.has(studentData.ci)) {
                errors.push(`Fila ${i + 1} (${studentData.ci}): CI duplicado dentro del archivo.`);
                continue;
            }
            
            currentBatchCIs.add(studentData.ci);
            newStudents.push(studentData);
        }

        return { students: newStudents, errors };
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file || !selectedCollege) {
            showFeedback('error', 'Por favor, selecciona un archivo y asegúrate de que un colegio esté seleccionado.');
            return;
        }

        // Criterio de Aceptación: Permite subir listas (limitado a CSV en este ejemplo)
        if (!file.name.toLowerCase().endsWith('.csv')) {
            showFeedback('error', 'Formato de archivo no soportado. Por favor, sube un archivo CSV.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const { students: newStudents, errors } = parseCSV(csvText, selectedCollege.id);

                if (errors.length > 0) {
                    const errorSummary = errors.slice(0, 5).join('; ') + (errors.length > 5 ? `... y ${errors.length - 5} errores más.` : '');
                    showFeedback('error', `Error en la carga del archivo. ${errors.length} problemas encontrados: ${errorSummary}`);
                    // Opcional: Podrías mostrar los errores detallados en otro modal
                    return;
                }

                if (newStudents.length === 0) {
                     showFeedback('error', 'El archivo no contiene datos válidos o únicos para cargar.');
                     return;
                }

                // Enviar cada estudiante al backend (POST /estudiantes)
                const token = sessionStorage.getItem('token') || '';
                const created = [];
                const failed = [];
                const promises = newStudents.map(s => {
                    const body = { nombre: s.nombre, ci: s.ci, correo: s.email, id_colegio: s.collegeId };
                    return fetch('http://localhost:3000/estudiantes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                        body: JSON.stringify(body)
                    })
                    .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err)))
                    .then(createdStudent => { created.push(createdStudent); })
                    .catch(err => { failed.push({ student: s, error: err }); });
                });

                Promise.all(promises).then(() => {
                    if (created.length > 0) {
                        // Normalizar y añadir
                        const mapped = created.map(s => ({ id: s.id || s.id_estudiante || String(s.id), nombre: s.nombre, ci: s.ci, email: s.correo || s.email, collegeId: s.id_colegio }));
                        setEstudiantes(prev => [...prev, ...mapped]);
                    }
                    if (failed.length > 0) {
                        showFeedback('error', `Algunos registros fallaron: ${failed.length} errores. Revisa la consola.`);
                        console.error('Errores al crear estudiantes desde CSV:', failed);
                    } else {
                        showFeedback('success', `¡Carga de lista exitosa! Se registraron ${created.length} nuevos estudiantes.`);
                    }
                });

            } catch (error) {
                console.error("Error al procesar el archivo CSV:", error);
                showFeedback('error', 'Ocurrió un error inesperado al procesar el archivo.');
            }
        };
        
        reader.onerror = () => {
            showFeedback('error', 'Error al leer el archivo.');
        };

        reader.readAsText(file);
        // Limpiar el input para permitir cargar el mismo archivo dos veces
        event.target.value = null; 
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };


    // CRUD de Estudiantes
    const handleStudentChange = useCallback((e) => {
        setStudentFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSaveStudent = useCallback((e) => {
        e.preventDefault();

        // Validar duplicados local
        const isDuplicate = estudiantes.some(s => s.ci === studentFormData.ci && s.id !== studentFormData.id);
        if (isDuplicate) {
            showFeedback('error', `Ya existe un estudiante con el CI: ${studentFormData.ci}.`);
            return;
        }

        const token = sessionStorage.getItem('token') || '';

        if (isStudentEditing) {
            // PUT /estudiantes/:id
            fetch(`http://localhost:3000/estudiantes/${studentFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: studentFormData.nombre, ci: studentFormData.ci, correo: studentFormData.email, curso: studentFormData.curso, edad: studentFormData.edad, id_colegio: studentFormData.collegeId })
            })
            .then(r => {
                if (!r.ok) throw r;
                return r.json().catch(() => studentFormData);
            })
            .then(updated => {
                const mapped = updated ? { id: updated.id || studentFormData.id, nombre: updated.nombre || studentFormData.nombre, ci: updated.ci || studentFormData.ci, email: updated.correo || studentFormData.email, collegeId: updated.id_colegio || studentFormData.collegeId, colegio: updated.colegio_nombre || studentFormData.colegio } : studentFormData;
                setEstudiantes(prev => prev.map(s => s.id === studentFormData.id ? mapped : s));
                showFeedback('success', `Estudiante "${mapped.nombre}" actualizado.`);
                setShowStudentModal(false);
                setStudentFormData(initialStudentFormData);
            })
            .catch(err => {
                console.error('Error actualizando estudiante:', err);
                showFeedback('error', 'No se pudo actualizar el estudiante.');
            });
        } else {
            // POST /estudiantes
            const body = { nombre: studentFormData.nombre, ci: studentFormData.ci, correo: studentFormData.email, id_colegio: selectedCollege.id, curso: studentFormData.curso, edad: studentFormData.edad };
            fetch('http://localhost:3000/estudiantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(body)
            })
            .then(r => {
                if (!r.ok) throw r;
                return r.json();
            })
            .then(created => {
                const mapped = { id: created.id || created.id_estudiante || String(created.id) || Date.now().toString(), nombre: created.nombre || studentFormData.nombre, ci: created.ci || studentFormData.ci, email: created.correo || studentFormData.email, collegeId: created.id_colegio || selectedCollege.id, colegio: selectedCollege.nombre };
                setEstudiantes(prev => [...prev, mapped]);
                showFeedback('success', `Estudiante "${mapped.nombre}" añadido exitosamente.`);
                setShowStudentModal(false);
                setStudentFormData(initialStudentFormData);
            })
            .catch(err => {
                console.error('Error creando estudiante:', err);
                showFeedback('error', 'No se pudo crear el estudiante.');
            });
        }
    }, [studentFormData, estudiantes, isStudentEditing, selectedCollege]);

    const handleEditStudent = useCallback((student) => {
        setStudentFormData(student);
        setIsStudentEditing(true);
        setShowStudentModal(true);
    }, []);

    const handleDeleteStudent = useCallback((id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar a "${nombre}" de la lista?`)) {
            const token = sessionStorage.getItem('token') || '';
            fetch(`http://localhost:3000/estudiantes/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            })
            .then(r => {
                if (!r.ok) throw r;
                setEstudiantes(prev => prev.filter(s => s.id !== id));
                showFeedback('success', `Estudiante "${nombre}" eliminado.`);
            })
            .catch(err => {
                console.error('Error eliminando estudiante:', err);
                showFeedback('error', 'No se pudo eliminar el estudiante.');
            });
        }
    }, []);
    
    const openNewStudentModal = useCallback(() => {
        setStudentFormData({ ...initialStudentFormData, collegeId: selectedCollege.id });
        setIsStudentEditing(false);
        setShowStudentModal(true);
    });

    // --- COMPONENTES UI: MODAL DE FORMULARIO DE COLEGIO ---

    const CollegeFormModal = () => {
        if (!showCollegeModal) return null;
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={() => setShowCollegeModal(false)}>
                <div 
                    className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h3 className={`${UCB_COLORS.primaryText} text-2xl font-extrabold flex items-center`}>
                            {isCollegeEditing ? <Edit className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                            {isCollegeEditing ? 'Editar Colegio' : 'Registrar Nuevo Colegio'}
                        </h3>
                        <button onClick={() => setShowCollegeModal(false)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveCollege} className="mt-4 space-y-4">
                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Colegio</label>
                            <input type="text" name="nombre" value={collegeFormData.nombre} onChange={handleCollegeChange} placeholder="Nombre" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo Ciudad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center"><MapPin className='w-4 h-4 mr-1 text-gray-500'/> Ubicación (Ciudad)</label>
                            <input type="text" name="ciudad" value={collegeFormData.ciudad} onChange={handleCollegeChange} placeholder="Ej: La Paz" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo Contacto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center"><User className='w-4 h-4 mr-1 text-gray-500'/> Persona de Contacto</label>
                            <input type="text" name="contacto" value={collegeFormData.contacto} onChange={handleCollegeChange} placeholder="Ej: Lic. María Durán" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="tel" name="telefono" value={collegeFormData.telefono} onChange={handleCollegeChange} placeholder="Ej: 77712345" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>

                        <button type="submit" className={`w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 ${UCB_COLORS.buttonPrimary} text-white`}>
                            <Save className="w-5 h-5 mr-2" />
                            {isCollegeEditing ? 'Guardar Cambios' : 'Registrar Colegio'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };
    
    // --- COMPONENTES UI: MODAL DE FORMULARIO DE ESTUDIANTE ---

    const StudentFormModal = () => {
        if (!showStudentModal) return null;
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={() => setShowStudentModal(false)}>
                <div 
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h3 className={`${UCB_COLORS.primaryText} text-xl font-extrabold flex items-center`}>
                            {isStudentEditing ? <Edit className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                            {isStudentEditing ? 'Editar Estudiante' : 'Añadir Estudiante'}
                        </h3>
                        <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input type="text" name="nombre" value={studentFormData.nombre} onChange={handleStudentChange} placeholder="Nombre y Apellido" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo CI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center"><FileText className='w-4 h-4 mr-1 text-gray-500'/> Cédula de Identidad (CI)</label>
                            <input type="text" name="ci" value={studentFormData.ci} onChange={handleStudentChange} placeholder="Ej: 1234567LP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center"><Mail className='w-4 h-4 mr-1 text-gray-500'/> Email</label>
                            <input type="email" name="email" value={studentFormData.email} onChange={handleStudentChange} placeholder="ejemplo@correo.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" required />
                        </div>
                        {/* Campo Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select name="estado" value={studentFormData.estado} onChange={handleStudentChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] bg-white" required>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>

                        <button type="submit" className={`w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 ${UCB_COLORS.buttonPrimary} text-white`}>
                            <Save className="w-5 h-5 mr-2" />
                            {isStudentEditing ? 'Guardar Cambios' : 'Registrar Estudiante'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };


    // --- COMPONENTE DE PANTALLA: LISTA DE COLEGIOS (RF-003) ---

    const CollegeListView = () => (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <button
                    onClick={openNewCollegeModal}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 transform hover:scale-[1.02] ${UCB_COLORS.buttonAccent} shadow-md`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Registrar Nuevo Colegio
                </button>

                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar colegio por nombre o ubicación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#003366] focus:border-transparent transition"
                    />
                </div>
            </div>

            {filteredColleges.length === 0 ? (
                <div className="text-center py-10 border-t border-gray-200">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xl font-medium text-gray-600">No se encontraron colegios.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${UCB_COLORS.primary} text-white`}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-xl">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-xl">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredColleges.map((colegio) => (
                                <tr key={colegio.id || colegio.id_colegio || colegio.nombre} className="hover:bg-blue-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <School className="w-4 h-4 mr-2 text-[#003366]" />
                                            {colegio.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                            {colegio.direccion || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1 text-gray-400" />
                                            {colegio.contacto || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {colegio.telefono || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 flex justify-center">
                                        <button
                                            onClick={() => goToStudentManagement(colegio)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                                            title="Gestionar Estudiantes"
                                        >
                                            <Users className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEditCollege(colegio)}
                                            className="text-[#003366] hover:text-[#FFD700] hover:bg-blue-100 p-2 rounded-full transition duration-150"
                                            title="Editar Colegio"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCollege(colegio.id, colegio.nombre)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition duration-150"
                                            title="Eliminar Colegio"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
    
    // --- COMPONENTE DE PANTALLA: GESTIÓN DE ESTUDIANTES (RF-004) ---

    const StudentManagementView = () => (
        <>
            <button
                onClick={() => setView('list_colleges')}
                className={`mb-6 px-4 py-2 rounded-full font-semibold flex items-center transition ${UCB_COLORS.buttonPrimary} text-white hover:bg-[#004488]`}
            >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Volver a Colegios
            </button>
            
            <h2 className={`${UCB_COLORS.primaryText} text-3xl font-extrabold flex items-center mb-6`}>
                <Users className={`w-7 h-7 mr-2 ${UCB_COLORS.accentText}`} />
                Gestión de Listas: <span className="ml-2 text-gray-700">{selectedCollege.nombre}</span>
            </h2>

            {/* NOTA IMPORTANTE: Instrucción para formato de archivo */}
            <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-lg">
                <p className="font-semibold flex items-center">
                    <FileCheck className="w-5 h-5 mr-2" />
                    Formato de Carga (CSV)
                </p>
                <p className="text-sm mt-1">
                    El archivo CSV debe tener las cabeceras exactas (sin comillas): **nombre, ci, email**. El sistema valida que la **CI** no esté duplicada.
                </p>
            </div>


            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                
                {/* Botón Cargar Archivo (REAL) */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".csv" 
                    className="hidden" 
                />
                <button
                    onClick={triggerFileInput}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 ${UCB_COLORS.buttonAccent} shadow-md`}
                    title="Carga la lista de estudiantes desde un archivo CSV"
                >
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Cargar Lista Digital (.csv)
                </button>
                
                {/* Botón Añadir Estudiante Manualmente */}
                <button
                    onClick={openNewStudentModal}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 ${UCB_COLORS.buttonPrimary} text-white shadow-md`}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Añadir Estudiante Manual
                </button>

                {/* Barra de Búsqueda */}
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar estudiante por nombre o CI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#003366] focus:border-transparent transition"
                    />
                </div>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="text-center py-10 border-t border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xl font-medium text-gray-600">No hay estudiantes registrados para este colegio.</p>
                    <p className="text-gray-500">Usa los botones para añadir o cargar una lista digitalmente (CSV).</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${UCB_COLORS.primary} text-white`}>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-xl">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">CI</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-xl">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>{student.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Hash className="w-4 h-4 mr-1 text-gray-400" />
                                            <span>{student.ci}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {student.email}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                        <button
                                            onClick={() => handleEditStudent(student)}
                                            className="text-[#003366] hover:text-[#FFD700] p-2 rounded-full transition duration-150"
                                            title="Editar Estudiante"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(student.id, student.nombre)}
                                            className="text-red-600 hover:text-red-800 p-2 rounded-full transition duration-150 ml-2"
                                            title="Eliminar Estudiante"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    // --- RENDERIZADO PRINCIPAL ---

    const MessageDisplay = ({ message }) => {
        if (!message) return null;

        const baseClasses = "p-4 rounded-lg shadow-md mb-6 flex items-center";
        const successClasses = "bg-green-100 text-green-800 border-green-400";
        const errorClasses = "bg-red-100 text-red-800 border-red-400";
        const Icon = message.type === 'success' ? Check : AlertCircle;

        return (
            <div className={`${baseClasses} ${message.type === 'success' ? successClasses : errorClasses} border-l-4`}>
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="font-medium">{message.text}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <header className="mb-8">
                <h1 className={`${UCB_COLORS.primaryText} text-4xl sm:text-5xl font-extrabold flex items-center mb-2`}>
                    <School className={`w-8 h-8 sm:w-10 sm:h-10 mr-3 ${UCB_COLORS.accentText}`} />
                    Módulo de Gestión de Afiliados
                </h1>
                <p className="text-gray-600 text-lg">Administración de colegios y listas de estudiantes.</p>
            </header>

            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                <MessageDisplay message={message} />
                
                {view === 'list_colleges' ? <CollegeListView /> : <StudentManagementView />}
            </div>
            
            {/* Modales */}
            <CollegeFormModal 
                show={showCollegeModal}
                isEditing={isCollegeEditing}
                formData={collegeFormData}
                onClose={() => setShowCollegeModal(false)}
                onSubmit={handleSaveCollege}
                onChange={handleCollegeChange}
            />
            <StudentFormModal 
                show={showStudentModal}
                isEditing={isStudentEditing}
                formData={studentFormData}
                onClose={() => setShowStudentModal(false)}
                onSubmit={handleSaveStudent}
                onChange={handleStudentChange}
            />
        </div>
    );
};

export default GestionColegiosYEstudiantes;