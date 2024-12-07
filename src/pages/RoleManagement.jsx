import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const RoleManagement = ({ permissions }) => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [permissionsState, setPermissionsState] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);
  const [newPermissions, setNewPermissions] = useState([]);
  const permissionsList = ['Read', 'Write', 'Delete'];

  const hasPermission = (permission) => permissions?.includes(permission);

  // Fetch roles from Firestore
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'roles'));
        const rolesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    if (hasPermission('Read')) {
      fetchRoles();
    }
  }, [permissions, hasPermission]);  // Added `hasPermission` in the dependency array

  const handleAddRole = async () => {
    try {
      const newRole = { roleName, permissions: permissionsState };
      const docRef = await addDoc(collection(db, 'roles'), newRole);
      setRoles((prevRoles) => [...prevRoles, { id: docRef.id, ...newRole }]);
      setRoleName('');
      setPermissionsState([]);
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleEditRole = async () => {
    try {
      if (!editRoleId) return;
      const roleDoc = doc(db, 'roles', editRoleId);
      await updateDoc(roleDoc, { roleName, permissions: newPermissions });
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === editRoleId ? { ...role, roleName, permissions: newPermissions } : role
        )
      );
      setEditRoleId(null);
      setRoleName('');
      setNewPermissions([]);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await deleteDoc(doc(db, 'roles', id));
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  if (!hasPermission('Read')) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Role Management</h2>
      {hasPermission('Write') && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Add Role</h3>
          <div className="mb-2">
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Role Name"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-2">
            <h4 className="text-md font-medium">Permissions:</h4>
            {permissionsList.map((perm) => (
              <label key={perm} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={perm}
                  checked={permissionsState.includes(perm)}
                  onChange={(e) => {
                    const { value } = e.target;
                    setPermissionsState((prev) =>
                      prev.includes(value)
                        ? prev.filter((p) => p !== value)
                        : [...prev, value]
                    );
                  }}
                  className="mr-2"
                />
                {perm}
              </label>
            ))}
          </div>
          <button
            onClick={handleAddRole}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Role
          </button>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Roles</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Role Name</th>
              <th className="border px-4 py-2">Permissions</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="border px-4 py-2">{role.roleName}</td>
                <td className="border px-4 py-2">
                  {Array.isArray(role.permissions)
                    ? role.permissions.join(', ')
                    : 'No permissions'}
                </td>
                <td className="border px-4 py-2">
                  {hasPermission('Write') && (
                    <button
                      onClick={() => {
                        setEditRoleId(role.id);
                        setRoleName(role.roleName);
                        setNewPermissions(role.permissions || []);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  {hasPermission('Delete') && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;
