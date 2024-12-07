import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Navbar = ({ updatePermissions }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(''); // Reset error state
    try {
      const querySnapshot = await getDocs(collection(db, 'roles'));
      const rolesData = querySnapshot.docs.map((doc) => ({
        roleName: doc.data().roleName,
        permissions: doc.data().permissions || [],
      }));
      setRoles(rolesData);

      if (rolesData.length > 0) {
        const defaultRole = rolesData[0];
        setSelectedRole(defaultRole.roleName);
        updatePermissions(defaultRole.permissions);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to load roles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [updatePermissions]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);

    const selectedRoleData = roles.find((role) => role.roleName === newRole);
    if (selectedRoleData) {
      updatePermissions(selectedRoleData.permissions);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (loading) {
    return <div>Loading roles...</div>;  // You could use a spinner here
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Admin Dashboard</div>
      <div className="flex items-center">
        {/* Role Switcher Dropdown */}
        <label htmlFor="role-select" className="mr-2">Role:</label>
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="bg-gray-600 text-white rounded-md px-4 py-2 focus:outline-none"
        >
          {roles.map((role, index) => (
            <option key={index} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Link to="/dashboard" className="px-4 py-2">Dashboard</Link>
        <Link to="/users" className="px-4 py-2">User Management</Link>
        <Link to="/roles" className="px-4 py-2">Role Management</Link>
      </div>
    </nav>
  );
};

export default Navbar;
