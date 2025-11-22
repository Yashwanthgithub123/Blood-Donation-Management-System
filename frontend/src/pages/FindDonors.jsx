// src/pages/FindDonors.jsx
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "../styles/FindDonors.css";

// Donor icon
const bloodIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1484/1484864.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Default user icon
const userIcon = new L.Icon.Default();

// Convert degrees → radians
const toRadians = (deg) => (deg * Math.PI) / 180;

// Haversine formula (in KM)
const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const FindDonors = () => {
  const [filters, setFilters] = useState({ bloodGroup: "", city: "", district: "" });
  const [donors, setDonors] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  const mapRef = useRef(null);

  // Handle input change
  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // ✅ FIXED SEARCH FUNCTION — WORKS 100%
  const handleSearch = async (e) => {
    e.preventDefault();

    setLoadingSearch(true);
    setDonors([]);
    setSelectedDonor(null);
    setDistanceKm(null);

    try {
      const res = await axios.post("http://localhost:5000/api/donors/search", {
        bloodGroup: filters.bloodGroup || "",
        city: filters.city || "",
        district: filters.district || "",
      });

      if (res.data && res.data.success) {
        setDonors(res.data.donors || []);
        if (!showMap) setShowMap(true);
      } else {
        alert("No donors found");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Server error / Network error");
    } finally {
      setLoadingSearch(false);
    }
  };

  // ✅ find user's location
  const ensureUserLocation = (onSuccess) => {
    if (userLocation) return onSuccess(userLocation);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        onSuccess(loc);
      },
      () => {
        const fallback = [12.9716, 77.5946];
        setUserLocation(fallback);
        onSuccess(fallback);
      },
      { enableHighAccuracy: true }
    );
  };

  // ✅ Distance checker
  const onCheckDistance = (donor) => {
    setSelectedDonor(donor);
    setDistanceKm(null);

    ensureUserLocation((userLoc) => {
      const [ulat, ulng] = userLoc;

      const dlat = Number(donor.latitude);
      const dlng = Number(donor.longitude);

      if (!dlat || !dlng) {
        alert("Donor location missing.");
        return;
      }

      const km = haversineDistanceKm(ulat, ulng, dlat, dlng);
      setDistanceKm(km);

      setShowMap(true);

      if (mapRef.current) {
        mapRef.current.fitBounds(
          [
            [ulat, ulng],
            [dlat, dlng],
          ],
          { padding: [80, 80] }
        );
      }
    });
  };

  const onMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  // ✅ MIDPOINT FOR DISTANCE LABEL
  const getMidPoint = () => {
    if (!userLocation || !selectedDonor) return null;

    const [ulat, ulng] = userLocation;
    const dlat = Number(selectedDonor.latitude);
    const dlng = Number(selectedDonor.longitude);

    return [(ulat + dlat) / 2, (ulng + dlng) / 2];
  };

  return (
    <div className="finddonors-container">
      <h1 className="finddonors-title">Search Blood Donors</h1>
      <p className="finddonors-subtitle">Find compatible donors in your area</p>

      {/* FILTER CARD */}
      <div className="filter-card">
        <div className="filter-header">
          <span className="filter-icon">🔍</span>
          <h2>Search Filters</h2>
        </div>

        <form onSubmit={handleSearch}>
          <div className="filter-inputs">

            {/* Blood Group */}
            <div className="input-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* City */}
            <div className="input-group">
              <label>City</label>
              <input
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            {/* District */}
            <div className="input-group">
              <label>District</label>
              <input
                name="district"
                value={filters.district}
                onChange={handleChange}
                placeholder="Enter district"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="submit" className="search-btn" disabled={loadingSearch}>
              {loadingSearch ? "Searching..." : "🔎 Submit / Search"}
            </button>

            <button
              type="button"
              className="map-btn"
              onClick={() => {
                setShowMap((s) => !s);
                if (!userLocation) ensureUserLocation(() => {});
              }}
            >
              🗺️ {showMap ? "Hide Map" : "Show Map"}
            </button>
          </div>
        </form>
      </div>

      {/* RESULTS */}
      <div className="results-section">
        <h3>Results ({donors.length})</h3>

        {donors.length === 0 ? (
          <p className="muted">No donors yet — search above.</p>
        ) : (
          <div className="donor-list">
            {donors.map((d) => (
              <div className="donor-card" key={d._id}>
                <div className="donor-info">
                  <strong>{d.fullName}</strong>
                  <p>🩸 {d.bloodGroup}</p>
                  <p>📍 {d.city}, {d.district}</p>
                </div>

                <div className="donor-actions">
                  <button className="check-btn" onClick={() => onCheckDistance(d)}>
                    Check distance
                  </button>
                  <a className="contact-btn" href={`tel:${d.phone}`}>Call</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAP */}
      {showMap && (
        <div className="map-wrapper">
          <h2 className="map-heading">Nearby Donors</h2>

          <MapContainer
            center={userLocation || [12.9716, 77.5946]}
            zoom={10}
            scrollWheelZoom={true}
            style={{ height: "480px", width: "100%" }}
            whenCreated={onMapCreated}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* User marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {/* Donor markers */}
            {donors.map((d) => {
              const lat = Number(d.latitude);
              const lng = Number(d.longitude);

              if (!lat || !lng) return null;

              return (
                <Marker key={d._id} position={[lat, lng]} icon={bloodIcon}>
                  <Popup>
                    <strong>{d.fullName}</strong><br />
                    🩸 {d.bloodGroup}<br />
                    {d.city}
                  </Popup>
                </Marker>
              );
            })}

            {/* Line + Distance Tooltip */}
            {selectedDonor && userLocation && (
              <>
                <Polyline
                  positions={[
                    userLocation,
                    [Number(selectedDonor.latitude), Number(selectedDonor.longitude)],
                  ]}
                  color="#b30000"
                >
                  {/* ✅ Distance label on line */}
                  <Tooltip permanent direction="center">
                    <span style={{ fontWeight: "bold", color: "black" }}>
                      {distanceKm?.toFixed(2)} km
                    </span>
                  </Tooltip>
                </Polyline>

                <Marker
                  position={[
                    Number(selectedDonor.latitude),
                    Number(selectedDonor.longitude),
                  ]}
                  icon={bloodIcon}
                >
                  <Popup>
                    <strong>{selectedDonor.fullName}</strong><br />
                    Distance: {distanceKm?.toFixed(2)} km
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default FindDonors;
