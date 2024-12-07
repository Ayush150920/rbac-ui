import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';

const UserManagement = ({ permissions }) => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [newUserDetails, setNewUserDetails] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');
  const roles = ['Admin', 'Editor', 'Viewer'];

  // Check if the current role has a specific permission
  const hasPermission = (permission) => permissions?.includes(permission);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (hasPermission('Read')) fetchUsers();
  }, [permissions]);

  // Check if a user already exists based on email
  const checkIfUserExists = async (email) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // If empty, the email doesn't exist
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  // Add a new user to Firestore
  const handleAddUser = async (name, email, role, status, password) => {
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      setError('User with this email already exists.');
      return;
    }
    setError(''); // Clear error if email is unique

    try {
      const newUser = { name, email, role, status, password };
      const docRef = await addDoc(collection(db, 'users'), newUser);
      setUsers((prevUsers) => [...prevUsers, { id: docRef.id, ...newUser }]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Edit an existing user in Firestore
  const handleEditUser = async () => {
    try {
      const userDoc = doc(db, 'users', editUserId);
      await updateDoc(userDoc, { name: newUserDetails.name, email: newUserDetails.email, role: newUserDetails.role });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUserId
            ? { ...user, name: newUserDetails.name, email: newUserDetails.email, role: newUserDetails.role }
            : user
        )
      );
      setEditUserId(null);
      setNewUserDetails({});
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a user from Firestore
  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Render a message if the user doesn't have the required 'Read' permission
  if (!hasPermission('Read')) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {hasPermission('Write') && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add User
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.status}</td>
              <td className="border p-2">
                {hasPermission('Write') && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => {
                      setEditUserId(user.id);
                      setNewUserDetails({ name: user.name, email: user.email, role: user.role, status: user.status });
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                )}

                {hasPermission('Delete') && (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={handleAddUser}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          user={newUserDetails}
          roles={roles}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={handleEditUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
