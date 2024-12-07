import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
      
    }

    const fetchRoles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'roles'));
      const rolesData = querySnapshot.docs.map((doc) => {
        const roleName= doc.data().roleName;
        setRole(roleName)
      });

      
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      console.error('User ID is missing.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        name,
        email,
        role,
        status,
      });

      setMessage('User updated successfully!');
    
      if (onUserUpdated) {
        onUserUpdated();
      }

      
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        {message && (
          <div
            className={`mb-4 text-center p-2 rounded ${
              message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((roleOption, index) => (
                <option key={index} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
