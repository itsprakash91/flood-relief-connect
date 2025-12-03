import React, { useEffect, useState } from "react";
import { getAllHelpRequests } from "../../api/helpRequests";
import { getAllDonations } from "../../api/donations";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    requests: 0,
    donations: 0,
    volunteers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, donRes] = await Promise.all([
          getAllHelpRequests(),
          getAllDonations(),
        ]);

        setStats({
          requests: reqRes?.length || 0,
          donations: donRes?.length || 0,
          volunteers: 12, // placeholder — can be dynamic from backend
        });
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Requests */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Help Requests
          </h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {stats.requests}
          </p>
        </div>

        {/* Donations */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {stats.donations}
          </p>
        </div>

        {/* Volunteers */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Active Volunteers
          </h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.volunteers}
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-600">
          Manage camps, monitor requests, and coordinate volunteers effectively.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
