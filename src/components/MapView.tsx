import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface MapViewProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title?: string;
  }>;
}

const MapView: React.FC<MapViewProps> = ({ center, zoom = 12, markers = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDRDTFpVwaAjihQ1SLUuCeZLuIRhBj4seY' // Replace with your actual API key
  });

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '0.375rem'
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
          animation={window.google.maps.Animation.DROP}
        />
      ))}
    </GoogleMap>
  ) : (
    <div 
      style={mapContainerStyle} 
      className="bg-gray-100 flex items-center justify-center"
    >
      <p className="text-gray-500">Loading map...</p>
    </div>
  );
};

export default MapView;
