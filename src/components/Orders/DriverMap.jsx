import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
    const [driverPosition, setDriverPosition] = useState(null);
    const [driverPath, setDriverPath] = useState([]);
    
    // Custom icons for different markers
    const driverIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const restaurantIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [1, -34],
    });useEffect(() => {
        if (driver?.location) {
            const newPosition = driver.location;
            setDriverPosition(newPosition);
            setDriverPath(prevPath => [...prevPath, newPosition]);
        }
    }, [driver?.location]);

    useEffect(() => {
        // Connect to WebSocket for real-time driver location updates
        if (driver?.id) {
            const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:3001');
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'driverLocation' && data.driverId === driver.id) {
                    const newPosition = [data.lat, data.lng];
                    setDriverPosition(newPosition);
                    setDriverPath(prevPath => [...prevPath, newPosition]);
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [driver?.id]);

    useEffect(() => {
        setMapReady(true);
    }, []);

    if (!mapReady) {
        return <div className="map-loading">Loading map...</div>;
    }    const getMapBounds = () => {
        if (!restaurantLocation) return null;
        
        const points = [
            restaurantLocation,
            ...(driverPosition ? [driverPosition] : [])
        ].filter(Boolean);

        if (points.length < 1) return null;

        const bounds = L.latLngBounds(points);
        // Add padding to bounds
        return bounds.pad(0.2); // 20% padding around the bounds
    };

    const bounds = getMapBounds();
    
    if (!bounds) {
        return <div className="map-loading">Waiting for location data...</div>;
    }

    return (
        <div className="driver-map-container">            <MapContainer
                bounds={bounds}
                style={{ height: '400px', width: '100%' }}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {restaurantLocation && (
                    <Marker position={restaurantLocation} icon={restaurantIcon}>
                        <Popup>
                            <strong>Restaurant Location</strong>
                            <br />
                            Pickup Point
                        </Popup>
                    </Marker>
                )}
                {driverPosition && (
                    <Marker position={driverPosition} icon={driverIcon}>
                        <Popup>
                            <strong>{driver?.name || 'Driver'}'s Location</strong>
                            <br />
                            {new Date().toLocaleTimeString()}
                        </Popup>
                    </Marker>
                )}                {/* Show path between restaurant and driver */}
                {driverPosition && restaurantLocation && (
                    <Polyline
                        positions={[restaurantLocation, driverPosition]}
                        color="#2196F3"
                        weight={3}
                        opacity={0.7}
                        dashArray="10"
                    />
                )}
                {/* Show driver's past path */}
                {driverPath.length > 1 && (
                    <Polyline
                        positions={driverPath}
                        color="#4CAF50"
                        weight={3}
                        opacity={0.5}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default DriverMap;