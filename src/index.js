import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import mapboxgl from 'mapbox-gl';

const root = ReactDOM.createRoot(document.getElementById('root'));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


root.render(

    <React.StrictMode>

        <App />
    </React.StrictMode>
);