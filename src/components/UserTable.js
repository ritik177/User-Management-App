import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return <div className="text-red-500 text-center mt-2">{message}</div>;
}

function UserTable() {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchUsers(); // Fetch users from the API on component mount
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL);
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Create a Set for unique user IDs
      const userIds = new Set();

      // Combine users from the API and local storage
      const allUsers = [
        ...response.data.filter((user) => {
          if (!userIds.has(user.id)) {
            userIds.add(user.id);
            return true; // Keep this user
          }
          return false; // Skip this user as it's a duplicate
        }),
        ...storedUsers.filter((user) => {
          if (!userIds.has(user.id)) {
            userIds.add(user.id);
            return true; // Keep this user
          }
          return false; // Skip this user as it's a duplicate
        }),
      ];

      setUsers(allUsers); // Set users after data is fetched
    } catch (error) {
      setError("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (newUser) => {
    try {
      const maxId =
        users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
      const newUserWithId = { ...newUser, id: maxId + 1 };

      // Simulate a post request
      await axios.post(API_URL, newUserWithId);

      const updatedUsers = [...users, newUserWithId];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setShowForm(false);
      toast.success("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error creating user. Please try again.");
      toast.error("Error creating user. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setIsEditing(false);
      setEditingUser(null);
      setShowForm(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user. Please try again.");
      toast.error("Error updating user. Please try again.");
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== id);
      renumberUserIds(updatedUsers); // Renumber IDs after deletion
      toast.success("User deleted successfully!");
    }
  };

  const renumberUserIds = (updatedUsers) => {
    const renumberedUsers = updatedUsers.map((user, index) => ({
      ...user,
      id: index + 1, // Renumbering starts from 1
    }));

    // Set state and local storage with renumbered users
    setUsers(renumberedUsers);
    localStorage.setItem("users", JSON.stringify(renumberedUsers)); // Update local storage with new IDs
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user.id}`); // Navigate to UserDetail with the user's ID
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        User Management
      </h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md p-2 w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={resetSearch}
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ml-2"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition duration-300 shadow-md"
        >
          Create New User
        </button>
      </div>

      {showForm && (
        <UserForm
          isEditing={isEditing}
          editingUser={editingUser}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-indigo-100 text-left">
              <th className="py-3 px-6 text-xs font-semibold text-indigo-700 uppercase">
                ID
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-indigo-700 uppercase">
                Name
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-indigo-700 uppercase">
                Email
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-indigo-700 uppercase">
                Phone
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-indigo-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{user.id}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.phone}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleViewUser(user)} // Update to call handleViewUser
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserTable;
