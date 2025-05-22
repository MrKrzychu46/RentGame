import React, { useState } from 'react';

const AccountPage = ({ user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordChange = async () => {
        if (!newPassword) {
            setMessage('Podaj nowe hasło');
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${user.credentials}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (res.ok) {
                setMessage('Hasło zostało zmienione.');
                setNewPassword('');
            } else {
                setMessage('Błąd podczas zmiany hasła');
            }
        } catch (error) {
            setMessage('Wystąpił błąd');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Czy na pewno chcesz usunąć konto?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/users/me`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${user.credentials}`
                }
            });

            if (res.ok) {
                alert("Konto zostało usunięte");
                window.location.href = "/login"; // lub wywołanie onLogout()
            } else {
                setMessage('Nie udało się usunąć konta');
            }
        } catch (error) {
            setMessage('Wystąpił błąd');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Panel konta</h2>
            <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email || 'brak danych'}</p>
            <p><strong>ID:</strong> {user.id}</p>

            <hr className="my-4" />

            <div>
                <h3 className="text-lg font-semibold mb-2">Zmień hasło</h3>
                <input
                    type="password"
                    className="w-full border p-2 mb-2"
                    placeholder="Nowe hasło"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Zmień hasło
                </button>
            </div>

            <hr className="my-4" />

            <div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">Usuń konto</h3>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Usuń konto
                </button>
            </div>

            {message && <p className="mt-4 text-sm text-center text-yellow-300">{message}</p>}
        </div>
    );
};

export default AccountPage;
