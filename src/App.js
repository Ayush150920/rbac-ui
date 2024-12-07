import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import Navbar from './components/Navbar';



const App = () => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]); // Permissions set by Navbar

  const auth = getAuth();

  // Update permissions based on the selected role
  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions);
    console.log('Updated Permissions:', newPermissions);
  };

  // Handle authentication state
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  }, [auth]);

  return (
    <Router>
      <div>
        {user && <Navbar updatePermissions={updatePermissions} />}
        
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/users"
            element={<UserManagement permissions={permissions} />}
          />
          {/* <Route
            path="/users/add"
            element={
              <ProtectedRoute allowedRoles={['admin']} permissions={permissions}>
                <AddUser />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/roles"
            element={<RoleManagement permissions={permissions} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
