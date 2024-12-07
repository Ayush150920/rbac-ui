import React, { useState } from 'react';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState('Active'); // Default to Active
  const [userPassword, setUserPassword] = useState('');
  const roles = ['Admin', 'Editor', 'Viewer'];
  const statuses = ['Active', 'Inactive'];

  const handleAddUser = () => {
    if (userName && userEmail && userRole && userPassword) {
      // Passing status and password along with user details
      onUserAdded(userName, userEmail, userRole, userStatus, userPassword);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold">Add User</h2>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={userStatus}
            onChange={(e) => setUserStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
