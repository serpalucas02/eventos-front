import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_URL_BASE}/api/usuario/registrar`, { user, password });
            setSuccess('Usuario registrado exitosamente');
            setError('');
        } catch (err) {
            setError('Error al registrar el usuario');
            setSuccess('');
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Registrarse</h2>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <button onClick={handleRegister} className="register-button">Registrar</button>
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>¿Ya tienes cuenta? <button onClick={handleNavigateToLogin} className="register-button-link">Inicia sesión</button></p>
            </div>
        </div>
    );
};

export default Register;
