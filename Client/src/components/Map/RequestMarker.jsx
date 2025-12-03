import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const RequestMarker = ({ request }) => {
  return (
    <Marker
      position={[request.latitude, request.longitude]}
      icon={icon}
      riseOnHover={true}
    >
      <Popup>
        <div className="text-sm">
          <h4 className="font-semibold text-blue-700">{request.category}</h4>
          <p className="text-gray-700 text-xs mb-1">{request.description}</p>
          <p className="text-gray-600 text-xs">📞 {request.contact}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default RequestMarker;
