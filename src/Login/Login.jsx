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

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/api/usuario/login', { user, password });
            localStorage.setItem('login', true);
            setIsLoggedIn(true);
            navigate('/eventos');
        } catch (err) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleLogin}>Iniciar Sesión</button>
                {error && <p id="errorMessage">{error}</p>}
                <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </div>
        </div>
    );
};

export default Login;
