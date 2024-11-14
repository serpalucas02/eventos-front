import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Eventos.css';

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [nuevoEvento, setNuevoEvento] = useState({ nombre: '', lugar: '', equipamiento: '', fecha: '', cantidad_personas: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [eventoToDelete, setEventoToDelete] = useState(null);
    const [editingEvento, setEditingEvento] = useState(null);

    const fetchEventos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/eventos/obtener');
            setEventos(response.data);
        } catch (err) {
            console.error('Error al obtener los eventos:', err);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const agregarEvento = async () => {
        try {
            if (editingEvento) {
                const { _id, ...eventoSinId } = nuevoEvento;

                await axios.put(`http://127.0.0.1:8080/api/eventos/actualizar/${_id}`, eventoSinId);

                setEventos(eventos.map(evento => evento._id === _id ? { ...eventoSinId, _id } : evento));
                setEditingEvento(null);
                setSuccessMessage('Evento actualizado con éxito');
            } else {
                const response = await axios.post('http://127.0.0.1:8080/api/eventos/guardar', nuevoEvento);
                setEventos([...eventos, response.data]);
                setSuccessMessage('Evento agregado con éxito');
            }
            setNuevoEvento({ nombre: '', lugar: '', equipamiento: '', fecha: '', cantidad_personas: '' });
            setError('');
            setModalVisible(false);
            setSuccessModalVisible(true);
        } catch (err) {
            setError('Error al agregar o actualizar el evento');
        }
    };

    const eliminarEvento = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8080/api/eventos/borrar/${eventoToDelete}`);
            setEventos(eventos.filter((evento) => evento._id !== eventoToDelete));
            setConfirmModalVisible(false);
            setEventoToDelete(null);
            setSuccessMessage('Evento eliminado con éxito');
            setSuccessModalVisible(true);
        } catch (err) {
            console.error('Error al eliminar el evento:', err);
        }
    };

    const handleEdit = (evento) => {
        setNuevoEvento({ ...evento, fecha: evento.fecha.split('T')[0] });
        setEditingEvento(evento);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    return (
        <div className="eventos-container">
            <h2>ABM de Eventos</h2>

            <div className="header-row">
                <button className="btn-agregar" onClick={() => {
                    setModalVisible(true);
                    setEditingEvento(null);
                    setNuevoEvento({ nombre: '', lugar: '', equipamiento: '', fecha: '', cantidad_personas: '' });
                }}>Agregar Evento</button>
            </div>

            {/* Modal para agregar o editar evento */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingEvento ? 'Editar Evento' : 'Agregar Evento'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoEvento.nombre}
                            onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Lugar"
                            value={nuevoEvento.lugar}
                            onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Equipamiento"
                            value={nuevoEvento.equipamiento}
                            onChange={(e) => setNuevoEvento({ ...nuevoEvento, equipamiento: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Fecha"
                            value={nuevoEvento.fecha}
                            onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Cantidad de Personas"
                            value={nuevoEvento.cantidad_personas}
                            onChange={(e) => setNuevoEvento({ ...nuevoEvento, cantidad_personas: e.target.value })}
                        />
                        <button onClick={agregarEvento}>{editingEvento ? 'Actualizar' : 'Guardar'}</button>
                        <button onClick={() => setModalVisible(false)}>Cancelar</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}

            {/* Modal para confirmación de eliminación */}
            {confirmModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que deseas eliminar este evento?</h3>
                        <button onClick={eliminarEvento}>Confirmar</button>
                        <button onClick={() => setConfirmModalVisible(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal para mensajes de éxito */}
            {successModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{successMessage}</h3>
                        <button onClick={() => setSuccessModalVisible(false)}>Aceptar</button>
                    </div>
                </div>
            )}

            <div className="eventos-list">
                <h3>Lista de Eventos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Lugar</th>
                            <th>Equipamiento</th>
                            <th>Fecha</th>
                            <th>Cantidad de Personas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventos.map((evento) => (
                            <tr key={evento._id}>
                                <td>{evento.nombre}</td>
                                <td>{evento.lugar}</td>
                                <td>{evento.equipamiento}</td>
                                <td>{formatDate(evento.fecha)}</td>
                                <td>{evento.cantidad_personas}</td>
                                <td>
                                    <button onClick={() => handleEdit(evento)}>Editar</button>
                                    <button onClick={() => {
                                        setEventoToDelete(evento._id);
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

export default Eventos;
