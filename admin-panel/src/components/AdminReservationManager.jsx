import React, { useEffect, useState } from 'react';

const AdminReservationManager = () => {
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [form, setForm] = useState({
        userId: '',
        gameId: '',
        equipmentId: '',
        startDate: '',
        endDate: ''
    });

    const authHeader = {
        'Authorization': 'Basic ' + btoa('admin:admin123'), // ← Zamień na swoje dane logowania
        'Content-Type': 'application/json'
    };

    const fetchAll = () => {
        fetch('http://localhost:8080/api/reservations', { headers: authHeader })
            .then(res => res.json()).then(setReservations);

        fetch('http://localhost:8080/api/users', { headers: authHeader })
            .then(res => res.json()).then(setUsers);

        fetch('http://localhost:8080/api/games', { headers: authHeader })
            .then(res => res.json()).then(setGames);

        fetch('http://localhost:8080/api/equipment', { headers: authHeader })
            .then(res => res.json()).then(setEquipment);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć rezerwację?")) {
            fetch(`http://localhost:8080/api/reservations/${id}`, {
                method: 'DELETE',
                headers: authHeader
            }).then(fetchAll);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/reservations', {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                ...form,
                gameId: form.gameId || null,
                equipmentId: form.equipmentId || null
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) });
                }
                return res.json();
            })
            .then(() => {
                fetchAll();
                setForm({ userId: '', gameId: '', equipmentId: '', startDate: '', endDate: '' });
            })
            .catch(err => alert("Błąd: " + err.message));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Zarządzaj rezerwacjami</h2>

            <form className="mb-6 space-y-2" onSubmit={handleSubmit}>
                <div>
                    <label className="block">Użytkownik:</label>
                    <select name="userId" value={form.userId} onChange={handleChange} required>
                        <option value="">-- wybierz --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block">Gra (opcjonalna):</label>
                    <select name="gameId" value={form.gameId} onChange={handleChange}>
                        <option value="">-- brak --</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>{game.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block">Sprzęt (opcjonalny):</label>
                    <select name="equipmentId" value={form.equipmentId} onChange={handleChange}>
                        <option value="">-- brak --</option>
                        {equipment.map(eq => (
                            <option key={eq.id} value={eq.id}>{eq.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block">Od:</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
                </div>

                <div>
                    <label className="block">Do:</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Dodaj rezerwację
                </button>
            </form>

            {reservations.length === 0 ? (
                <p>Brak rezerwacji.</p>
            ) : (
                <table className="w-full table-auto border-collapse border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Użytkownik</th>
                        <th className="border px-2 py-1">Gra</th>
                        <th className="border px-2 py-1">Sprzęt</th>
                        <th className="border px-2 py-1">Od</th>
                        <th className="border px-2 py-1">Do</th>
                        <th className="border px-2 py-1">Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(r => (
                        <tr key={r.id}>
                            <td className="border px-2 py-1">{r.id}</td>
                            <td className="border px-2 py-1">{r.user?.username}</td>
                            <td className="border px-2 py-1">{r.game?.title || '–'}</td>
                            <td className="border px-2 py-1">{r.equipment?.name || '–'}</td>
                            <td className="border px-2 py-1">{r.startDate}</td>
                            <td className="border px-2 py-1">{r.endDate}</td>
                            <td className="border px-2 py-1">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(r.id)}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminReservationManager;
