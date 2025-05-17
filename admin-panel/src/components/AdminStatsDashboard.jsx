import React, { useEffect, useState } from 'react';

const AdminStatsDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        games: 0,
        equipment: 0,
        reservations: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, gamesRes, equipmentRes, reservationsRes] = await Promise.all([
                    fetch('http://localhost:8080/api/users', {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:admin123')
                        }
                    }),
                    fetch('http://localhost:8080/api/games', {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:admin123')
                        }
                    }),
                    fetch('http://localhost:8080/api/equipment', {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:admin123')
                        }
                    }),
                    fetch('http://localhost:8080/api/reservations', {
                        headers: {
                            'Authorization': 'Basic ' + btoa('admin:admin123')
                        }
                    })
                ]);

                const [users, games, equipment, reservations] = await Promise.all([
                    usersRes.json(),
                    gamesRes.json(),
                    equipmentRes.json(),
                    reservationsRes.json()
                ]);

                setStats({
                    users: users.length,
                    games: games.length,
                    equipment: equipment.length,
                    reservations: reservations.length
                });
            } catch (error) {
                console.error("Błąd podczas pobierania statystyk:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Użytkownicy</h3>
                <p className="text-2xl">{stats.users}</p>
            </div>
            <div className="bg-green-100 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Gry</h3>
                <p className="text-2xl">{stats.games}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Sprzęt</h3>
                <p className="text-2xl">{stats.equipment}</p>
            </div>
            <div className="bg-red-100 p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Rezerwacje</h3>
                <p className="text-2xl">{stats.reservations}</p>
            </div>
        </div>
    );
};

export default AdminStatsDashboard;
