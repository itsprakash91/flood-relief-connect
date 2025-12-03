import React from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";

const MapControls = ({ center, setCenter, radius, setRadius }) => {
  const { location, getLocation } = useGeoLocation();

  const handleRecenter = () => {
    if (location) setCenter({ lat: location.lat, lng: location.lng });
    else getLocation();
  };

  return (
    <div className="absolute top-4 left-4 z-1000 bg-white shadow-lg p-3 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-blue-700 mb-2 text-sm">Map Controls</h3>

      <div className="space-y-2">
        <label className="block text-xs text-gray-600">Radius (meters):</label>
        <input
          type="range"
          min="1000"
          max="20000"
          step="1000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-700">{radius} m</p>
      </div>

      <button
        onClick={handleRecenter}
        className="mt-3 w-full bg-blue-700 text-white text-sm py-1.5 rounded-lg hover:bg-blue-800 transition-all"
      >
        📍 Recenter
      </button>
    </div>
  );
};

export default MapControls;
