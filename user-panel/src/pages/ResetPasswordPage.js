import React, { useState } from 'react';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.text();
            setMessage(data);
        } catch {
            setMessage("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">Resetuj hasło</h2>
            <input
                type="email"
                placeholder="Podaj swój e-mail"
                className="w-full border p-2 mb-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleReset}>
                Wyślij tymczasowe hasło
            </button>
            {message && <p className="mt-2 text-center">{message}</p>}
        </div>
    );
};

export default ResetPasswordPage;
