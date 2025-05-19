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

const DriverMap = ({ driver, customerLocation, restaurantLocation }) => {
    const [mapReady, setMapReady] = useState(false);
    const [driverPosition, setDriverPosition] = useState(driver?.location || [6.9271, 79.8612]); // Default to Colombo

    // Use provided locations or defaults
    const defaultRestaurantLocation = [6.9271, 79.8612]; // Colombo
    const defaultCustomerLocation = [6.9271, 79.8712]; // Slightly east of Colombo

    const actualRestaurantLocation = restaurantLocation || defaultRestaurantLocation;
    const actualCustomerLocation = customerLocation || defaultCustomerLocation;

    useEffect(() => {
        // Connect to WebSocket for real-time driver location updates
        if (driver?.id) {
            // Initialize WebSocket connection here
            const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:3001');
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'driverLocation' && data.driverId === driver.id) {
                    setDriverPosition([data.lat, data.lng]);
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [driver]);

    useEffect(() => {
        setMapReady(true);
    }, []);

    if (!mapReady) {
        return <div className="map-loading">Loading map...</div>;
    }

    // Calculate map bounds to fit all markers
    const bounds = L.latLngBounds([
        actualRestaurantLocation,
        actualCustomerLocation,
        ...(driver ? [driverPosition] : [])
    ]);

    return (
        <div className="driver-map-container">
            <MapContainer
                bounds={bounds}
                style={{ height: '300px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={actualRestaurantLocation}>
                    <Popup>Restaurant Location</Popup>
                </Marker>
                {driver && (
                    <Marker position={driverPosition}>
                        <Popup>{driver.name}'s Location</Popup>
                    </Marker>
                )}
                <Marker position={actualCustomerLocation}>
                    <Popup>Delivery Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default DriverMap;