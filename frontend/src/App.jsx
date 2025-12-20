import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/health-check" 
          element={token ? <HealthForm token={token} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
