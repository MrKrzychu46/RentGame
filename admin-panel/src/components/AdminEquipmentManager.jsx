import React, { useEffect, useState } from 'react';

const AdminEquipmentManager = () => {
    const [equipment, setEquipment] = useState([]);
    const [form, setForm] = useState({ name: '', type: '', available: true });

    const fetchEquipment = () => {
        fetch('http://localhost:8080/api/equipment', {
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(res => res.json())
            .then(data => setEquipment(data))
            .catch(err => console.error('Błąd:', err));
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/equipment', {
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
                setForm({ name: '', type: '', available: true });
                fetchEquipment();
            })
            .catch(err => console.error('Błąd:', err));
    };

    const deleteEquipment = (id) => {
        fetch(`http://localhost:8080/api/equipment/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        })
            .then(() => fetchEquipment())
            .catch(err => console.error('Błąd usuwania:', err));
    };

    const toggleAvailability = (id, currentStatus) => {
        fetch(`http://localhost:8080/api/equipment/${id}/availability`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify({ available: !currentStatus })
        })
            .then(() => fetchEquipment())
            .catch(err => console.error('Błąd zmiany dostępności:', err));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Zarządzaj sprzętem</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    placeholder="Nazwa"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Typ (np. VR)"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2">Dodaj</button>
            </form>

            <ul className="list-disc list-inside space-y-2">
                {equipment.map(eq => (
                    <li key={eq.id}>
                        <span>{eq.name} ({eq.type}) — {eq.available ? 'Dostępny' : 'Niedostępny'}</span>
                        <button
                            onClick={() => toggleAvailability(eq.id, eq.available)}
                            className="ml-4 bg-yellow-400 px-2 py-1 text-sm rounded"
                        >
                            Zmień dostępność
                        </button>
                        <button
                            onClick={() => deleteEquipment(eq.id)}
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

export default AdminEquipmentManager;
