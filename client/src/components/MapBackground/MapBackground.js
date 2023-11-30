import './MapBackground.scss';
import React, { useRef, useEffect, useState, useContext } from 'react';
import GlobalStoreContext from '../../store';
import 'mapbox-gl/dist/mapbox-gl.css';
// import rewind from "@mapbox/geojson-rewind";
import mapboxgl from 'mapbox-gl';
// import usaGeoJSON from '../SampleGeoJSONs/USA_adm0-2.json';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA';
// const shp = require("shpjs");

export default function MapBackground() {
  const { store } = useContext(GlobalStoreContext);
  const mapContainer = store.container
  const map = useRef(null);
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43);
  //   const [count, setCount] = useState(1);

  useEffect(() => {
    if (map.current || typeof window === 'undefined') return;

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
    map.current.on('load', () => {
      map.current.addSource('map-source', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json',
      });

      // This renders the border of the GeoJSON
      map.current.addLayer({
        id: 'italy-border',
        type: 'line',
        source: 'map-source',
        paint: {
          'line-opacity': 1,
          'line-color': '#FFFFFF',
          'line-width': 1,
        },
      });

      // This fills in the regions of the GeoJSON
      map.current.addLayer({
        id: 'italy-border-fill',
        type: 'fill',
        source: 'map-source',
        paint: {
          'fill-opacity': 0.5,
          'fill-color': '#FFFFFF'
        }
      });

      // This layer fills in the region
      map.current.addLayer({
        id: 'italy-fill',
        type: 'fill',
        source: 'map-source',
        paint: {
          'fill-opacity': 0,
          'fill-color': '#FF0000'
        },
        filter: ['==', 'ID_1', ''], // Initially, no region is highlighted
      });

      // Mousemove event to highlight the region under the cursor
      map.current.on('mousemove', 'italy-border-fill', (e) => {
        const hoveredRegion = e.features[0];

        if (hoveredRegion) {
          const regionId = hoveredRegion.properties.ID_1;

          map.current.setFilter('italy-fill', ['==', 'ID_1', regionId]);
          map.current.setPaintProperty('italy-fill', 'fill-opacity', 1);
        }
      });

      // Reset the filter and opacity when the mouse leaves the layer
      map.current.on('mouseleave', 'italy-border-fill', () => {
        map.current.setFilter('italy-fill', ['==', 'ID_1', '']);
        map.current.setPaintProperty('italy-fill', 'fill-opacity', 0);
      });
    });
  }, [lng, lat, zoom]);

  return (
    <div>
      <div className="long-lat-bar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} className="map-container" />
    </div>
  );
}