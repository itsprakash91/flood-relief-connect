import React, { useContext, useEffect, useState } from "react";
import { RequestsContext } from "../../contexts/RequestContext";
import { getNearbyRequests, updateHelpRequestStatus } from "../../api/helpRequests";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import HelpRequestCard from "../HelpRequest/HelpRequestCard";
import { toast } from "react-hot-toast";

export default function VolunteerDashboard() {
  const { requests, setRequests } = useContext(RequestsContext);
  const { location, loading: geoLoading } = useGeoLocation();
  const [loading, setLoading] = useState(false);

  // Fetch nearby requests once geolocation is available
  useEffect(() => {
    if (!location) return;
    fetchNearby();
  }, [location]);

  const fetchNearby = async () => {
    try {
      setLoading(true);
      const { latitude, longitude } = location;
      const res = await getNearbyRequests(latitude, longitude, 5000); // radius 5000 meters (5 km)
      setRequests(res || []);
    } catch (err) {
      console.error("Error fetching nearby requests:", err);
      toast.error(err.response?.data?.message || "Failed to fetch nearby requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      // Get current user ID from context or localStorage
      const userData = localStorage.getItem("flood_user");
      const userId = userData ? JSON.parse(userData)?._id : null;
      
      if (!userId) {
        toast.error("Please login to accept requests");
        return;
      }

      await updateHelpRequestStatus(id, "accepted", userId);
      toast.success("Request accepted successfully!");
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "accepted" } : req
        )
      );
    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  if (geoLoading) return <p className="text-center mt-6">Getting your location...</p>;
  if (loading) return <p className="text-center mt-6">Loading nearby requests...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-blue-700">Volunteer Dashboard</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No help requests nearby yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <HelpRequestCard
              key={req._id}
              request={req}
              onAccept={() => handleAccept(req._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
