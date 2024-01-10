import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';

function Maps(props) {
  const [isMapLoaded, setMapLoaded] = useState(false);
  const location = useLocation();
  const { lat, lon } = location.state;
  const lats = props.lats
  const logs = props.logs
  const width = props.width
  const height = props.height
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  });

  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true);
    }
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }
  return (
    <div style={{ width: width || '100%', height: height || '90vh' }} >
      {isMapLoaded ? (
        <GoogleMap
          center={{ lat: lat || lats, lng: lon || logs }}
          zoom={20}
          mapContainerStyle={{
            width: "100%",
            height: "100%"
          }}
        />
      ) : <div>Loading...</div>}
    </div>
  );
}

export default Maps;
