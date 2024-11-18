import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Personal.css';

const Personal = () => {
    const [personal, setPersonal] = useState([]);
    const [nuevoPersonal, setNuevoPersonal] = useState({ nombre: '', apellido: '', dni: '', fecha_nacimiento: '', ocupacion: '' });
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [personaToDelete, setPersonaToDelete] = useState(null);
    const [editingPersona, setEditingPersona] = useState(null);

    const fetchPersonal = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/api/personal/obtener`);
            setPersonal(response.data);
        } catch (err) {
            console.error('Error al obtener el personal:', err);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const agregarPersonal = async (e) => {
        e.preventDefault();
        try {
            if (editingPersona) {
                const { _id, ...personaSinId } = nuevoPersonal;
                await axios.put(import.meta.env.VITE_URL_BASE + `/api/personal/actualizar/${_id}`, personaSinId);
                setPersonal(personal.map(persona => persona._id === _id ? { ...personaSinId, _id } : persona));
                setEditingPersona(null);
                setSuccessModalVisible(true);
            } else {
                const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/api/personal/guardar`, nuevoPersonal);
                setPersonal([...personal, response.data]);
                setSuccessModalVisible(true);
            }
            setNuevoPersonal({ nombre: '', apellido: '', dni: '', fecha_nacimiento: '', ocupacion: '' });
            setError('');
            setModalVisible(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al agregar o actualizar el personal');
        }
    };

    const eliminarPersonal = async () => {
        try {
            await axios.delete(import.meta.env.VITE_URL_BASE + `/api/personal/borrar/${personaToDelete}`);
            setPersonal(personal.filter((persona) => persona._id !== personaToDelete));
            setConfirmModalVisible(false);
            setPersonaToDelete(null);
            setSuccessModalVisible(true);
        } catch (err) {
            console.error('Error al eliminar el personal:', err);
        }
    };

    const handleEdit = (persona) => {
        setNuevoPersonal({ ...persona, fecha_nacimiento: persona.fecha_nacimiento.split('T')[0] });
        setEditingPersona(persona);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchPersonal();
    }, []);

    return (
        <div className="personal-container">
            <h2>ABM de Personal</h2>

            <div className="header-row">
                <button className="btn-agregar" onClick={() => {
                    setModalVisible(true);
                    setEditingPersona(null);
                    setNuevoPersonal({ nombre: '', apellido: '', dni: '', fecha_nacimiento: '', ocupacion: '' });
                }}>Agregar Personal</button>
            </div>

            {/* Modal para agregar o editar personal */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingPersona ? 'Editar Personal' : 'Agregar Personal'}</h3>
                        <form onSubmit={agregarPersonal}>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nuevoPersonal.nombre}
                                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, nombre: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                value={nuevoPersonal.apellido}
                                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, apellido: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="DNI"
                                value={nuevoPersonal.dni}
                                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, dni: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Fecha de Nacimiento"
                                value={nuevoPersonal.fecha_nacimiento}
                                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, fecha_nacimiento: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Ocupación"
                                value={nuevoPersonal.ocupacion}
                                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, ocupacion: e.target.value })}
                                required
                            />
                            <button type='submit'>{editingPersona ? 'Actualizar' : 'Guardar'}</button>
                            <button onClick={() => setModalVisible(false)}>Cancelar</button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}

            {/* Modal para confirmación de eliminación */}
            {confirmModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que deseas eliminar este personal?</h3>
                        <button onClick={eliminarPersonal}>Confirmar</button>
                        <button onClick={() => setConfirmModalVisible(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal para mensajes de éxito */}
            {successModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Operación realizada con éxito</h3>
                        <button onClick={() => setSuccessModalVisible(false)}>Aceptar</button>
                    </div>
                </div>
            )}

            <div className="personal-list">
                <h3>Lista de Personal</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Ocupación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personal.map((persona) => (
                            <tr key={persona._id}>
                                <td>{persona.nombre}</td>
                                <td>{persona.apellido}</td>
                                <td>{persona.dni}</td>
                                <td>{formatDate(persona.fecha_nacimiento)}</td>
                                <td>{persona.ocupacion}</td>
                                <td>
                                    <button onClick={() => handleEdit(persona)}>Editar</button>
                                    <button onClick={() => {
                                        setPersonaToDelete(persona._id);
                                        setConfirmModalVisible(true);
                                    }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Personal;
