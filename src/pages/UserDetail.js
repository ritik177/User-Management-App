import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaEnvelope, FaPhone, FaGlobe, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("User not found. Please check the user ID.");
        } else {
          setError("Error fetching user details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!user) return <div className="text-center">User not found.</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-400">
        User Details
      </h1>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-400 text-white text-center py-4">
          <img
            src={`https://i.pravatar.cc/150?img=${id}`}
            alt={`${user.name}'s avatar`}
            className="rounded-full border-4 border-white w-24 h-24 object-cover mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold">{user.name}</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center my-3">
            <FaEnvelope className="text-indigo-500 mr-3" />
            <span className="text-gray-700"><strong>Email:</strong> {user.email}</span>
          </div>
          <div className="flex items-center my-3">
            <FaPhone className="text-indigo-500 mr-3" />
            <span className="text-gray-700"><strong>Phone:</strong> {user.phone}</span>
          </div>
          <div className="flex items-center my-3">
            <FaGlobe className="text-indigo-500 mr-3" />
            <span className="text-gray-700">
              <strong>Website:</strong> 
              <a href={`https://${user.website}`} className="text-indigo-500 ml-2" target="_blank" rel="noreferrer">
                {user.website}
              </a>
            </span>
          </div>
          {/* Address Section */}
          {user.address && (
            <div className="flex items-center my-3">
              <FaMapMarkerAlt className="text-indigo-500 mr-3" />
              <span className="text-gray-700">
                <strong>Address:</strong> {user.address.street}, {user.address.city}
              </span>
            </div>
          )}
          {/* Company Section */}
          {user.company && (
            <div className="flex items-center my-3">
              <FaBuilding className="text-indigo-500 mr-3" />
              <span className="text-gray-700">
                <strong>Company:</strong> {user.company.name}
              </span>
            </div>
          )}
        </div>
        <div className="bg-gray-100 text-center py-4">
          <button
            onClick={() => window.history.back()}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-500 transition duration-300"
          >
            Back to Users
          </button>
        </div>
      </div>
    </div>
  );
}
export default UserDetail;