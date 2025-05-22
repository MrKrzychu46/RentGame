import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = "USER";
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const body = { username, email, password, role };

        const res = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setMessage("Rejestracja udana! Możesz się teraz zalogować.");
            setTimeout(() => navigate('/login'), 1500);
        } else {
            const data = await res.json();
            setMessage(data.username || data.email || "Błąd rejestracji");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">Rejestracja</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    className="w-full border p-2 mb-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    className="w-full border p-2 mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {message && <p className="text-sm text-red-500">{message}</p>}
                <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
                    Zarejestruj się
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
