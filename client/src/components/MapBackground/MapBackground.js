import './MapBackground.scss';
import React, { useRef, useEffect, useState, useContext } from 'react';
import GlobalStoreContext from '../../store';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import chroma from 'chroma-js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA';

export default function MapBackground(props) {
  const { map } = props;
  const { store } = useContext(GlobalStoreContext);
  const mapContainer = store.container;
  const [lng, setLng] = useState(-73.1231);
  const [lat, setLat] = useState(40.9172);
  const [zoom, setZoom] = useState(14.83);
  const [update, setUpdate] = useState(false)
  const [layersToRemove, setLayersToRemove] = useState([]);
  const downloadLinkRef = useRef(null);
  const isLayerAdded = useRef(false);
  const [legend, setLegend] = useState(<></>)

  async function generateMap(id, mapbox) {
    if (mapbox.current || typeof window === 'undefined') return;

    try {
      // THIS IS THE ID FOR THE ADMINISTRATIVE LEVELS, ID_0 WOULD BE THE HIGHEST (NATIONAL BORDERS AND SUCH)
      // ID_5 WOULD BE ONE OF THE LOWEST LEVELS (COUNTY/TOWN BORDERS AND THE LIKE)
      mapbox.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [lng, lat],
        zoom: zoom,
        preserveDrawingBuffer: true,
      });

      mapbox.current.on('move', () => {
        setLng(mapbox.current.getCenter().lng.toFixed(4));
        setLat(mapbox.current.getCenter().lat.toFixed(4));
        setZoom(mapbox.current.getZoom().toFixed(2));
      });

      mapbox.current.on('load', () => {
        // SETUP ALL THE REQUIRED MAPBOX SOURCES
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
        mapbox.current.addSource('choro-map', {
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

        generateHeatMap({
          type: 'FeatureCollection',
          features: []
        }, [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(33,102,172,0)',
          0.2,
          'rgb(103,169,207)',
          0.4,
          'rgb(209,229,240)',
          0.6,
          'rgb(253,219,199)',
          0.8,
          'rgb(239,138,98)',
          1,
          'rgb(178,24,43)'
        ])
        setUpdate(true)
      });

    } catch (error) {
      console.error('Error generating map:', error);
    }
  }




  // THIS useEffect CALLS THE generateMap FUNCTION ONCE THE COMPONENT RENDERS

  useEffect(() => {
    generateMap(store.currentList ? store.currentList._id : null, map);
  }, []);

  useEffect(() => {
    setUpdate(false)
    const updateMapData = async () => {
      try {
        layerCleanUp();
        if (store.currentList) {
          // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
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

          const geoJSON = mapData.GeoJson;
          if (geoJSON) {
            map.current.getSource('map-source').setData(geoJSON);
          }
          else {
            map.current.getSource('map-source').setData({
              type: 'FeatureCollection',
              features: []
            });
          }
          map.current.getSource('point-map').setData({
            type: 'FeatureCollection',
            features: []
          });
          map.current.getSource('line-map').setData({
            type: 'FeatureCollection',
            features: []
          });
          map.current.getSource('earthquakes').setData({
            type: 'FeatureCollection',
            features: []
          });
          map.current.getSource('choro-map').setData({
            type: 'FeatureCollection',
            features: []
          });
          map.current.getSource('propSymbol-map').setData({
            type: 'FeatureCollection',
            features: []
          });

          setLegend(<></>);




          // THIS HANDLES RENDERING POINT MAP DATA

          if (store.currentList && store.currentList.mapType === "point") {
            map.current.scrollZoom.enable();

            // THIS REMOVES ANY LAYERS ADDED FROM PREVIOUS MAPS
            layerCleanUp();

            // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('earthquakes').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('choro-map').setData({
              type: 'FeatureCollection',
              features: []
            });


            // THIS HANDLES HOVERING OVER REGIONS
            let admId = 'ID_0';

            if (map.current.getLayer('highlight-region')) {
              map.current.removeLayer('highlight-region');
            }

            map.current.addLayer({
              id: 'highlight-region',
              type: 'fill',
              source: 'map-source',
              paint: {
                'fill-color': '#FFFFFF',
                'fill-opacity': .2
              },
              filter: ['==', admId, ''],
            });

            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'region-name-popup',
            });

            // This highlights a region and creates a popup with the region when you hover over it
            map.current.on('mousemove', 'geojson-border-fill', (e) => {
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
                  else if (hoveredRegion.properties.hasOwnProperty('NAME')) {
                    regionId = hoveredRegion.properties['NAME'];
                    regionName = hoveredRegion.properties['NAME'];
                    break;
                  }
                }

                map.current.setFilter('highlight-region', ['==', admId, regionId]);
                map.current.setPaintProperty('highlight-region', 'fill-opacity', .5);

                popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(map.current);
              }
            });

            // This unhighlights a region and removes the popup when no longer hovering over it
            map.current.on('mouseleave', 'geojson-border-fill', () => {
              map.current.setFilter('highlight-region', ['==', admId, '']);
              map.current.setPaintProperty('highlight-region', 'fill-opacity', 0.2);

              popup.remove();
            });

            var pointsCollection = []
            if (mapData.points) {
              for (let i in mapData.points) {
                if (mapData.points[i]['longitude'] && mapData.points[i]['latitude'] && !isNaN(mapData.points[i]['longitude']) && !isNaN(mapData.points[i]['latitude'])) {
                  latitude = Math.min(90, Math.max(-90, parseFloat(mapData.points[i]['latitude'])));
                  longitude = Math.min(180, Math.max(-180, parseFloat(mapData.points[i]['longitude'])));
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

            if (mapData && mapData.legend && mapData.legend.length !== 0) {
              var title = ''
              if (mapData.legendTitle) {
                title = mapData.legendTitle;
              }
              var div =
                <div id="state-legend" className="legend">
                  <h4>{
                    title === '' ? ('Legend') :
                      title
                  }</h4>
                  {mapData.legend.map((row) => (
                    row['description'] !== '' ? (
                      row.color === 'White' ? (
                        <div className='legendTip'>
                          <span style={{ backgroundColor: row.color, border: '1px solid black' }} />
                          {row.description}
                        </div>
                      ) :
                        <div>
                          <span style={{ backgroundColor: row.color }} />
                          {row.description}
                        </div>
                    ) : <div></div>
                  ))
                  }

                </div>
              setLegend(div);
            }
          }




          // THIS HANDLES RENDERING PROPORTIONAL SYMBOLS MAP DATA

          else if (store.currentList && store.currentList.mapType === "propSymb") {
            if (window.location.href === 'http://localhost:3000/' || window.location.href === 'https://geocraftmaps.azurewebsites.net/')
            map.current.scrollZoom.disable();

            // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('earthquakes').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('choro-map').setData({
              type: 'FeatureCollection',
              features: []
            });




            // THIS HANDLES HOVERING OVER REGIONS
            let admId = 'ID_0';

            if (map.current.getLayer('highlight-region')) {
              map.current.removeLayer('highlight-region');
            }

            map.current.addLayer({
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
            map.current.on('mousemove', 'geojson-border-fill', (e) => {
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
                  else if (hoveredRegion.properties.hasOwnProperty('NAME')) {
                    regionId = hoveredRegion.properties['NAME'];
                    regionName = hoveredRegion.properties['NAME'];
                    break;
                  }
                }

                map.current.setFilter('highlight-region', ['==', admId, regionId]);
                map.current.setPaintProperty('highlight-region', 'fill-opacity', .5);

                popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(map.current);
              }
            });

            // This unhighlights a region and removes the popup when no longer hovering over it
            map.current.on('mouseleave', 'geojson-border-fill', () => {
              map.current.setFilter('highlight-region', ['==', admId, '']);
              map.current.setPaintProperty('highlight-region', 'fill-opacity', 0.2);

              popup.remove();
            });




            pointsCollection = []
            if (mapData.propPoints) {
              for (let i in mapData.propPoints) {
                if (mapData.propPoints[i]['longitude'] && mapData.propPoints[i]['latitude'] && mapData.propPoints[i]['size']
                  && !isNaN(mapData.propPoints[i]['longitude']) && !isNaN(mapData.propPoints[i]['latitude']) && !isNaN(mapData.propPoints[i]['size'])) {

                  latitude = Math.min(90, Math.max(-90, parseFloat(mapData.propPoints[i]['latitude'])));
                  longitude = Math.min(180, Math.max(-180, parseFloat(mapData.propPoints[i]['longitude'])));
                  var size = Math.max(1, parseFloat(mapData.propPoints[i]['size']))
                  pointsCollection.push([latitude, longitude, mapData.propPoints[i]['id'], mapData.propPoints[i]['color'], size])
                }
              }
            }

            myGeoJSON = {};
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

            if (mapData && mapData.legend && mapData.legend.length !== 0) {
              title = ''
              if (mapData.legendTitle) {
                title = mapData.legendTitle;
              }
              div =
                <div id="state-legend" className="legend">
                  <h4>{
                    title === '' ? ('Legend') :
                      title
                  }</h4>
                  {mapData.legend.map((row) => (
                    row['description'] !== '' ? (
                      row.color === 'White' ? (
                        <div className='legendTip'>
                          <span style={{ backgroundColor: row.color, border: '1px solid black' }} />
                          {row.description}
                        </div>
                      ) :
                        <div>
                          <span style={{ backgroundColor: row.color }} />
                          {row.description}
                        </div>
                    ) : <div></div>
                  ))
                  }
                </div>
              setLegend(div);
            }
          }




          // THIS HANDLES RENDERING LINE MAP DATA

          else if (store.currentList && store.currentList.mapType === "line") {
            map.current.scrollZoom.enable();

            // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('earthquakes').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('choro-map').setData({
              type: 'FeatureCollection',
              features: []
            });




            // THIS HANDLES HOVERING OVER REGIONS
            let admId = 'ID_0';

            if (map.current.getLayer('highlight-region')) {
              map.current.removeLayer('highlight-region');
            }

            map.current.addLayer({
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
            map.current.on('mousemove', 'geojson-border-fill', (e) => {
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
                  else if (hoveredRegion.properties.hasOwnProperty('NAME')) {
                    regionId = hoveredRegion.properties['NAME'];
                    regionName = hoveredRegion.properties['NAME'];
                    break;
                  }
                }

                map.current.setFilter('highlight-region', ['==', admId, regionId]);
                map.current.setPaintProperty('highlight-region', 'fill-opacity', .5);

                popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(map.current);
              }
            });

            // This unhighlights a region and removes the popup when no longer hovering over it
            map.current.on('mouseleave', 'geojson-border-fill', () => {
              map.current.setFilter('highlight-region', ['==', admId, '']);
              map.current.setPaintProperty('highlight-region', 'fill-opacity', 0.2);

              popup.remove();
            });




            pointsCollection = []
            if (mapData.lineData) {
              for (let i in mapData.lineData) {
                if (mapData.lineData[i]['startlongitude'] && mapData.lineData[i]['startlatitude']
                  && !isNaN(mapData.lineData[i]['startlongitude']) && !isNaN(mapData.lineData[i]['startlatitude']
                    && mapData.lineData[i]['endlongitude'] && mapData.lineData[i]['endlatitude']
                    && !isNaN(mapData.lineData[i]['endlongitude']) && !isNaN(mapData.lineData[i]['endlatitude'])
                  )) {
                  if (mapData.lineData[i]['startlatitude'] !== '' && mapData.lineData[i]['startlongitude'] !== ''
                    && mapData.lineData[i]['endlatitude'] !== '' && mapData.lineData[i]['endlongitude'] !== '') {

                    var slatitude = Math.min(90, Math.max(-90, parseFloat(mapData.lineData[i]['startlatitude'])));
                    var slongitude = Math.min(180, Math.max(-180, parseFloat(mapData.lineData[i]['startlongitude'])));
                    var elatitude = Math.min(90, Math.max(-90, parseFloat(mapData.lineData[i]['endlatitude'])));
                    var elongitude = Math.min(180, Math.max(-180, parseFloat(mapData.lineData[i]['endlongitude'])));

                    pointsCollection.push([slatitude, slongitude, mapData.lineData[i]['id'], elatitude, elongitude, mapData.lineData[i]['color']])
                  }

                }
              }
            }

            myGeoJSON = {};
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
                  'color': point[5]
                }
              })
            )
            map.current.getSource('line-map').setData(myGeoJSON);

            if (mapData && mapData.legend && mapData.legend.length !== 0) {
              title = ''
              if (mapData.legendTitle) {
                title = mapData.legendTitle;
              }
              div =
                <div id="state-legend" className="legend">
                  <h4>{
                    title === '' ? ('Legend') :
                      title
                  }</h4>
                  {mapData.legend.map((row) => (
                    row['description'] !== '' ? (
                      row.color === 'White' ? (
                        <div className='legendTip'>
                          <span style={{ backgroundColor: row.color, border: '1px solid black' }} />
                          {row.description}
                        </div>
                      ) :
                        <div>
                          <span style={{ backgroundColor: row.color }} />
                          {row.description}
                        </div>
                    ) : <div></div>
                  ))
                  }

                </div>
              setLegend(div);
            }
          }




          // THIS HANDLES RENDERING HEAT DATA

          else if (store.currentList && store.currentList.mapType === "heat") {
            map.current.scrollZoom.enable();

            // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('choro-map').setData({
              type: 'FeatureCollection',
              features: []
            });



            // THIS HANDLES HOVERING OVER REGIONS
            let admId = 'ID_0';

            if (map.current.getLayer('highlight-region')) {
              map.current.removeLayer('highlight-region');
            }

            map.current.addLayer({
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
            map.current.on('mousemove', 'geojson-border-fill', (e) => {
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
                  else if (hoveredRegion.properties.hasOwnProperty('NAME')) {
                    regionId = hoveredRegion.properties['NAME'];
                    regionName = hoveredRegion.properties['NAME'];
                    break;
                  }
                }

                map.current.setFilter('highlight-region', ['==', admId, regionId]);
                map.current.setPaintProperty('highlight-region', 'fill-opacity', 1);

                popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(map.current);
              }
            });

            // This unhighlights a region and removes the popup when no longer hovering over it
            map.current.on('mouseleave', 'geojson-border-fill', () => {
              map.current.setFilter('highlight-region', ['==', admId, '']);
              map.current.setPaintProperty('highlight-region', 'fill-opacity', 0.5);

              popup.remove();
            });




            var tableData = mapData.heatmap.data
            var arr = []
            if (mapData.heatmap) {
              for (let i = 0; i < tableData.length; i++) {
                var lat = Math.min(90, Math.max(-90, parseFloat(tableData[i]['latitude'])));
                var long = Math.min(180, Math.max(-180, parseFloat(tableData[i]['longitude'])));
                var mag = Math.min(180, Math.max(-180, parseFloat(tableData[i]['magnitude'])));
                arr.push({ "type": "Feature", "properties": { "mag": mag }, "geometry": { "type": "Point", "coordinates": [long, lat, 0] } });
              }
            }

            var json = {
              "type": "FeatureCollection",
              "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
              "features": []
            };
            json['features'] = arr;
            generateHeatMap(json, mapData.heatmap.color);
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-color', mapData.heatmap.color);
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-weight', mapData.heatmap.mag);
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-intensity', mapData.heatmap.int);
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-radius', mapData.heatmap.rad);
            map.current.setPaintProperty('earthquakes-heat', 'heatmap-opacity', mapData.heatmap.opac);

            if (mapData && mapData.legend && mapData.legend.length !== 0) {
              title = ''
              if (mapData.legendTitle) {
                title = mapData.legendTitle;
              }
              div =
                <div id="state-legend" className="legend">
                  <h5>{
                    title === '' ? ('Legend') :
                      title
                  }</h5>
                  {mapData.legend.map((row) => (
                    row['description'] !== '' ? (
                      row.color === 'White' ? (
                        <div className='legendTip'>
                          <span style={{ backgroundColor: row.color, border: '1px solid black' }} />
                          {row.description}
                        </div>
                      ) :
                        <div className='container'>
                          <div className='row'>
                            <div className='col-1'>
                              <span style={{ backgroundColor: row.color, borderRadius: '2px', width: '2vw', height: '3vh' }}></span>
                            </div>

                            <div className='col'> <h6>{row.description}</h6></div>

                          </div>
                        </div>
                    ) : <div></div>
                  ))
                  }

                </div>
              setLegend(div);
            }
          }




          // THIS HANDLES RENDERING CHOROPLETH MAP DATA

          else if (store.currentList && store.currentList.mapType === "choro") {
            map.current.scrollZoom.enable();

            // THIS REF SIGNALS WHETHER A CHOROPLETH MAP WAS ALREADY BEEN RENDERED OR NOT
            isLayerAdded.current = false;

            // THIS CLEARS GEOGRAPHIC DATA FROM OTHER MAP TYPES
            map.current.getSource('propSymbol-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('line-map').setData({
              type: 'FeatureCollection',
              features: []
            });
            map.current.getSource('point-map').setData({
              type: 'FeatureCollection',
              features: []
            });

            // THIS GRABS ALL THE REQUIRED DATA TO RENDER THE CHOROPLETH MAP
            tableData = mapData.choroData.regionData;
            var propName = mapData.choroData.choroSettings.propName;
            var choroTheme = mapData.choroData.choroSettings.theme;
            var stepCount = mapData.choroData.choroSettings.stepCount;
            var headerValue = mapData.choroData.choroSettings.headerValue;

            const dataValues = tableData.map(entry => parseInt(entry.data, 10));
            const dataRange = [Math.min(...dataValues), Math.max(...dataValues)];

            // THESE ARE THE GRADIENTS THAT WE ALLOW THE USER TO CHOOSE
            const colorGradients = [
              { name: 'Warm', gradient: 'linear-gradient(to right, #f7d559, #ffc300, #ff8c1a, #ff5733, #FF0000)' },
              { name: 'Cool', gradient: 'linear-gradient(to right, #96FFFF, #0013de)' },
              { name: 'Hot and Cold', gradient: 'linear-gradient(to right, #FF0000, #ff5733, #ff8c1a, #ffc300, #f7d559, #96FFFF, #71c4f7, #4b89ef, #264ee6, #0013de)' },
              { name: 'Forest', gradient: 'linear-gradient(to right, #fffece, #aede91, #83ca80, #41a65c, #288241, #288241)' },
              { name: 'Deep Forest', gradient: 'linear-gradient(to right, #d8dd91, #093104)' },
              { name: 'Lavender', gradient: 'linear-gradient(to right, #d0ceed, #a8aaed, #8281e6, #6569d2, #222572)' },
              { name: 'Sunset', gradient: 'linear-gradient(to right, #feff9c, #ff9c00, #ff741e, #bc2971, #7a136e)' },
              { name: 'Barbie', gradient: 'linear-gradient(to right, #f1f1f1, #d7b4da, #f358b4, #e8117c, #a20043)' },
              { name: 'Aquamirine', gradient: 'linear-gradient(to right, #fcfed5, #a5dcbb, #389bc2, #2a69b2, #293d9f)' },
              { name: 'Grayscale', gradient: 'linear-gradient(to right, #e5e4e5, #252425)' },
              { name: 'Baja Blast', gradient: 'linear-gradient(to right, #FCFB62, #17E0BC)' },
              { name: 'Vice City', gradient: 'linear-gradient(to right, #ffcc00, #ff3366, #cc33ff, #9933ff)' },
              { name: 'Evangelion', gradient: 'linear-gradient(to right, #c6faa6, #aff383, #936cad, #533975)' },
              { name: 'Rainbow', gradient: 'linear-gradient(to right, #ff0000, #ff9900, #ffff00, #33cc33, #3399ff, #6633cc)' },
            ];

            // THIS DIVIDE THE GRADIENT INTO HOWEVER MANY STEPS/GROUPS THE USER WANTS.
            // THIS UTILIZES THE chromajs LIBRARY
            function generateColors(steps, gradient) {
              const colorStops = gradient.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];

              if (colorStops.length < 2) {
                throw new Error('Invalid gradient format. At least two color stops are required.');
              }

              const colors = chroma
                .scale(colorStops)
                .colors(steps);

              return colors;
            }

            // THIS ASSIGNS THE APPROPRIATE COLOR TO THE REGION BASED ON ITS VALUE
            function interpolateColor(value, gradient, dataRange) {
              const gradientArray = generateColors(parseFloat(stepCount), gradient);
              const stepSize = (dataRange[1] - dataRange[0]) / stepCount;

              // FIND THE CORRESPONDING INDEX BASED ON THE value AND dataRange
              const index = Math.max(
                0,
                Math.min(
                  stepCount - 1,
                  Math.floor((value - dataRange[0]) / stepSize)
                )
              );

              const resultColor = gradientArray[index];

              return resultColor;
            }

            // THIS GETS THE VALUES FOR THE REGION, THE VALUE DETERMINES THE COLOR OF THE REGION
            function getValueForRegion(targetRegion) {
              const result = tableData.find(entry => entry.region === targetRegion);
              return result ? result.data : null;
            }

            // THIS FUNCTION FINDS THE GRADIENT DICTIONARY OBJECT WITH THE NAME: themeName
            const findGradient = (themeName) => colorGradients.find(theme => theme.name === themeName);

            const geoJSON = mapData.GeoJson;
            map.current.getSource('choro-map').setData(geoJSON);

            // THIS IS A TEMPORARY CONTAINER FOR NEWLY ADDED LAYERS THAT WILL NEED TO BE CLEANED UP LATER
            var choroLayerIDs = [];

            // THIS FUNCTION ADDS A LATER FOR EACH EXISTING REGION
            const addLayer = () => {
              const regionsArray = tableData.map(entry => entry.region);
              for (var i = 0; i < regionsArray.length; i++) {
                var color = interpolateColor(getValueForRegion(regionsArray[i]), findGradient(choroTheme).gradient, dataRange);
                const layerId = `${regionsArray[i]}-choro`;

                choroLayerIDs.push(layerId);

                // CHECK IF THE LAYER EXISTS ALREADY. IF IT DOES, REMOVE IT.
                const existingLayer = map.current.getLayer(layerId);

                if (existingLayer) {
                  map.current.removeLayer(layerId);
                }

                // ADD THE NEW LAYER ITS COLOR
                map.current.addLayer({
                  id: layerId,
                  type: 'fill',
                  source: 'choro-map',
                  filter: ['==', propName, regionsArray[i]],
                  paint: {
                    'fill-color': color,
                    'fill-opacity': 1,
                  },
                });
              }

              // CHECK IF THE CHOROPLETH BORDER LAYER EXISTS, IF IT DOES, REMOVE IT
              const borderLayerExists = map.current.getLayer('choro-border');

              if (borderLayerExists) {
                map.current.removeLayer('choro-border');
              }

              choroLayerIDs.push('choro-border');

              // ADD THE CHOROPLETH BORDER LAYER
              map.current.addLayer({
                id: 'choro-border',
                type: 'line',
                source: 'choro-map',
                paint: {
                  'line-opacity': 1,
                  'line-color': '#FFFFFF',
                  'line-width': 0.5,
                },
              });
            };

            // ONLY ATTEMPT TO ADD LAYER IF MAPBOX IS LOADED AND THERE IS DATA TO BE RENDERED
            const tryAddLayer = () => {
              if (!isLayerAdded.current && map.current.isStyleLoaded() && tableData.length > 0) {
                addLayer();
                isLayerAdded.current = true;
              } else {
                setTimeout(tryAddLayer, 100);
              }
            };

            // ONLY RUN tryAddLayer WHEN ON THE HOME PAGE, RENDERING ON THE EDIT PAGE IS HANDLED BY CHOROEDITBAR
            if (window.location.href === 'http://localhost:3000/' || window.location.href === 'https://geocraftmaps.azurewebsites.net/') {
              tryAddLayer();
            }

            if (mapData && mapData.legend && mapData.legend.length !== 0) {
              title = ''
              if (mapData.legendTitle) {
                title = mapData.legendTitle;
              }
              div =
                <div id="state-legend" className="legend">
                  <h4>{
                    title === '' ? ('Legend') :
                      title
                  }</h4>
                  {dataValues.length !== 0 && (
                    mapData.legend.map((row) => (
                      row['description'] !== '' ? (
                        row.color === 'White' ? (
                          <div className='legendTip'>
                            <span style={{ backgroundColor: row.color, border: '1px solid black' }} />
                            {row.description}
                          </div>
                        ) : (
                          <div>
                            <span style={{ backgroundColor: row.color }} />
                            {row.description}
                          </div>
                        )
                      ) : <div key={row.description}></div>
                    ))
                  )}

                </div>
              setLegend(div);
            }

            function findRegionValue(regionName) {
              var result = tableData.find(entry => entry.region === regionName);
              return result ? result.data : '0';
            }

            // THIS HANDLES HOVERING OVER REGIONS
            let admId = 'ID_0';

            if (map.current.getLayer('highlight-region')) {
              map.current.removeLayer('highlight-region');
            }

            map.current.addLayer({
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
            map.current.on('mousemove', 'geojson-border-fill', (e) => {
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
                  else if (hoveredRegion.properties.hasOwnProperty('NAME')) {
                    regionId = hoveredRegion.properties['NAME'];
                    regionName = hoveredRegion.properties['NAME'];
                    break;
                  }
                }

                map.current.setFilter('highlight-region', ['==', admId, regionId]);
                map.current.setPaintProperty('highlight-region', 'fill-opacity', 1);


                popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p> <p>${headerValue}: ${findRegionValue(regionName)}</p>`).addTo(map.current);
              }
            });

            // This unhighlights a region and removes the popup when no longer hovering over it
            map.current.on('mouseleave', 'geojson-border-fill', () => {
              map.current.setFilter('highlight-region', ['==', admId, '']);
              map.current.setPaintProperty('highlight-region', 'fill-opacity', 0.5);

              popup.remove();
            });





            // THIS SETS THE TEMPORARY ARRAY OF LAYER IDS TO THE STATE layersToRemove
            setLayersToRemove(choroLayerIDs);
          }




          else {
            // IF THE MAP TYPE IS NOT ONE OF THE FIVE WE SUPPORT, LOAD SET DATA TO {}
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




  // useEffect(() => {
  //   if (store.print === 1) {
  //     var string = store.currentList.name
  //     let link = document.createElement('a');
  //     link.download = string.concat('.png');
  //     link.href = map.current.getCanvas().toDataURL('image/png');
  //     link.click();

  //     store.setPrint(0)

  //   }
  //   else if (store.print === 2) {
  //     console.log(map.current.getCanvas().toDataURL('image/jpeg'))
  //     string = store.currentList.name
  //     let link = document.createElement('a');
  //     link.download = string.concat('.jpg');
  //     link.href = map.current.getCanvas().toDataURL('image/jpeg');
  //     link.click();

  //     store.setPrint(0)
  //   }
  // }, [store.print]);

  useEffect(() => {
    if (store.print === 1 || store.print === 2) {
      const canvas = map.current.getCanvas();
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      const inchesWidth = originalWidth / 96;
      const inchesHeight = originalHeight / 96;
      console.log(inchesWidth, inchesHeight)

      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = originalWidth * 4;
      offScreenCanvas.height = originalHeight * 4;
      offScreenCanvas.style.width = `${inchesWidth * 4}in`;
      offScreenCanvas.style.height = `${inchesHeight * 4}in`;

      const offScreenContext = offScreenCanvas.getContext('2d');

      // DRAW THE MAP ON THE OFF SCREEN CANVAS
      offScreenContext.drawImage(canvas, 0, 0, offScreenCanvas.width, offScreenCanvas.height);

      const string = store.currentList.name;
      const link = document.createElement('a');

      if (store.print === 1) {
        link.download = string.concat('.png');
        link.href = offScreenCanvas.toDataURL('image/png');
      } else if (store.print === 2) {
        link.download = string.concat('.jpg');
        link.href = offScreenCanvas.toDataURL('image/jpeg');
      }

      link.click();

      store.setPrint(0);
    }
  }, [store.print]);




  // THIS HANDLES HEAT MAP GENERATION

  function generateHeatMap(mapData, color) {
    if (!map.current.getSource('earthquakes')) {
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




  // THIS IS A LAYER CLEAN UP FUNCTION, IT REMOVES ANY EXISTING LAYERS 
  const layerCleanUp = () => {
    layersToRemove.forEach(layerID => {
      // CHECK IF LAYER EXISTS BEFORE REMOVING
      if (map.current.getLayer(layerID)) {
        map.current.removeLayer(layerID);
      }
    });

    setLayersToRemove([]);
  }




  // THIS IS OUR JS COMPONENT. ITS THE LONG LAT BAR THAT DISPLAYS INFO ON THE COORIDNATES AND ZOOM LEVELS OF THE MAP
  // MAP CONTAINER RENDERS THE MAPBOX MAP

  return (
    <div>
      <div className="long-lat-bar">
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container">
      </div>
      {legend}
    </div>
  );
}
