import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL);
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      const userIds = new Set();
      const allUsers = [
        ...response.data.filter((user) => {
          if (!userIds.has(user.id)) {
            userIds.add(user.id);
            return true;
          }
          return false;
        }),
        ...storedUsers.filter((user) => {
          if (!userIds.has(user.id)) {
            userIds.add(user.id);
            return true;
          }
          return false;
        }),
      ];

      setUsers(allUsers);
    } catch (error) {
      setError("Error fetching users. Please try again later.");
      toast.error("Error fetching users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (newUser) => {
    try {
      const maxId =
        users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
      const newUserWithId = { ...newUser, id: maxId + 1 };

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
      toast.error("Error updating user. Please try again.");
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== id);
      renumberUserIds(updatedUsers);
      toast.success("User deleted successfully!");
    }
  };

  const renumberUserIds = (updatedUsers) => {
    const renumberedUsers = updatedUsers.map((user, index) => ({
      ...user,
      id: index + 1,
    }));

    setUsers(renumberedUsers);
    localStorage.setItem("users", JSON.stringify(renumberedUsers));
  };

  const handleViewUser = (user) => {
    localStorage.setItem("viewUser", JSON.stringify(user));
    navigate(`/users/${user.id}`);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">
        User Management
      </h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-blue-300 focus:border-blue-400 focus:ring-blue-500 rounded-md p-2 w-full md:w-1/3"
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
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-300 transition duration-300 shadow-md"
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
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-2 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left">
                Phone
              </th>
              <th className="border border-gray-300 px-2 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-100 transition ${
                  index % 2 === 0 ? "bg-blue-100" : "bg-white" // Change colors here
                }`}
              >
                <td className="border border-gray-300 px-2 py-2">{user.id}</td>
                <td className="border border-gray-300 px-2 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {user.phone}
                </td>
                <td className="border border-gray-300 px-2 py-2 flex space-x-2">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-300"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300"
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
