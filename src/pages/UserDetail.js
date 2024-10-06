import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserDetail({ users = [] }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Users prop:", users); // Log users to see if it’s populated
    console.log("User ID from params:", id); // Log the user ID
    const foundUser = users.find((user) => user.id === parseInt(id)); // Ensure id is an integer

    if (foundUser) {
      console.log("User found in props:", foundUser); // Log found user
      setUser(foundUser);
      setLoading(false); // Set loading to false if found
    } else {
      console.log("User not found in props, fetching from API..."); // Log for fetching
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          console.log("Fetching user from API...");
          const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
          console.log("Fetched user:", response.data); // Log fetched user
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error); // Log the error
          setError("Error fetching user details. Please try again later.");
        } finally {
          setLoading(false); // Always set loading to false here
        }
      };
      fetchUser();
    }
  }, [id, users]);

  useEffect(() => {
    console.log("User state updated:", user); // Log user state after it updates
  }, [user]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!user) return <div className="text-center">User not found.</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">User Details</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="md:w-1/3">
            <img
              src={`https://i.pravatar.cc/150?img=${id}`} // Placeholder for user avatar
              alt={`${user.name}'s avatar`}
              className="rounded-full border border-indigo-500 w-32 h-32 object-cover mx-auto"
            />
          </div>
          <div className="md:w-2/3 md:ml-6">
            <h2 className="text-2xl font-semibold text-indigo-600">{user.name}</h2>
            <p className="mt-2 text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Website:</strong> <a href={`https://${user.website}`} className="text-indigo-500">{user.website}</a>
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Address:</strong> {user.address.street}, {user.address.city}
            </p>
            <p className="mt-2 text-gray-700">
              <strong>Company:</strong> {user.company.name}
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition duration-300"
        >
          Back to Users
        </button>
      </div>
    </div>
  );
}

export default UserDetail;
