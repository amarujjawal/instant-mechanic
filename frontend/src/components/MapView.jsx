import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
export default function MapView({ mechanics = [] }) {
  return (
    <div className="map-wrap">
      <MapContainer
        center={[23.2599, 77.4126]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mechanics
          .filter((m) => m.location?.lat)
          .map((m) => (
            <Marker
              key={m._id}
              position={[m.location.lat, m.location.lng]}
              icon={icon}
            >
              <Popup>
                <b>{m.name}</b>
                <br />
                {m.status}
                <br />
                {m.specialty}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
