import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "your-collection-name"));
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched data:", items);  // Check the data here
        setData(items);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array to only run once on mount

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>  {/* Updated heading */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Users</h3>
          <p className="text-3xl">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Roles</h3>
          <p className="text-3xl">{roleCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
