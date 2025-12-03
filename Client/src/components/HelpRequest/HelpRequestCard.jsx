import React, { useState } from "react";
import { createHelpRequest } from "../../api/helpRequests";
import { useGeoLocation } from "../../hooks/useGeoLocation";

const HelpRequestForm = () => {
  const { location, getLocation, error, loading: geoLoading } = useGeoLocation();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setMessage("Please allow location access first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      // Convert category to backend format (lowercase, match enum values)
      const categoryMap = {
        "Food": "food",
        "Medical": "medical",
        "Rescue": "rescue",
        "Shelter": "shelter",
        "Other": "other"
      };
      
      const payload = {
        typeOfHelp: categoryMap[formData.category] || formData.category.toLowerCase(),
        description: formData.description,
        location: {
          coordinates: [location.longitude, location.latitude], // [longitude, latitude] as per GeoJSON
          address: formData.contact || undefined // Using contact as address placeholder
        }
      };

      const response = await createHelpRequest(payload);
      if (response && response.success) {
        setMessage("✅ Help request created successfully!");
        setFormData({ name: "", contact: "", category: "", description: "" });
      } else {
        throw new Error(response?.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating help request:", error);
      setMessage(`❌ ${error.response?.data?.message || error.message || "Failed to create help request. Try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
        Create a Help Request
      </h2>

      {message && (
        <p className="text-center mb-3 text-sm text-gray-700">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type of Help Needed</option>
          <option value="food">Food</option>
          <option value="water">Water</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
          <option value="rescue">Rescue</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe the situation..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        {/* Location Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geoLoading ? "📍 Getting Location..." : "📍 Get Location"}
            </button>

            {location && (
              <span className="text-sm text-green-700">
                Lat: {(location.latitude || location.lat)?.toFixed(3) || "N/A"} | Lng: {(location.longitude || location.lng)?.toFixed(3) || "N/A"}
              </span>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              ⚠️ {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default HelpRequestForm;
