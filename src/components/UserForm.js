import React, { useState, useEffect } from 'react';

// UserForm Component
function UserForm({ isEditing, editingUser, onCreateUser, onUpdateUser, onCancel }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: {
      street: '',
      city: '',
    },
    company: {
      name: '',
    },
    website: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Pre-fill the form when editing
  useEffect(() => {
    if (isEditing && editingUser) {
      setUser({ ...editingUser });
    } else {
      resetForm();
    }
  }, [isEditing, editingUser]);

  const resetForm = () => {
    setUser({
      name: '',
      email: '',
      phone: '',
      username: `USER-${Math.random().toString(36).substring(2, 5)}`, // Auto-generated username format
      address: {
        street: '',
        city: '',
      },
      company: {
        name: '',
      },
      website: '',
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects like address and company
    if (name.includes('address.') || name.includes('company.')) {
      const [section, field] = name.split('.');
      setUser((prevUser) => ({
        ...prevUser,
        [section]: {
          ...prevUser[section],
          [field]: value,
        },
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }

    // Clear validation errors
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!user.name || user.name.length < 3) errors.name = 'Name is required and must be at least 3 characters.';
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) errors.email = 'A valid email is required.';
    if (!user.phone || !/^\d{10}$/.test(user.phone)) errors.phone = 'Phone number must be exactly 10 digits.';
    if (!user.username || user.username.length < 3) errors.username = 'Username is required and must be at least 3 characters.';
    if (!user.address.street) errors.street = 'Street is required.';
    if (!user.address.city) errors.city = 'City is required.';
    if (user.company.name && user.company.name.length < 3) errors.companyName = 'If provided, company name must be at least 3 characters.';
    if (user.website && !/^https?:\/\/.+/.test(user.website)) errors.website = 'Website must be a valid URL.';

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    // Call the appropriate function based on editing mode
    if (isEditing) {
      onUpdateUser(user);
    } else {
      onCreateUser(user);
    }
    resetForm(); // Reset the form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Create User'}</h3>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
          minLength={3}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.name ? 'border-red-500' : ''}`}
        />
        {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.email ? 'border-red-500' : ''}`}
        />
        {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
      </div>

      {/* Phone Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
        <input
          type="tel"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          required
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.phone ? 'border-red-500' : ''}`}
        />
        {validationErrors.phone && <p className="text-red-500 text-xs italic">{validationErrors.phone}</p>}
      </div>

      {/* Username Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          readOnly // Make it non-editable
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Address Inputs */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Street:</label>
        <input
          type="text"
          name="address.street"
          value={user.address.street}
          onChange={handleChange}
          required
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.street ? 'border-red-500' : ''}`}
        />
        {validationErrors.street && <p className="text-red-500 text-xs italic">{validationErrors.street}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">City:</label>
        <input
          type="text"
          name="address.city"
          value={user.address.city}
          onChange={handleChange}
          required
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.city ? 'border-red-500' : ''}`}
        />
        {validationErrors.city && <p className="text-red-500 text-xs italic">{validationErrors.city}</p>}
      </div>

      {/* Company Name Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Company Name:</label>
        <input
          type="text"
          name="company.name"
          value={user.company.name}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.companyName ? 'border-red-500' : ''}`}
        />
        {validationErrors.companyName && <p className="text-red-500 text-xs italic">{validationErrors.companyName}</p>}
      </div>

      {/* Website Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Website:</label>
        <input
          type="url"
          name="website"
          value={user.website}
          onChange={handleChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${validationErrors.website ? 'border-red-500' : ''}`}
        />
        {validationErrors.website && <p className="text-red-500 text-xs italic">{validationErrors.website}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => { resetForm(); onCancel(); }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isEditing ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
