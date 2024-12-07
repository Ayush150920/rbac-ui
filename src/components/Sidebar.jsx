// src/components/Sidebar.js
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/" className="hover:text-gray-400">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="hover:text-gray-400">User Management</Link>
        </li>
        <li className="mb-4">
          <Link to="/roles" className="hover:text-gray-400">Role Management</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
