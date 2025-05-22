import React, { useEffect, useState } from 'react';

const MyReservations = ({ user }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.credentials) return;

        fetch('http://localhost:8080/api/reservations/my', {
            headers: {
                'Authorization': 'Basic ' + user.credentials
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Błąd podczas pobierania rezerwacji');
                return res.json();
            })
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [user]);

    if (loading) return <p>Ładowanie rezerwacji...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Moje rezerwacje</h2>
            {reservations.length === 0 ? (
                <p>Brak rezerwacji.</p>
            ) : (
                <table className="w-full table-auto border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Gra</th>
                        <th className="border px-2 py-1">Sprzęt</th>
                        <th className="border px-2 py-1">Od</th>
                        <th className="border px-2 py-1">Do</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(r => (
                        <tr key={r.id}>
                            <td className="border px-2 py-1">{r.id}</td>
                            <td className="border px-2 py-1">{r.game?.title || '-'}</td>
                            <td className="border px-2 py-1">{r.equipment?.name || '-'}</td>
                            <td className="border px-2 py-1">{r.startDate}</td>
                            <td className="border px-2 py-1">{r.endDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyReservations;
