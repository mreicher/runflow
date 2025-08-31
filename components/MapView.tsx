import React, { useEffect, useRef } from 'react';

// Declare Leaflet in the global scope to satisfy TypeScript
declare const L: any;

interface MapViewProps {
  path: { lat: number; lng: number }[];
  isStatic?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ path, isStatic = false }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const polylineRef = useRef<any | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map with zoom control disabled
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([51.505, -0.09], 13); // Default view
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (mapRef.current && path.length > 0) {
      if (!polylineRef.current) {
        // Create polyline if it doesn't exist
        polylineRef.current = L.polyline(path, { color: 'blue', weight: 5 }).addTo(mapRef.current);
      } else {
        // Update polyline with new path
        polylineRef.current.setLatLngs(path);
      }

      if (isStatic) {
        // Fit map to the bounds of the path for static views
        mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
      } else if (path.length > 0) {
        // Pan to the latest point for live tracking
        mapRef.current.panTo(path[path.length - 1]);
      }
    }
     // Invalidate size on component mount to ensure proper rendering
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 100);
    }

  }, [path, isStatic]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapView;