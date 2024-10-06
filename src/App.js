import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import UserTable from './components/UserTable';
import UserDetail from './pages/UserDetail';
import './App.css';

function App() {
  return (
    <>
      <nav className="bg-blue-500 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-white text-xl font-semibold hover:text-gray-200">
            Home
          </Link>
        </div>
      </nav>
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<UserTable />} />
          <Route path="/users/:id" element={<UserDetail  />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
