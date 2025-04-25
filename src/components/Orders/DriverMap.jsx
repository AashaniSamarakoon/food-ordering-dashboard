import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './styles/DriverMap.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const DriverMap = ({ driver }) => {
    const [mapReady, setMapReady] = useState(false);
    const [driverPosition, setDriverPosition] = useState(driver?.location || [51.505, -0.09]);

    // Default locations
    const restaurantLocation = [51.505, -0.09];
    const customerLocation = [51.515, -0.09];

    // Initialize map
    useEffect(() => {
        setMapReady(true);

        // Simulate driver movement if driver exists
        if (driver) {
            const interval = setInterval(() => {
                setDriverPosition(prev => [
                    prev[0] + (Math.random() * 0.001 - 0.0005),
                    prev[1] + (Math.random() * 0.001 - 0.0005)
                ]);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [driver]);

    if (!mapReady) {
        return <div className="map-loading">Loading map...</div>;
    }

    return (
        <div className="driver-map-container">
            <MapContainer
                center={restaurantLocation}
                zoom={14}
                style={{ height: '300px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={restaurantLocation}>
                    <Popup>Restaurant Location</Popup>
                </Marker>
                {driver && (
                    <Marker position={driverPosition}>
                        <Popup>{driver.name}'s Location</Popup>
                    </Marker>
                )}
                <Marker position={customerLocation}>
                    <Popup>Customer Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default DriverMap;