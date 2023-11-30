import './MapBackground.scss';
import React, { useRef, useEffect, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
// import rewind from "@mapbox/geojson-rewind";
import mapboxgl from 'mapbox-gl';
// import usaGeoJSON from '../SampleGeoJSONs/USA_adm0-2.json';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA';
// const shp = require("shpjs");

export default function MapBackground() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43);
  //   const [count, setCount] = useState(1);

  async function generateMap(geojson = null) {
    if (map.current || typeof window === 'undefined') return; // Check for the browser environment
    const mapboxgl = require('mapbox-gl'); // or import mapboxgl from 'mapbox-gl';

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

    // Hard Code for GEOJSON ########################
    map.current.on('load', () => {
      map.current.addSource('usa-border', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json'
      });

      map.current.addLayer({
        id: "usa",
        type: "line",
        source: "usa-border",
        paint: {
          "line-opacity": 1,
          "line-color": "#FFFFFF",
          "line-width": 7
        },
      })
    })
  }
  useEffect(() => {
    generateMap()
  }, []);

  return (
    <div>
      {/* <input type="file" style={{ height: '2.3vh', width: '100%' }} onChange={handleFile}/> */}
      <div className="long-lat-bar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} className="map-container" />
    </div>
  );
}