import '../App.css';
import React, { useRef, useEffect, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
// import rewind from "@mapbox/geojson-rewind";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsbWIwZ3J1dDAxZ24za3A5MmdwODlqM28ifQ._sB8UB-QSowmk91eIS0kwA';
// const shp = require("shpjs");

export default function LeftSideBar() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.12);
    const [lat, setLat] = useState(40.91);
    const [zoom, setZoom] = useState(10);
//   const [count, setCount] = useState(1);

useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Hard Code for GEOJSON ########################
    // map.current.on('load', () => {
    //   map.current.addSource('usa-border', {
    //     type: 'geojson',
    //     data: jsonfile
    //     //'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/USA.json'
    //   });

    //   map.current.addLayer({
    //     id: "usa",
    //     type: "line",
    //     source: "usa-border",
    //     paint: {
    //       "line-opacity": 1,
    //       "line-color": "#f05c5c",
    //       "line-width": 7
    //     },
    //   })
    // })
  });

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