import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ cases }) => {
  const getImageUrl = (caseItem) => {
    if (!caseItem.photoUrl) return null;
    return caseItem.photoUrl.startsWith('http') 
      ? caseItem.photoUrl 
      : `http://localhost:5000/uploads/${caseItem.photoUrl}`;
  };

  const center = cases.length > 0 
    ? [cases[0].latitude, cases[0].longitude]
    : [38.5, -80.0];

  return (
    <div className="leaflet-container">
      <MapContainer 
        center={center}
        zoom={cases.length > 0 ? 4 : 7} 
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {cases.map((c) => {
          const imageUrl = getImageUrl(c);
          return (
            <Marker 
              key={c.id} 
              position={[c.latitude, c.longitude]}
            >
              <Popup>
                <div style={{ minWidth: '250px' }}>
                  {imageUrl && (
                    <div style={{ 
                      width: '100%', 
                      height: '150px', 
                      overflow: 'hidden',
                      marginBottom: '10px',
                      borderRadius: '4px'
                    }}>
                      <img 
                        src={imageUrl} 
                        alt={c.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/250x150?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  <div style={{ lineHeight: '1.5' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>{c.name}</h3>
                    <p><strong>Status:</strong> {c.status}</p>
                    <p><strong>Date:</strong> {c.date}</p>
                    {c.description && (
                      <p style={{ marginTop: '8px' }}>{c.description}</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;