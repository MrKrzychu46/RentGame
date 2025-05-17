import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="p-4 shadow bg-gray-100 flex space-x-4">
            <Link to="/" className="font-bold">Dashboard</Link>
            <Link to="/manage-equipment" className="mr-4">Zarządzaj sprzętem</Link>
            <Link to="/manage-games" className="hover:underline text-yellow-400">Zarządzaj grami</Link>
            <Link to="/manage-reservations" className="hover:underline text-yellow-400">Zarządzaj rezerwacjami</Link>
            <Link to="/manage-users">Zarządzanie użytkownikami</Link>
        </nav>
    );
};

export default Navbar;
