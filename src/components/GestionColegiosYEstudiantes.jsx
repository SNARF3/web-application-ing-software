import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
    School, Plus, Edit, Trash2, Search, X, Save, UploadCloud, AlertCircle, 
    Clipboard, Check, List, MapPin, User, ChevronLeft, Users, Hash, Mail, FileText, 
    UserPlus, FileCheck, Download, FileSpreadsheet, Info
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

const initialColleges = [];
const initialStudents = [];
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
                    <h3 className="text-[#003366] text-2xl font-extrabold flex items-center">
                        {isEditing ? <Edit className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                        {isEditing ? 'Editar Colegio' : 'Registrar Nuevo Colegio'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Colegio</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={onChange} 
                            placeholder="Nombre" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><MapPin className='w-4 h-4 mr-1 text-gray-500'/> Ubicación (Ciudad)</label>
                        <input 
                            type="text" 
                            name="direccion" 
                            value={formData.direccion} 
                            onChange={onChange} 
                            placeholder="Ej: La Paz" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><User className='w-4 h-4 mr-1 text-gray-500'/> Persona de Contacto</label>
                        <input 
                            type="text" 
                            name="contacto" 
                            value={formData.contacto} 
                            onChange={onChange} 
                            placeholder="Ej: Lic. María Durán" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input 
                            type="tel" 
                            name="telefono" 
                            value={formData.telefono} 
                            onChange={onChange} 
                            placeholder="Ej: 77712345" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-[#003366] hover:bg-[#004488] text-white">
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
    onChange,
    colleges
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="text-[#003366] text-xl font-extrabold flex items-center">
                        {isEditing ? <Edit className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        {isEditing ? 'Editar Estudiante' : 'Añadir Estudiante'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={onChange} 
                            placeholder="Nombre y Apellido" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><FileText className='w-4 h-4 mr-1 text-gray-500'/> Cédula de Identidad (CI)</label>
                        <input 
                            type="text" 
                            name="ci" 
                            value={formData.ci} 
                            onChange={onChange} 
                            placeholder="Ej: 1234567LP" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center"><Mail className='w-4 h-4 mr-1 text-gray-500'/> Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={onChange} 
                            placeholder="ejemplo@correo.com" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700]" 
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full p-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-[#003366] hover:bg-[#004488] text-white">
                        <Save className="w-5 h-5 mr-2" />
                        {isEditing ? 'Guardar Cambios' : 'Registrar Estudiante'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENTE SEPARADO: MODAL DE EJEMPLO CSV ---
const CSVExampleModal = ({ show, onClose }) => {
    if (!show) return null;

    const exampleCSV = `nombre,ci,email
Juan Pérez Morales,1234567LP,juan.perez@email.com
María López Fernández,7654321SC,maria.lopez@email.com
Carlos Rodríguez Vargas,9876543LP,carlos.rodriguez@email.com
Ana María García Méndez,5432167CB,ana.garcia@email.com`;

    const handleDownloadExample = () => {
        const blob = new Blob([exampleCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ejemplo_estudiantes.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="text-[#003366] text-xl font-extrabold flex items-center">
                        <FileSpreadsheet className="w-5 h-5 mr-2" />
                        Formato de Archivo CSV para Estudiantes
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 flex items-center">
                            <Info className="w-4 h-4 mr-2" />
                            Instrucciones importantes:
                        </h4>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                            <li>• El archivo debe tener extensión <strong>.csv</strong></li>
                            <li>• La primera línea debe contener las columnas: <code>nombre,ci,email</code></li>
                            <li>• Los campos deben estar separados por comas (,)</li>
                            <li>• No incluir espacios después de las comas</li>
                            <li>• El sistema validará que los CIs no estén duplicados</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ejemplo del formato CSV:</label>
                        <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{exampleCSV}</pre>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button 
                            onClick={handleDownloadExample}
                            className="flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Descargar Ejemplo
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center transition duration-200 bg-[#003366] hover:bg-[#004488] text-white"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const GestionColegiosYEstudiantes = () => {
    // --- ESTADO GENERAL ---
    const [view, setView] = useState('list_colleges');
    const [colegios, setColegios] = useState(initialColleges);
    const [estudiantes, setEstudiantes] = useState(initialStudents);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [message, setMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);
    
    // Referencias para inputs
    const fileInputRef = useRef(null);

    // Cargar colegios y estudiantes desde la API al montar el componente
    useEffect(() => {
        const token = sessionStorage.getItem('token') || '';

        // Colegios
        fetch('http://localhost:3000/colegios', {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })
        .then(r => r.ok ? r.json() : Promise.resolve([]))
        .then(data => {
            if (Array.isArray(data)) {
                const mapped = data.map(c => ({
                    id: c.id || c.id_colegio || c._id || String(Math.random()),
                    id_colegio: c.id_colegio || c.id || c._id || null,
                    nombre: c.nombre || '',
                    direccion: c.direccion || c.ciudad || '',
                    contacto: c.contacto || '',
                    telefono: c.telefono || '',
                }));
                setColegios(mapped);
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
                const mapped = data.map(s => ({
                    id: s.id || s.id_estudiante || String(s.id),
                    nombre: s.nombre,
                    ci: s.ci,
                    email: s.correo || s.email,
                    collegeId: s.id_colegio || s.collegeId || null,
                    colegio: s.colegio_nombre || s.colegio || '',
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
        setTimeout(() => setMessage(null), 7000);
    };

    // --- RF-003: LÓGICA CRUD DE COLEGIOS ---
    const handleCollegeChange = useCallback((e) => {
        setCollegeFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSaveCollege = useCallback((e) => {
        e.preventDefault();
        
        const isDuplicate = colegios.some(c => 
            c.nombre.toLowerCase() === collegeFormData.nombre.toLowerCase() && c.id !== collegeFormData.id
        );
        if (isDuplicate) {
            showFeedback('error', `El colegio "${collegeFormData.nombre}" ya existe.`);
            return;
        }

        const token = sessionStorage.getItem('token') || '';
        if (isCollegeEditing) {
            fetch(`http://localhost:3000/colegios/${collegeFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: collegeFormData.nombre, direccion: collegeFormData.direccion, contacto: collegeFormData.contacto, telefono: collegeFormData.telefono })
            })
            .then(r => r.ok ? r.json().catch(() => collegeFormData) : Promise.reject(r))
            .then(updated => {
                const mapped = { ...updated, id: updated.id || collegeFormData.id };
                setColegios(prev => prev.map(c => c.id === collegeFormData.id ? mapped : c));
                showFeedback('success', `Colegio "${collegeFormData.nombre}" actualizado.`);
                setShowCollegeModal(false);
                setCollegeFormData(initialCollegeFormData);
                setIsCollegeEditing(false);
            })
            .catch(err => {
                console.error('Error actualizando colegio:', err);
                showFeedback('error', 'No se pudo actualizar el colegio.');
            });
        } else {
            fetch('http://localhost:3000/colegios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: collegeFormData.nombre, direccion: collegeFormData.direccion, contacto: collegeFormData.contacto, telefono: collegeFormData.telefono })
            })
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(created => {
                const toAdd = { ...created, id: created.id || Date.now().toString() };
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
        if (window.confirm(`¿Estás seguro de eliminar el colegio "${nombre}"?`)) {
            const token = sessionStorage.getItem('token') || '';
            fetch(`http://localhost:3000/colegios/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            })
            .then(r => {
                if (!r.ok) throw r;
                setColegios(prev => prev.filter(c => String(c.id) !== String(id)));
                setEstudiantes(prev => prev.filter(s => String(s.collegeId) !== String(id)));
                showFeedback('success', `Colegio "${nombre}" eliminado.`);
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
    
    // --- LÓGICA DE CARGA DE ARCHIVOS CSV ---
    const parseCSV = (text) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('El archivo CSV debe tener al menos una fila de encabezado y una de datos.');
        }

        // Extraer encabezados
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        
        // Validar encabezados requeridos
        const requiredHeaders = ['nombre', 'ci', 'email'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
            throw new Error(`Faltan los siguientes encabezados requeridos: ${missingHeaders.join(', ')}`);
        }

        // Procesar datos
        const students = [];
        const errors = [];
        const existingCIs = new Set(estudiantes.map(s => s.ci));
        const fileCIs = new Set();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = line.split(',');
            
            // Asegurar que tenemos suficientes valores
            if (values.length < headers.length) {
                errors.push(`Línea ${i + 1}: Número de columnas incorrecto.`);
                continue;
            }

            // Crear objeto con los datos
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });

            // Validaciones
            if (!row.nombre || !row.ci || !row.email) {
                errors.push(`Línea ${i + 1}: Campos incompletos. Todos los campos son obligatorios.`);
                continue;
            }

            if (row.ci.length < 3) {
                errors.push(`Línea ${i + 1}: CI "${row.ci}" es demasiado corto.`);
                continue;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
                errors.push(`Línea ${i + 1}: Email "${row.email}" no es válido.`);
                continue;
            }

            // Verificar duplicados
            if (existingCIs.has(row.ci)) {
                errors.push(`Línea ${i + 1}: CI "${row.ci}" ya existe en la base de datos.`);
                continue;
            }

            if (fileCIs.has(row.ci)) {
                errors.push(`Línea ${i + 1}: CI "${row.ci}" está duplicado en el archivo.`);
                continue;
            }

            fileCIs.add(row.ci);
            students.push({
                id: `temp_${Date.now()}_${i}`,
                nombre: row.nombre,
                ci: row.ci,
                email: row.email,
                collegeId: selectedCollege.id,
                colegio: selectedCollege.nombre
            });
        }

        return { students, errors };
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const text = e.target.result;
                const { students, errors } = parseCSV(text);
                
                if (errors.length > 0) {
                    const errorList = errors.slice(0, 5).join('\n');
                    showFeedback('error', `Errores encontrados:\n${errorList}${errors.length > 5 ? `\n... y ${errors.length - 5} errores más` : ''}`);
                    setIsUploading(false);
                    return;
                }
                
                if (students.length === 0) {
                    showFeedback('error', 'No se encontraron estudiantes válidos en el archivo.');
                    setIsUploading(false);
                    return;
                }
                
                const token = sessionStorage.getItem('token') || '';
                const createdStudents = [];
                const failedStudents = [];
                
                // Subir estudiantes en lotes para mejor rendimiento
                const batchSize = 5;
                for (let i = 0; i < students.length; i += batchSize) {
                    const batch = students.slice(i, i + batchSize);
                    
                    const batchPromises = batch.map(async (student) => {
                        try {
                            const response = await fetch('http://localhost:3000/estudiantes', {
                                method: 'POST',
                                headers: { 
                                    'Content-Type': 'application/json', 
                                    ...(token ? { Authorization: `Bearer ${token}` } : {}) 
                                },
                                body: JSON.stringify({ 
                                    nombre: student.nombre, 
                                    ci: student.ci, 
                                    correo: student.email, 
                                    id_colegio: student.collegeId 
                                })
                            });
                            
                            if (!response.ok) {
                                throw new Error(`Error ${response.status}: ${response.statusText}`);
                            }
                            
                            const created = await response.json();
                            createdStudents.push(created);
                        } catch (error) {
                            failedStudents.push({ student, error: error.message });
                        }
                        
                        // Actualizar progreso
                        const progress = Math.round(((i + batch.length) / students.length) * 100);
                        setUploadProgress(progress);
                    });
                    
                    await Promise.all(batchPromises);
                }
                
                // Actualizar estado local con los estudiantes creados
                const mappedStudents = createdStudents.map(s => ({
                    id: s.id || s.id_estudiante || String(s.id),
                    nombre: s.nombre,
                    ci: s.ci,
                    email: s.correo || s.email,
                    collegeId: s.id_colegio,
                    colegio: selectedCollege.id_colegio
                }));
                
                setEstudiantes(prev => [...prev, ...mappedStudents]);
                
                // Mostrar resultados
                if (failedStudents.length > 0) {
                    showFeedback('warning', `Se registraron ${createdStudents.length} estudiantes. ${failedStudents.length} fallaron.`);
                } else {
                    showFeedback('success', `¡Éxito! Se registraron ${createdStudents.length} estudiantes.`);
                }
                
            } catch (error) {
                console.error('Error procesando CSV:', error);
                showFeedback('error', `Error al procesar el archivo: ${error.message}`);
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        };
        
        reader.onerror = () => {
            showFeedback('error', 'Error al leer el archivo.');
            setIsUploading(false);
        };
        
        reader.readAsText(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validar tipo de archivo
        if (!file.name.toLowerCase().endsWith('.csv')) {
            showFeedback('error', 'Por favor, selecciona un archivo CSV.');
            return;
        }
        
        handleFileUpload(file);
        
        // Limpiar input para permitir cargar el mismo archivo nuevamente
        e.target.value = null;
    };

    const triggerFileInput = () => {
        if (!selectedCollege) {
            showFeedback('error', 'Primero selecciona un colegio.');
            return;
        }
        fileInputRef.current.click();
    };

    // CRUD de Estudiantes
    const handleStudentChange = useCallback((e) => {
        setStudentFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSaveStudent = useCallback((e) => {
        e.preventDefault();

        const isDuplicate = estudiantes.some(s => s.ci === studentFormData.ci && s.id !== studentFormData.id);
        if (isDuplicate) {
            showFeedback('error', `Ya existe un estudiante con el CI: ${studentFormData.ci}.`);
            return;
        }

        const token = sessionStorage.getItem('token') || '';

        if (isStudentEditing) {
            fetch(`http://localhost:3000/estudiantes/${studentFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ nombre: studentFormData.nombre, ci: studentFormData.ci, correo: studentFormData.email, id_colegio: studentFormData.collegeId })
            })
            .then(r => r.ok ? r.json().catch(() => studentFormData) : Promise.reject(r))
            .then(updated => {
                const mapped = { ...updated, id: updated.id || studentFormData.id, email: updated.correo || studentFormData.email };
                setEstudiantes(prev => prev.map(s => s.id === studentFormData.id ? mapped : s));
                showFeedback('success', `Estudiante "${mapped.nombre}" actualizado.`);
                setShowStudentModal(false);
                setStudentFormData(initialStudentFormData);
                setIsStudentEditing(false);
            })
            .catch(err => {
                console.error('Error actualizando estudiante:', err);
                showFeedback('error', 'No se pudo actualizar el estudiante.');
            });
        } else {
            const body = { nombre: studentFormData.nombre, ci: studentFormData.ci, correo: studentFormData.email, id_colegio: selectedCollege.id_colegio };
            fetch('http://localhost:3000/estudiantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(body)
            })
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(created => {
                const mapped = { id: created.id || created.id_estudiante, nombre: created.nombre, ci: created.ci, email: created.correo || studentFormData.email, collegeId: created.id_colegio };
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
        if (window.confirm(`¿Estás seguro de que deseas eliminar a "${nombre}"?`)) {
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
        if (!selectedCollege) {
            showFeedback('error', 'Primero selecciona un colegio.');
            return;
        }
        setStudentFormData({ ...initialStudentFormData, collegeId: selectedCollege.id });
        setIsStudentEditing(false);
        setShowStudentModal(true);
    }, [selectedCollege]);

    const MessageDisplay = ({ message }) => {
        if (!message) return null;
        const baseClasses = "p-4 rounded-lg shadow-md mb-6 flex items-center animate-fadeIn";
        const successClasses = "bg-green-100 text-green-800 border-l-4 border-green-400";
        const errorClasses = "bg-red-100 text-red-800 border-l-4 border-red-400";
        const warningClasses = "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-400";
        const infoClasses = "bg-blue-100 text-blue-800 border-l-4 border-blue-400";
        
        let typeClasses;
        let Icon;
        
        if (message.type === 'success') {
            typeClasses = successClasses;
            Icon = Check;
        } else if (message.type === 'error') {
            typeClasses = errorClasses;
            Icon = AlertCircle;
        } else if (message.type === 'warning') {
            typeClasses = warningClasses;
            Icon = AlertCircle;
        } else {
            typeClasses = infoClasses;
            Icon = Info;
        }
        
        return (
            <div className={`${baseClasses} ${typeClasses}`}>
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="font-medium whitespace-pre-line">{message.text}</p>
            </div>
        );
    };

    const CollegeListView = () => (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <button
                    onClick={openNewCollegeModal}
                    className="w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 transform hover:scale-[1.02] bg-[#FFD700] hover:bg-[#E0B800] text-[#003366] shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Registrar Nuevo Colegio
                </button>

                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar colegio..."
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
                        <thead className="bg-[#003366] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredColleges.map((colegio) => (
                                <tr key={colegio.id} className="hover:bg-blue-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <School className="w-4 h-4 mr-2 text-[#003366]" />
                                            {colegio.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{colegio.direccion || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{colegio.contacto || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{colegio.telefono || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 flex justify-center">
                                        <button
                                            onClick={() => goToStudentManagement(colegio)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                                            title="Gestionar estudiantes"
                                        >
                                            <Users className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEditCollege(colegio)}
                                            className="text-[#003366] hover:text-[#FFD700] hover:bg-blue-100 p-2 rounded-full transition duration-150"
                                            title="Editar colegio"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCollege(colegio.id, colegio.nombre)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition duration-150"
                                            title="Eliminar colegio"
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
    
    const StudentManagementView = () => (
        <>
            <button
                onClick={() => setView('list_colleges')}
                className="mb-6 px-4 py-2 rounded-full font-semibold flex items-center transition bg-[#003366] hover:bg-[#004488] text-white"
            >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Volver a Colegios
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-[#003366] text-3xl font-extrabold flex items-center mb-4 md:mb-0">
                    <Users className="w-7 h-7 mr-2 text-[#FFD700]" />
                    Gestión de Estudiantes: <span className="ml-2 text-gray-700">{selectedCollege?.nombre}</span>
                </h2>
                
                <button
                    onClick={() => setShowCSVModal(true)}
                    className="px-4 py-2 rounded-lg font-medium flex items-center transition bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Ver Ejemplo CSV
                </button>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                <div className="flex items-start">
                    <FileCheck className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-blue-800">Carga Masiva de Estudiantes vía CSV</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Sube un archivo CSV con la lista de estudiantes. El archivo debe contener las columnas: <strong>nombre, ci, email</strong>.
                            El sistema validará automáticamente los datos y evitará duplicados.
                        </p>
                    </div>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
            />

            {isUploading && (
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Cargando estudiantes...</span>
                        <span className="font-bold text-[#003366]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <button
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 ${
                        isUploading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#FFD700] hover:bg-[#E0B800] transform hover:scale-[1.02]'
                    } text-[#003366] shadow-md`}
                >
                    <UploadCloud className="w-5 h-5 mr-2" />
                    {isUploading ? 'Cargando...' : 'Cargar Lista CSV'}
                </button>
                
                <button
                    onClick={openNewStudentModal}
                    disabled={isUploading}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-bold flex items-center justify-center transition duration-200 ${
                        isUploading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#003366] hover:bg-[#004488] transform hover:scale-[1.02]'
                    } text-white shadow-md`}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Añadir Estudiante Manual
                </button>

                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar estudiante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#003366] focus:border-transparent transition"
                    />
                </div>
            </div>

            <div className="mb-4 flex items-center text-sm text-gray-600">
                <Clipboard className="w-4 h-4 mr-2" />
                <span>Total de estudiantes: <strong>{filteredStudents.length}</strong></span>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="text-center py-10 border-t border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xl font-medium text-gray-600 mb-2">No hay estudiantes registrados.</p>
                    <p className="text-gray-500">Comienza agregando estudiantes manualmente o cargando un archivo CSV.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#003366] text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">CI</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
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
                                            <span className="font-mono">{student.ci}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                                            <span>{student.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-1">
                                            <button
                                                onClick={() => handleEditStudent(student)}
                                                className="text-[#003366] hover:text-[#FFD700] p-2 rounded-full transition duration-150 hover:bg-blue-50"
                                                title="Editar estudiante"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStudent(student.id, student.nombre)}
                                                className="text-red-600 hover:text-red-800 p-2 rounded-full transition duration-150 hover:bg-red-50"
                                                title="Eliminar estudiante"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-[#003366] text-4xl sm:text-5xl font-extrabold flex items-center mb-2">
                    <School className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-[#FFD700]" />
                    Módulo de Gestión de Colegios y Estudiantes
                </h1>
                <p className="text-gray-600 text-lg">Administración completa de instituciones educativas y sus estudiantes.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
                <MessageDisplay message={message} />
                
                {view === 'list_colleges' ? <CollegeListView /> : <StudentManagementView />}
            </div>
            
            {/* Modales */}
            <CollegeFormModal 
                show={showCollegeModal}
                isEditing={isCollegeEditing}
                formData={collegeFormData}
                onClose={() => {
                    setShowCollegeModal(false);
                    setIsCollegeEditing(false);
                    setCollegeFormData(initialCollegeFormData);
                }}
                onSubmit={handleSaveCollege}
                onChange={handleCollegeChange}
            />
            
            <StudentFormModal 
                show={showStudentModal}
                isEditing={isStudentEditing}
                formData={studentFormData}
                onClose={() => {
                    setShowStudentModal(false);
                    setIsStudentEditing(false);
                    setStudentFormData(initialStudentFormData);
                }}
                onSubmit={handleSaveStudent}
                onChange={handleStudentChange}
                colleges={colegios}
            />
            
            <CSVExampleModal 
                show={showCSVModal}
                onClose={() => setShowCSVModal(false)}
            />
        </div>
    );
};

export default GestionColegiosYEstudiantes;