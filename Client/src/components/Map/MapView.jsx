import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RequestMarker from "./RequestMarker";
import MapControls from "./MapControls";
import { getNearbyRequests } from "../../api/helpRequests";

const MapView = () => {
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default: India center
  const [radius, setRadius] = useState(5000); // meters
  const [requests, setRequests] = useState([]);

  // Load nearby requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNearbyRequests(center.lat, center.lng, radius);
        setRequests(data || []);
      } catch (error) {
        console.error("Error loading nearby requests", error);
      }
    };

    fetchData();
  }, [center, radius]);

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md border">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* OpenStreetMap base layer */}
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker rendering */}
        {requests.map((req) => (
          <RequestMarker key={req._id} request={req} />
        ))}

        {/* Search/filter controls */}
        <MapControls
          center={center}
          setCenter={setCenter}
          radius={radius}
          setRadius={setRadius}
        />

        {/* Circle for radius visualization */}
        <Circle
          center={center}
          radius={radius}
          pathOptions={{ color: "blue", fillColor: "#a3c4f3", fillOpacity: 0.2 }}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
