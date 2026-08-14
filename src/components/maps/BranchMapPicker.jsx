"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Typography } from "antd";

const { Text } = Typography;

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, onPositionChange }) {
    useMapEvents({
        click(e) {
            const newPos = [e.latlng.lat, e.latlng.lng];
            onPositionChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export default function BranchMapPicker({ lat, lng, onMapClick }) {
    const [position, setPosition] = useState([lat, lng]);

    const handlePositionChange = (newLat, newLng) => {
        setPosition([newLat, newLng]);
        onMapClick(newLat, newLng);
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    padding: "8px 12px",
                    background: "#e6f7ff",
                    border: "1px solid #91d5ff",
                    borderRadius: "4px 4px 0 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Text strong style={{ color: "#0958d9" }}>
                    📍 Click anywhere on the map to set the branch location
                </Text>
            </div>
            <MapContainer
                center={position}
                zoom={15}
                style={{
                    height: 400,
                    width: "100%",
                    borderRadius: "0 0 8px 8px",
                    border: "1px solid #d9d9d9",
                }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                    position={position}
                    onPositionChange={handlePositionChange}
                />
            </MapContainer>
        </div>
    );
}