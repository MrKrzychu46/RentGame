import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import AdminEquipmentManager from './components/AdminEquipmentManager';
import AdminGameManager from './components/AdminGameManager';
import AdminReservationManager from './components/AdminReservationManager';
import AdminUserManager from './components/AdminUserManager';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="p-4">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/manage-equipment" element={<AdminEquipmentManager />} />
                    <Route path="/manage-games" element={<AdminGameManager />} />
                    <Route path="/manage-reservations" element={<AdminReservationManager />} />
                    <Route path="/manage-users" element={<AdminUserManager />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;
