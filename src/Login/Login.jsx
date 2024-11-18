import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/api/usuario/login`, { user, password });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('login', 'true');
            setIsLoggedIn(true);

            navigate('/eventos');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al intentar iniciar sesión');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Usuario"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="login-button" type="submit">Iniciar Sesión</button>
                </form>
                {error && <p id="errorMessage">{error}</p>}
                <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </div>
        </div>
    );
};

export default Login;
