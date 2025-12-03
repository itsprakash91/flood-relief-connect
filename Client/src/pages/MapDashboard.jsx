import React from "react";
import MapView from "../components/Map/MapView";
import MapControls from "../components/Map/MapControls";

export default function MapDashboard() {
  return (
    <div className="w-full h-[90vh] relative">
      <MapView />
      <div className="absolute top-4 left-4 z-50">
        <MapControls />
      </div>
    </div>
  );
}
