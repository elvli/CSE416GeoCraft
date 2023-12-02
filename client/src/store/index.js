import { createContext, useContext, useState, useRef } from 'react'
// import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'
import mapboxgl from 'mapbox-gl';
import { useLocation } from "react-router-dom";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  DISPLAY_MAP: "DISPLAY_MAP",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
}

// const tps = new jsTPS();

function GlobalStoreContextProvider(props) {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(12.7971);
  const [lat, setLat] = useState(41.8473);
  const [zoom, setZoom] = useState(5.43)
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'region-name-popup',
  });
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    container: mapContainer

  });

  const storeReducer = (action) => {
    const { type, payload } = action
    switch (type) {
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.currentList,
          container: store.container
        });
      }
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          container: store.container,

        });
      }
      default:
        return store
    }
  }

  function sortArray(sortType, mapArr) {
    //A-Z
    if (sortType == 3) {
      mapArr = mapArr.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        // names must be equal
        return 0;
      });

    }
    //Z-A
    else if (sortType == 4) {
      mapArr = mapArr.sort((b, a) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        // names must be equal
        return 0;
      });


    }
    //NEW
    else if (sortType == 1) {
      mapArr = mapArr.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })

    }
    //OLD
    else if (sortType == 2) {
      mapArr = mapArr.sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      })

    }
    //POPULAR
    else if (sortType == 5) {
      mapArr = mapArr.sort((a, b) => {
        if (a.published && b.published) {
          const numA = a.likes.length; // ignore upper and lowercase
          const numB = b.likes.length; // ignore upper and lowercase
          if (numA < numB) return 1;
          if (numA > numB) return -1;
          // names must be equal
          return 0;
        }
        else {
          if (a.published) return -1
          if (b.published) return 1
          return 0
        }
      });
    }

  }

  store.createNewMap = async function (title, mapType) {
    let newMapName = title
    console.log(auth.user)
    const response = await api.createMap(newMapName, auth.user.username, auth.user.email, mapType);
    console.log("createNewList response: " + response);
    if (response.status === 201) {
      console.log(response)
      const nextResponse = await api.createMapData(response.data.map._id)
      if (nextResponse.status === 201) {
        store.loadIdNamePairs()
      }
      else {
        console.log("mapData failed");
      }

    }
    else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  }

  store.loadIdNamePairs = function (id = null, type = null) {
    if (id != null) {
      async function asyncGetMap(id) {
        let mapID = await api.getMapById(id);
        if (mapID.data.success) {
          let map = mapID.data.map;
          async function asyncLoadIdNamePairs() {
            const response = await api.getMapPairs();
            if (response.data.success) {
              let pairsArray = response.data.idNamePairs;
              storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {
                  idNamePairs: pairsArray,
                  currentList: map
                }
              });
            } else {
              console.log("API FAILED TO GET THE LIST PAIRS");
            }
          }
          asyncLoadIdNamePairs();
        }
      }
      asyncGetMap(id);
    }
    else if (type != null) {

      async function asyncLoadIdNamePairs() {
        const response = await api.getMapPairs();
        if (response.data.success) {
          let pairsArray = response.data.idNamePairs;
          let arr = [];
          for (let key in pairsArray) {
            arr.push(pairsArray[key]);

          }
          sortArray(type, arr)
          storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
              idNamePairs: arr,
            }
          });
        } else {
          console.log("API FAILED TO GET THE LIST PAIRS");
        }
      }
      asyncLoadIdNamePairs();

    }
    else {
      async function asyncLoadIdNamePairs() {
        const response = await api.getMapPairs();
        if (response.data.success) {
          let pairsArray = response.data.idNamePairs;
          storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
              idNamePairs: pairsArray,
            }
          });
        } else {
          console.log("API FAILED TO GET THE LIST PAIRS");
        }
      }
      asyncLoadIdNamePairs();
    }
  };

  store.updateLikeDislike = function (id, maps) {
    async function updateList(map) {
      let response = await api.updateMapById(id, map);
      if (response.data.success) {
        store.loadIdNamePairs(id);
      }
    }
    updateList(maps);
  }

  store.updateMapDataById = async function (id, mapData) {
    console.log('store: ' + mapData)
    const response = await api.updateMapDataById(id, mapData);
    if (response.data.success) {
      console.log('Successfully updated mapdata')
    }
  }

  store.deleteMap = function () {
    async function deleteMap() {
      let response = await api.deleteMapById(store.currentList._id)
      console.log(store.currentList._id)
      if (response.data.success) {
        const newResponse = await api.deleteMapDataById(store.currentList._id)
        if (newResponse.data.success) {
          store.loadIdNamePairs()
        }
        else {
          console.log('delete mapdata failed')
        }

      }
    }
    deleteMap()
  }

  store.addComment = function (comment, user) {
    let newComment = { user: user.username, comment: comment, likes: [], dislikes: [] }
    store.currentList.comments.push(newComment)
    async function asyncAddComment() {
      const response = await api.updateUserFeedback(store.currentList._id, store.currentList);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList
        });
      }
    }
    asyncAddComment()
  }

  store.updateMultipleMaps = function (data) {
    async function asyncUpdateMultipleMaps(datas) {
      let response = await api.updateMultipleMaps(datas)
      if (response.data.success) {
        store.loadIdNamePairs()
      }
    }
    asyncUpdateMultipleMaps(data)
  }

  store.setCurrentList = function (id, mapbox) {
    async function asyncSetCurrentList(id) {
      let response = await api.getMapById(id);
      if (response.data.success) {
        let map = response.data.map;
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: map
        });
      }
      if (!location.pathname.includes('/profile')) {
        // generateMap if not on a /profile URL
        generateMap(id, mapbox)
      }
    }
    asyncSetCurrentList(id);
  }

  store.getMapDataById = async function (id) {
    async function getMapDataById(id) {
      try {
        let response = await api.getMapDataById(id);
        if (response.data.success) {
          console.log('STORE: ' + JSON.stringify(response.data.mapData));
          return response.data.mapData;
        } else {
          console.log('getMapDataById has thrown an error');
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    }

    return getMapDataById(id);
  };

  store.getGeoJSONById = async function (id) {
    async function getGeoJSONById(id) {
      try {
        let response = await api.getGeoJSONById(id);
        if (response.data.success) {
          console.log('STORE: ' + JSON.stringify(response.data.mapData));
          return response.data.mapData;
        } else {
          console.log('getGeoJSONById has thrown an error');
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    }

    return getGeoJSONById(id);
  };

  function generateMap(id, mapbox) {
    if (mapbox.current || typeof window === 'undefined') return;

    mapbox.current = new mapboxgl.Map({
      container: store.container.current,
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
        data: 'https://raw.githubusercontent.com/elvli/GeoJSONFiles/main/ITA_adm1-2.json',
      });

      // This renders the border of the GeoJSON
      mapbox.current.addLayer({
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
      mapbox.current.addLayer({
        id: 'italy-border-fill',
        type: 'fill',
        source: 'map-source',
        paint: {
          'fill-opacity': 0.5,
          'fill-color': '#FFFFFF'
        }
      });

      // This layer fills in the region
      mapbox.current.addLayer({
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
      mapbox.current.on('mousemove', 'italy-border-fill', (e) => {
        const hoveredRegion = e.features[0];

        if (hoveredRegion) {
          const regionId = hoveredRegion.properties.ID_1;
          const regionName = hoveredRegion.properties.NAME_1;

          mapbox.current.setFilter('italy-fill', ['==', 'ID_1', regionId]);
          mapbox.current.setPaintProperty('italy-fill', 'fill-opacity', 1);

          popup.setLngLat(e.lngLat).setHTML(`<p>${regionName}</p>`).addTo(mapbox.current);
        }
      });

      // Reset the filter and opacity when the mouse leaves the layer
      mapbox.current.on('mouseleave', 'italy-border-fill', () => {
        mapbox.current.setFilter('italy-fill', ['==', 'ID_1', '']);
        mapbox.current.setPaintProperty('italy-fill', 'fill-opacity', 0);

        popup.remove();
      });
    });
  }


  return (
    <GlobalStoreContext.Provider value={{
      store
    }}>
      {props.children}
    </GlobalStoreContext.Provider>
  );
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider };