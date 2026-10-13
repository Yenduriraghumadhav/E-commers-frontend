import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./locationPicker.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEFAULT_POSITION = [17.385, 78.4867];

function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(event) {
      onPositionChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function MapRecenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateAddress = async (nextPosition) => {
    setPosition(nextPosition);
    setSelectedAddress(null);
    setErrorMessage("");
    setIsLoadingAddress(true);

    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(nextPosition[0]),
        lon: String(nextPosition[1]),
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
        headers: { "Accept-Language": "en" },
      });

      if (!response.ok) {
        throw new Error("Could not find an address for this location.");
      }

      const data = await response.json();
      const address = data.address || {};
      const formattedAddress = [
        address.house_number,
        address.road,
        address.neighbourhood || address.suburb,
        address.city || address.town || address.village,
        address.state,
      ]
        .filter(Boolean)
        .join(", ");

      setSelectedAddress({
        addressLine: formattedAddress || data.display_name || "",
        Pincode: address.postcode || "",
      });
      if (!formattedAddress && !data.display_name) {
        setErrorMessage("No address was found. Move the pin and try again.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Address lookup failed. Please try again.");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const useCurrentLocation = () => {
    setErrorMessage("");
    if (!navigator.geolocation) {
      setErrorMessage("Location access is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => updateAddress([coords.latitude, coords.longitude]),
      (error) => {
        setErrorMessage(
          error.code === error.PERMISSION_DENIED
            ? "Allow location access in your browser, or select a point on the map."
            : "Could not get your current location. Select a point on the map instead."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <section className="location-picker" aria-label="Choose delivery location">
      <div className="location-picker-heading">
        <div>
          <h3>Choose a delivery location</h3>
          <p>Click the map or move the pin to your address.</p>
        </div>
        <button
          className="location-current-button"
          type="button"
          onClick={useCurrentLocation}
          disabled={isLoadingAddress}
        >
          Use my location
        </button>
      </div>

      <MapContainer
        center={DEFAULT_POSITION}
        zoom={13}
        scrollWheelZoom
        className="location-picker-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter position={position} />
        <MapClickHandler onPositionChange={updateAddress} />
        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend(event) {
              const markerPosition = event.target.getLatLng();
              updateAddress([markerPosition.lat, markerPosition.lng]);
            },
          }}
        />
      </MapContainer>

      <div className="location-picker-result" aria-live="polite">
        {isLoadingAddress ? (
          <p>Finding address...</p>
        ) : selectedAddress ? (
          <>
            <p className="location-picker-address">{selectedAddress.addressLine}</p>
            <p className="location-picker-pincode">
              {selectedAddress.Pincode ? `Pincode ${selectedAddress.Pincode}` : "Pincode not available"}
            </p>
          </>
        ) : (
          <p>Select a point on the map to find its address.</p>
        )}
        {errorMessage && <p className="location-picker-error" role="alert">{errorMessage}</p>}
      </div>

      <button
        className="location-confirm-button"
        type="button"
        disabled={!selectedAddress?.addressLine || isLoadingAddress}
        onClick={() => onLocationSelect(selectedAddress)}
      >
        Use this address
      </button>
    </section>
  );
}