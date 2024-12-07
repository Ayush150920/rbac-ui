// src/components/EditRoleModal.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EditRoleModal = ({ isOpen, onClose, role, fetchRoles }) => {
  const [roleName, setRoleName] = useState(role.name || "");
  const [permissions, setPermissions] = useState(role.permissions || []);

  const handleCheckboxChange = (permission) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((perm) => perm !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roleRef = doc(db, "roles", role.id);
      await updateDoc(roleRef, {
        name: roleName,
        permissions,
      });
      fetchRoles(); 
      onClose(); 
    } catch (error) {
      console.error("Error updating role: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="mt-2 space-y-2">
              {["Read", "Write", "Delete"].map((permission) => (
                <div key={permission}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      onChange={() => handleCheckboxChange(permission)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{permission}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoleModal;
