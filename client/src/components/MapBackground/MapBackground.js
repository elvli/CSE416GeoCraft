import './MapBackground.scss';
import React, { useRef, useEffect, useState, useContext } from 'react';
import GlobalStoreContext from '../../store';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { Marker } from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA';

export default function MapBackground(props) {
  const { map } = props;
  const { store } = useContext(GlobalStoreContext);
  const mapContainer = store.container;
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43);
  const [update, setUpdate] = useState(false)

  async function generateMap(id, mapbox) {
    if (mapbox.current || typeof window === 'undefined') return;

    try {
      let admId = 'ID_0';

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
        mapbox.current.addSource('propSymbol-map', {
          type: 'geojson',
          data: null,
        });
        mapbox.current.addSource('line-map', {
          type: 'geojson',
          data: null,
        });

        map.current.addLayer({
          'id': 'points',
          'type': 'circle',
          'source': 'point-map',
          'minzoom': 1,
          'paint': {
            'circle-color': [
              'match',
              ['get', 'color'],
              'white', 'white',
              'black', 'black',
              'red', 'red',
              'orange', 'orange',
              'yellow', 'yellow',
              'green', 'green',
              'blue', 'blue',
              'purple', 'purple',
              'white'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1,
              0,
              2,
              1
            ]
          }
        })

        map.current.addLayer({
          'id': 'propsymbol',
          'type': 'circle',
          'source': 'propSymbol-map',
          'minzoom': 1,
          'paint': {
            'circle-radius': ['get', 'size'],
            'circle-color': [
              'match',
              ['get', 'color'],
              'white', 'white',
              'black', 'black',
              'red', 'red',
              'orange', 'orange',
              'yellow', 'yellow',
              'green', 'green',
              'blue', 'blue',
              'purple', 'purple',
              'white'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1,
              0,
              2,
              1
            ]
          }
        })

        mapbox.current.addLayer({
          id: 'lines',
          type: 'line',
          source: 'line-map',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
            },
            paint: {
            'line-color': [
              'match',
              ['get', 'color'],
              'white', 'white',
              'black', 'black',
              'red', 'red',
              'orange', 'orange',
              'yellow', 'yellow',
              'green', 'green',
              'blue', 'blue',
              'purple', 'purple',
              'white'
            ],
            'line-width': 2.5
            },
            filter: ['in', '$type', 'LineString']
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
            'fill-color': '#FFFFFF',
            'fill-opacity': 0.5
          }
        });

        mapbox.current.addLayer({
          id: 'highlight-region',
          type: 'fill',
          source: 'map-source',
          paint: {
            'fill-color': '#FFFFFF',
            'fill-opacity': 1
          },
          filter: ['==', admId, ''],
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'region-name-popup',
        });

        // This highlights a region and creates a popup with the region when you hover over it
        mapbox.current.on('mousemove', 'geojson-border-fill', (e) => {
          const hoveredRegion = e.features[0];

          if (hoveredRegion) {
            let regionId;
            let regionName;

            for (let i = 5; i >= 0; i--) {
              admId = `ID_${i}`;
              const admName = `NAME_${i}`;
              if (hoveredRegion.properties.hasOwnProperty(admName)) {

                regionId = hoveredRegion.properties[admId];
                regionName = hoveredRegion.properties[admName];
                break;
              }
            }

            mapbox.current.setFilter('highlight-region', ['==', admId, regionId]);
            mapbox.current.setPaintProperty('highlight-region', 'fill-opacity', 1);

            popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(mapbox.current);
          }
        });

        // This unhighlights a region and removes the popup when no longer hovering over it
        mapbox.current.on('mouseleave', 'geojson-border-fill', () => {
          mapbox.current.setFilter('highlight-region', ['==', admId, '']);
          mapbox.current.setPaintProperty('highlight-region', 'fill-opacity', 0);

          popup.remove();
        }
        );

        setUpdate(true)
      });

    } catch (error) {
      console.error('Error generating map:', error);
    }
  }

  useEffect(() => {
    generateMap(store.currentList ? store.currentList._id : null, map);
  }, []);

  useEffect(() => {
    setUpdate(false)
    const updateMapData = async () => {
      try {
        if (store.currentList) {
          const mapData = await store.getMapDataById(store.currentList._id);
          if (mapData && mapData.settings.latitude && mapData.settings.longitude && !isNaN(mapData.settings.latitude) && !isNaN(mapData.settings.longitude)) {

            var latitude = Math.min(90, Math.max(-90, parseFloat(mapData.settings.latitude)));
            var longitude = Math.min(180, Math.max(-180, parseFloat(mapData.settings.longitude)));

            setLng(longitude)
            setLat(latitude)
            map.current.setCenter([longitude, latitude])
          }
          if (mapData && mapData.settings.zoom && !isNaN(mapData.settings.zoom)) {
            var zoomVal = 0
            if (parseFloat(mapData.settings.zoom) > 22) {
              zoomVal = 22
            }
            else if (parseFloat(mapData.settings.zoom) < 1) {
              zoomVal = 1
            }
            else {
              zoomVal = parseFloat(mapData.settings.zoom)
            }
            setZoom(parseFloat(zoomVal))
            map.current.setZoom([parseFloat(zoomVal)])
          }
          const geoJSON = mapData.GeoJson ? mapData.GeoJson : 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json';
          map.current.getSource('map-source').setData(geoJSON);



          if (store.currentList && store.currentList.mapType === "point") {
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            var pointsCollection = []
            if (mapData.points) {
              for (let i in mapData.points) {
                if (mapData.points[i]['longitude'] && mapData.points[i]['latitude'] && !isNaN(mapData.points[i]['longitude']) && !isNaN(mapData.points[i]['latitude'])) {
                  var latitude = Math.min(90, Math.max(-90, parseFloat(mapData.points[i]['latitude'])));
                  var longitude = Math.min(180, Math.max(-180, parseFloat(mapData.points[i]['longitude'])));
                  pointsCollection.push([latitude, longitude, mapData.points[i]['id'], mapData.points[i]['color']])
                }
              }
            }

            var myGeoJSON = {};
            myGeoJSON.type = "FeatureCollection";
            myGeoJSON.features = [];
            pointsCollection.map((point) =>
              myGeoJSON.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [parseFloat(point[1]), parseFloat(point[0])]
                },
                'properties': {
                  'color': point[3],
                  'id': point[2]
                }
              })
            )
            map.current.getSource('point-map').setData(myGeoJSON);
          }
          else if (store.currentList && store.currentList.mapType === "propSymb") {
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            var pointsCollection = []
            if (mapData.propPoints) {
              for (let i in mapData.propPoints) {
                if (mapData.propPoints[i]['longitude'] && mapData.propPoints[i]['latitude'] && mapData.propPoints[i]['size'] 
                && !isNaN(mapData.propPoints[i]['longitude']) && !isNaN(mapData.propPoints[i]['latitude']) && !isNaN(mapData.propPoints[i]['size'])) {

                  var latitude = Math.min(90, Math.max(-90, parseFloat(mapData.propPoints[i]['latitude'])));
                  var longitude = Math.min(180, Math.max(-180, parseFloat(mapData.propPoints[i]['longitude'])));
                  var size = Math.max(1, parseFloat(mapData.propPoints[i]['size']))
                  pointsCollection.push([latitude, longitude, mapData.propPoints[i]['id'], mapData.propPoints[i]['color'], size])
                }
              }
            }

            var myGeoJSON = {};
            myGeoJSON.type = "FeatureCollection";
            myGeoJSON.features = [];
            pointsCollection.map((point) =>
              myGeoJSON.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [parseFloat(point[1]), parseFloat(point[0])]
                },
                'properties': {
                  'color': point[3],
                  'id': point[2],
                  'size': point[4],
                }
              })
            )
            map.current.getSource('propSymbol-map').setData(myGeoJSON);
              
          }


          else if (store.currentList && store.currentList.mapType === "line") {
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });

            var pointsCollection = []
            if (mapData.lineData) {
              for (let i in mapData.lineData) {
                if (mapData.lineData[i]['startlongitude'] && mapData.lineData[i]['startlatitude'] 
                && !isNaN(mapData.lineData[i]['startlongitude']) && !isNaN(mapData.lineData[i]['startlatitude']
                && mapData.lineData[i]['endlongitude'] && mapData.lineData[i]['endlatitude'] 
                && !isNaN(mapData.lineData[i]['endlongitude']) && !isNaN(mapData.lineData[i]['endlatitude'])
                )) {

                  var slatitude = Math.min(90, Math.max(-90, parseFloat(mapData.lineData[i]['startlatitude'])));
                  var slongitude = Math.min(180, Math.max(-180, parseFloat(mapData.lineData[i]['startlongitude'])));
                  var elatitude = Math.min(90, Math.max(-90, parseFloat(mapData.lineData[i]['endlatitude'])));
                  var elongitude = Math.min(180, Math.max(-180, parseFloat(mapData.lineData[i]['endlongitude'])));
                  
                  pointsCollection.push([slatitude, slongitude, mapData.lineData[i]['id'], elatitude,  elongitude, mapData.lineData[i]['color']])
                }
              }
            }

            var myGeoJSON = {};
            myGeoJSON.type = "FeatureCollection";
            myGeoJSON.features = [];
            pointsCollection.map((point) =>
              myGeoJSON.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'LineString',
                  'coordinates': [
                    [parseFloat(point[1]), parseFloat(point[0])],
                    [parseFloat(point[4]), parseFloat(point[3])]
                  ]

                },
                'properties': {
                  'id': point[2],
                  'color' : point[5]
                }
              })
            )
            map.current.getSource('line-map').setData(myGeoJSON);
          }
          else if (store.currentList && store.currentList.mapType === "heat") {
            var tableData = mapData.heatmap.data
            var arr = []
            if(mapData.heatmap) {
              for(let i = 0; i < tableData.length; i++) {
                var lat = Math.min(90, Math.max(-90, parseFloat(tableData[i]['latitude'])));
                var long = Math.min(180, Math.max(-180, parseFloat(tableData[i]['longitude'])));
                var mag = Math.min(180, Math.max(-180, parseFloat(tableData[i]['magnitude'])));
                arr.push({ "type": "Feature", "properties": { "mag": mag }, "geometry": { "type": "Point", "coordinates": [ long, lat, 0 ] } })
              }
            }
            
            var json = {
              "type": "FeatureCollection",
              "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
              "features": []
            };
            json['features'] = arr
            console.log("print")
            generateHeatMap(json, mapData.heatmap.color)
          }

          else {
            map.current.getSource('map-source').setData({});
            map.current.getSource('point-map').setData({});
          }
        }
      } catch (error) {
        console.error('Error updating map data:', error);
      }
    };

    updateMapData();
  }, [update || store.currentList]);
  function generateHeatMap(mapData, color) {
    if(!map.current.getSource('earthquakes')) {
      map.current.addSource('earthquakes', {
        'type': 'geojson',
        'data': mapData
      });
  
      map.current.addLayer(
        {
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'earthquakes',
          'maxzoom': 9,
          'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': color,
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
            ]
          }
        },
        'waterway-label'
      );
  
      map.current.addLayer(
        {
          'id': 'earthquakes-point',
          'type': 'circle',
          'source': 'earthquakes',
          'minzoom': 7,
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
        },
        'waterway-label'
      );
    }
    else {
      map.current.getSource('earthquakes').setData(mapData);
    }

  }

  useEffect(() => {
    if (store.mapdata) {
      if (store.mapdata.type === 'heat') {
        if (store.mapdata.import) {
          // generateHeatMap(store.mapdata.data)
          store.emptyMapData()
        }
        else {
          if (store.mapdata.data.type === 'color') {
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-color', store.mapdata.data.data)
            store.emptyMapData()
          }
        }
      }
    }
  }, [store.mapdata])

  return (
    <div>
      <div className="long-lat-bar">
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container">
      </div>
    </div>
  );
}
