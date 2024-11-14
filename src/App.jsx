import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Eventos from './Eventos/Eventos';
import Personal from './Personal/Personal';
import Login from './Login/Login';
import Register from './Register/Register';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loginStatus = localStorage.getItem('login');
        if (loginStatus) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('login');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            {isLoggedIn ? (
                <>
                    <Navbar onLogout={handleLogout} />
                    <Routes>
                        <Route path="/eventos" element={<Eventos />} />
                        <Route path="/personal" element={<Personal />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            )}
        </>
    );
};

export default App;
