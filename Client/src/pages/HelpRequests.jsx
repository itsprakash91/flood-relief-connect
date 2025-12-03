import React, { useState, useEffect } from "react";
import HelpRequestForm from "../components/HelpRequest/HelpRequestCard";
import { getAllHelpRequests } from "../api/helpRequests";
import { Link } from "react-router-dom";

export default function HelpRequests() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllHelpRequests();
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Help Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          {showForm ? "View Requests" : "Create Request"}
        </button>
      </div>

      {showForm ? (
        <HelpRequestForm />
      ) : (
        <div>
          {loading ? (
            <p className="text-center text-gray-600">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">No help requests yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create First Request
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {request.typeOfHelp?.toUpperCase() || "Help Request"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {request.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        request.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : request.status === "accepted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {request.status || "pending"}
                    </span>
                    <Link
                      to={`/request/${request._id}`}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                  {request.location?.coordinates && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 Location: {request.location.coordinates[1]?.toFixed(2)},{" "}
                      {request.location.coordinates[0]?.toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

