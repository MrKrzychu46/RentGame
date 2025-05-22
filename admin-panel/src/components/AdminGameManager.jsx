import React, { useEffect, useState } from 'react';

const AdminGameManager = () => {
    const [games, setGames] = useState([]);
    const [form, setForm] = useState({ title: '', genre: '', platform: '', available: true });

    const fetchGames = () => {
        fetch('http://localhost:8080/api/games', {
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(err => console.error('Błąd:', err));
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(form)
        })
            .then(res => {
                if (!res.ok) throw new Error('Błąd zapisu');
                return res.json();
            })
            .then(() => {
                setForm({ title: '', genre: '', platform: '', available: true });
                fetchGames();
            })
            .catch(err => console.error('Błąd:', err));
    };

    const deleteGame = (id) => {
        fetch(`http://localhost:8080/api/games/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(() => fetchGames())
            .catch(err => console.error('Błąd usuwania:', err));
    };

    const toggleAvailability = (id, currentStatus) => {
        fetch(`http://localhost:8080/api/games/${id}/availability`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify({ available: !currentStatus })
        })
            .then(() => fetchGames())
            .catch(err => console.error('Błąd zmiany dostępności:', err));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Zarządzaj grami</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    placeholder="Tytuł"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Gatunek"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Platforma"
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2">Dodaj</button>
            </form>

            <ul className="list-disc list-inside space-y-2">
                {games.map(game => (
                    <li key={game.id}>
                        <span>{game.title} ({game.platform}) — {game.genre} — {game.available ? 'Dostępna' : 'Niedostępna'}</span>
                        <button
                            onClick={() => toggleAvailability(game.id, game.available)}
                            className="ml-4 bg-yellow-400 px-2 py-1 text-sm rounded"
                        >
                            Zmień dostępność
                        </button>
                        <button
                            onClick={() => deleteGame(game.id)}
                            className="ml-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
                        >
                            Usuń
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminGameManager;
