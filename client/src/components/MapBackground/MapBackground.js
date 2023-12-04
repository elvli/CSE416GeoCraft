import './MapBackground.scss';
import React, { useRef, useEffect, useState, useContext } from 'react';
import GlobalStoreContext from '../../store';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Marker } from 'mapbox-gl';
import geobuf from 'geobuf';
import Pbf from 'pbf';
mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA';

export default function MapBackground(props) {
  const { store } = useContext(GlobalStoreContext);
  const mapContainer = store.container;
  const { map } = props;
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43);

  var points = <></>

  async function generateMap(id, mapbox) {
    if (mapbox.current || typeof window === 'undefined') return;

    try {
      mapbox.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [lng, lat],
        zoom: zoom,
      });

      mapbox.current.on('move', () => {
        setLng(mapbox.current.getCenter().lng.toFixed(4));
        setLat(mapbox.current.getCenter().lat.toFixed(4));
        setZoom(mapbox.current.getZoom().toFixed(2));
      });

      mapbox.current.on('load', () => {
        mapbox.current.addSource('map-source', {
          type: 'geojson',
          data: null,
        });
        mapbox.current.addSource('point-map', {
          type: 'geojson',
          data: null,
        });

        map.current.addLayer({
          'id': 'points',
          'type': 'circle',
          'source': 'point-map',
          'minzoom': 1,
          'paint': {
            // Size circle radius by earthquake magnitude and zoom level
            'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
            16,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
            ],
            // Color circle by earthquake magnitude
            'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1,
            'rgba(33,102,172,0)',
            2,
            'rgb(103,169,207)',
            3,
            'rgb(209,229,240)',
            4,
            'rgb(253,219,199)',
            5,
            'rgb(239,138,98)',
            6,
            'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            // Transition from heatmap to circle layer by zoom level
            'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            0,
            8,
            1
            ]
            }
        })

        mapbox.current.addLayer({
          id: 'geojson-border',
          type: 'line',
          source: 'map-source',
          paint: {
            'line-opacity': 1,
            'line-color': '#FFFFFF',
            'line-width': 1,
          },
        });

        mapbox.current.addLayer({
          id: 'geojson-border-fill',
          type: 'fill',
          source: 'map-source',
          paint: {
            'fill-opacity': 0.5,
            'fill-color': '#FFFFFF'
          }
        });

        mapbox.current.addLayer({
          id: 'italy-fill',
          type: 'fill',
          source: 'map-source',
          paint: {
            'fill-opacity': 0,
            'fill-color': '#FF0000'
          },
          filter: ['==', 'ID_1', ''],
        });
        
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'region-name-popup',
        });

        mapbox.current.on('mousemove', 'geojson-border-fill', (e) => {
          const hoveredRegion = e.features[0];

          if (hoveredRegion) {
            const regionId = hoveredRegion.properties.ID_1;
            const regionName = hoveredRegion.properties.NAME_1;

            mapbox.current.setFilter('italy-fill', ['==', 'ID_1', regionId]);
            mapbox.current.setPaintProperty('italy-fill', 'fill-opacity', 1);

            popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(mapbox.current);
          }
        });
        mapbox.current.on('mouseleave', 'geojson-border-fill', () => {
          mapbox.current.setFilter('italy-fill', ['==', 'ID_1', '']);
          mapbox.current.setPaintProperty('italy-fill', 'fill-opacity', 0);

          popup.remove();
        }
        );
      });

    } catch (error) {
      console.error('Error generating map:', error);
    }
  }

  useEffect(() => {
    generateMap(store.currentList ? store.currentList._id : null, map);
  }, [store.currentList]);

  useEffect(() => {
    const updateMapData = async () => {
      try {
        if (store.currentList) {
          const mapData = await store.getMapDataById(store.currentList._id);
          const geoJSON = mapData.GeoJson ? mapData.GeoJson : 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json';
          map.current.getSource('map-source').setData(geoJSON);
          var pointsCollection = []
          if (mapData.points){
            for (let i in mapData.points){
              if (mapData.points[i]['longitude'] && mapData.points[i]['latitude'] && !isNaN(mapData.points[i]['longitude']) && !isNaN(mapData.points[i]['latitude'])){
                pointsCollection.push( [mapData.points[i]['latitude'], mapData.points[i]['longitude'], mapData.points[i]['id']])
                console.log(pointsCollection)
              }
            }
          }

          var myGeoJSON = {};
          myGeoJSON.type = "FeatureCollection";
          myGeoJSON.features = [];
          pointsCollection.map((x) => 
          myGeoJSON.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [parseFloat(x[1]), parseFloat(x[0])]
            },
            'properties': {
              'id': x[2]
            }
          })
          )
          map.current.getSource('point-map').setData(myGeoJSON);
          
          
          
        }
      } catch (error) {
        console.error('Error updating map data:', error);
      }
    };

    updateMapData();
  }, [store.currentList]);

  return (
    <div>
      <div className="long-lat-bar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container">
      </div>
    </div>
  );
}
