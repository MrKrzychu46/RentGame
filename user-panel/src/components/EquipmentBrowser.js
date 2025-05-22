import React, { useEffect, useState } from 'react';

const EquipmentBrowser = ({ user }) => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/equipment', {
            headers: {
                'Authorization': `Basic ${user.credentials}`
            }
        })
            .then(res => res.json())
            .then(data => setEquipmentList(data))
            .catch(err => console.error('Błąd pobierania sprzętu:', err));
    }, [user]);

    const handleReserve = () => {
        if (!selectedEquipmentId || !startDate || !endDate) {
            setMessage('Uzupełnij wszystkie pola');
            return;
        }

        const requestBody = {
            userId: user.id,
            equipmentId: parseInt(selectedEquipmentId),
            gameId: null, // zawsze null
            startDate,
            endDate
        };

        fetch('http://localhost:8080/api/reservations/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${user.credentials}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => {
                if (!res.ok) throw new Error('Rezerwacja nie powiodła się');
                return res.json();
            })
            .then(() => {
                setMessage('Sprzęt zarezerwowany!');
                setSelectedEquipmentId('');
                setStartDate('');
                setEndDate('');
            })
            .catch(() => {
                setMessage('Błąd podczas rezerwacji. Sprawdź dostępność i daty.');
            });
    };

    return (
        <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Zarezerwuj sprzęt</h2>

            <select
                className="w-full p-2 mb-2 border"
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
            >
                <option value="">-- Wybierz sprzęt --</option>
                {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>
                        {eq.name} – {eq.type}
                    </option>
                ))}
            </select>

            <input
                type="date"
                className="w-full p-2 mb-2 border"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                className="w-full p-2 mb-4 border"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleReserve}
            >
                Zarezerwuj
            </button>

            {message && <p className="mt-4 text-sm text-center">{message}</p>}
        </div>
    );
};

export default EquipmentBrowser;
