import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import { Button, TextField, CircularProgress } from '@mui/material';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setFormOpen(false);
  };

  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const deleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8"> {/* Increased max width for better tablet view */}
      <h1 className="text-3xl font-bold mb-4 text-center">User Management</h1>
      <Button 
        variant="contained" 
        onClick={() => setFormOpen(true)} 
        className="mb-4 w-full md:w-auto" // Full width button on mobile
      >
        Add User
      </Button>

      {/* Search Input */}
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        InputProps={{
          className: "text-sm md:text-base", // Responsive font size
        }}
      />

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <UserTable
          users={filteredUsers}
          onUpdateUser={updateUser}
          onDeleteUser={deleteUser}
        />
      )}

      {isFormOpen && <UserForm onClose={() => setFormOpen(false)} onSubmit={addUser} />}
    </div>
  );
};

export default Home;
