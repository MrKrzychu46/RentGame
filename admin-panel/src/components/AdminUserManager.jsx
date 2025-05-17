import React, { useEffect, useState } from 'react';

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users', {
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Błąd:', err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(newUser)
        })
            .then(res => {
                if (!res.ok) throw new Error("Błąd rejestracji");
                return res.json();
            })
            .then(() => {
                fetchUsers();
                setNewUser({ username: '', email: '', password: '', role: 'USER' });
            })
            .catch(err => alert('Błąd: ' + err.message));
    };

    const handleResetPassword = (id) => {
        if (!window.confirm("Zresetować hasło użytkownika?")) return;

        fetch(`http://localhost:8080/api/users/${id}/reset-password`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(() => {
                alert("Hasło zresetowane (domyślnie: default123)");
            })
            .catch(err => console.error("Błąd resetowania:", err));
    };

    const handleDeleteUser = (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

        fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(() => {
                fetchUsers();
            })
            .catch(err => console.error("Błąd usuwania użytkownika:", err));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Użytkownicy</h2>

            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                <input
                    type="text"
                    name="username"
                    placeholder="Nazwa użytkownika"
                    value={newUser.username}
                    onChange={handleChange}
                    className="border p-1 w-full"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleChange}
                    className="border p-1 w-full"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={newUser.password}
                    onChange={handleChange}
                    className="border p-1 w-full"
                    required
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="border p-1 w-full"
                >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    Dodaj użytkownika
                </button>
            </form>

            <table className="w-full table-auto border-collapse border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">Username</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Rola</th>
                    <th className="border px-2 py-1">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="border px-2 py-1">{user.id}</td>
                        <td className="border px-2 py-1">{user.username}</td>
                        <td className="border px-2 py-1">{user.email}</td>
                        <td className="border px-2 py-1">{user.role}</td>
                        <td className="border px-2 py-1 space-x-2">
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => handleResetPassword(user.id)}
                            >
                                Resetuj hasło
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserManager;
