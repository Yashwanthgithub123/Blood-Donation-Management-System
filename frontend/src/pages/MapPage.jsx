// src/pages/MapPage.jsx
import React, { useEffect } from "react";

const MapPage = () => {
  useEffect(() => {
    // Example using Google Maps
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 }, // Bengaluru default
      zoom: 12,
    });

    // Example donor marker
    new window.google.maps.Marker({
      position: { lat: 12.9616, lng: 77.5846 },
      map,
      title: "Donor near you (2.5 km)",
    });
  }, []);

  return (
    <div
      id="map"
      style={{
        height: "400px",
        width: "100%",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    ></div>
  );
};

export default MapPage;
