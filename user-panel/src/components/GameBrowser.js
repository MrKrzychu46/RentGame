import React, { useEffect, useState } from 'react';

const GameBrowser = ({ user }) => {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/games', {
            headers: {
                'Authorization': `Basic ${user.credentials}`
            }
        })
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(err => console.error('Błąd:', err));
    }, [user]);

    const handleReserve = () => {
        if (!selectedGameId || !startDate || !endDate) {
            setMessage('Uzupełnij wszystkie pola');
            return;
        }

        fetch('http://localhost:8080/api/reservations/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${user.credentials}`
            },
            body: JSON.stringify({
                userId: user.id,
                gameId: parseInt(selectedGameId),
                startDate,
                endDate
            })
        })

            .then(res => res.ok ? res.json() : Promise.reject())
            .then(() => {
                setMessage('Zarezerwowano grę!');
                setSelectedGameId(null);
                setStartDate('');
                setEndDate('');
            })
            .catch(() => setMessage('Błąd podczas rezerwacji'));
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4">Dostępne gry</h2>
            <select className="w-full mb-2 p-2 border" value={selectedGameId || ''} onChange={e => setSelectedGameId(e.target.value)}>
                <option value="">Wybierz grę</option>
                {games.map(game => (
                    <option key={game.id} value={game.id}>
                        {game.title} ({game.platform}) – {game.genre}
                    </option>
                ))}
            </select>
            <input type="date" className="w-full mb-2 p-2 border" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="w-full mb-2 p-2 border" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleReserve}>
                Zarezerwuj
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};

export default GameBrowser;
