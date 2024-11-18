import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Eventos from './Eventos/Eventos';
import Personal from './Personal/Personal';
import Login from './Login/Login';
import Register from './Register/Register';
import axios from 'axios';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('login') === 'true';
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await axios.get(`${import.meta.env.VITE_URL_BASE}/api/usuario/validarToken`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error('Sesión inválida o expirada:', err);
                localStorage.removeItem('login');
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    const ProtectedRoutes = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={<Navigate to="/eventos" />} />
                        <Route
                            path="/eventos"
                            element={
                                <ProtectedRoutes>
                                    <Navbar onLogout={handleLogout} />
                                    <Eventos />
                                </ProtectedRoutes>
                            }
                        />
                        <Route
                            path="/personal"
                            element={
                                <ProtectedRoutes>
                                    <Navbar onLogout={handleLogout} />
                                    <Personal />
                                </ProtectedRoutes>
                            }
                        />
                        <Route path="*" element={<Navigate to="/eventos" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </>
    );
};

export default App;
