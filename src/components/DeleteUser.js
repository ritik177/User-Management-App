import React, { useState } from "react";
import axios from "axios";

const DeleteUser = ({ userId, onDelete }) => {
  const [open, setOpen] = useState(false);

  // Function to handle user deletion
  const handleDelete = () => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(() => {
        onDelete(userId); // Notify parent component about deletion
        setOpen(false); // Close the modal after deletion
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <>
      {/* Delete Button */}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
            <h2 className="text-xl font-bold text-red-600 mb-4">Warning!</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              {/* Cancel Button */}
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              {/* Confirm Delete Button */}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUser;
