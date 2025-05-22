import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← DODAJ TO

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // ← DODAJ TO

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = btoa(`${username}:${password}`);
        try {
            const res = await fetch('http://localhost:8080/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (res.ok) {
                const userData = await res.json();
                navigate('/my-reservations');
                onLogin({ id: userData.id, username: userData.username,email: userData.email, credentials });
            } else {
                setError('Nieprawidłowe dane logowania');
            }
        } catch (err) {
            setError('Błąd logowania');
        }
    };


    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">Logowanie</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border p-2 mb-2"
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 mb-2"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Zaloguj się
                </button>
                <p className="mt-2 text-sm text-center">
                    <a href="/reset-password" className="text-blue-600 hover:underline">Nie pamiętasz hasła?</a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
