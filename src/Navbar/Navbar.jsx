import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h5 className="navbar-logo">EventosApp</h5>
                <ul className="navbar-links">
                    <li><a href="/eventos">Eventos</a></li>
                    <li><a href="/personal">Personal</a></li>
                </ul>
                <button className="navbar-logout" onClick={onLogout}>Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;
