import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export default function MapBackground() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43);

  useEffect(() => {
    if (map.current || typeof window === 'undefined') return; // Check for the browser environment

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Add GeoJSON data source
    map.current.on('load', () => {
      map.current.addSource('your-geojson-source', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json'
      });

      // Add a layer for your GeoJSON data
      map.current.addLayer({
        id: 'your-geojson-layer',
        type: 'fill',
        source: 'your-geojson-source',
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8
        }
      });

      // Add a hover effect
      map.current.on('mousemove', 'your-geojson-layer', function (e) {
        map.current.getCanvas().style.cursor = 'pointer';

        var feature = e.features[0];
        // Customize the popup content as needed
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<h3>' + feature.properties.name + '</h3>')
          .addTo(map.current);
      });

      // Reset the cursor and remove the hover effect when the mouse leaves the layer
      map.current.on('mouseleave', 'your-geojson-layer', function () {
        map.current.getCanvas().style.cursor = '';
        // Remove the popup
        map.current.getPopup().remove();
      });
    });

    // Cleanup function to remove the map when the component unmounts
    return () => map.current.remove();
  }, [lat, lng, zoom]);

  return (
    <div>
      <div className="long-lat-bar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
