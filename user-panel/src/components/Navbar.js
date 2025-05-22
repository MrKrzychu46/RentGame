import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/RentGamLogo.png';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-lg font-semibold">
                <Link to="/">
                    <img src={logo} alt="RentGame Logo" className="h-12 inline-block mr-2" />
                </Link>
                <a>RentGame</a>
            </div>
            <div className="space-x-4">
                {!user ? (
                    <>
                        <Link to="/" className="hover:underline">Strona główna</Link>
                        <Link to="/login" className="hover:underline">Zaloguj się</Link>
                        <Link to="/register" className="hover:underline">Zarejestruj się</Link>
                    </>
                ) : (
                    <>
                        <Link to="/my-reservations" className="hover:underline">Moje rezerwacje</Link>
                        <Link to="/games" className="hover:underline">Zarezerwuj grę</Link>
                        <Link to="/equipment" className="hover:underline">Zarezerwuj sprzęt</Link>

                        {/* Username z linkiem */}
                        <Link to="/account" className="hover:underline text-yellow-400 font-semibold">
                            Zalogowany jako: {user.username}
                        </Link>

                        <button
                            onClick={onLogout}
                            className="hover:underline text-red-400"
                        >
                            Wyloguj się
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
