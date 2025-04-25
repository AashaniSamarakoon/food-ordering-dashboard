import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './styles/RestaurantMap.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const RestaurantMap = () => {
    const restaurantLocation = [51.505, -0.09]; // Replace with your actual coordinates

    return (
        <div className="map-container">
            <MapContainer
                center={restaurantLocation}
                zoom={15}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={restaurantLocation}>
                    <Popup>
                        <strong>Savory Bites</strong><br />
                        123 Culinary Street<br />
                        Foodville, FC 12345
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default RestaurantMap;