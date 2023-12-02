import { createContext, useContext, useState, useRef } from 'react'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'
import mapboxgl from 'mapbox-gl';
export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    DISPLAY_MAP: "DISPLAY_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
}

const tps = new jsTPS();

function GlobalStoreContextProvider(props) {
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(12.7971);
    const [lat, setLat] = useState(41.8473);
    const [zoom, setZoom] = useState(5.43)
    const { auth } = useContext(AuthContext);
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
        const { type, payload} = action
        switch(type){
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

    store.createNewMap = async function (title, mapType) {
        let newMapName = title
        console.log(auth.user)
        const response = await api.createMap(newMapName, auth.user.username, auth.user.email, mapType);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            console.log(response)
            const nextResponse = await api.createMapData(response.data.map._id)
            if (nextResponse.status === 201){
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

    store.loadIdNamePairs = function (id = null) {
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
        else{
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
//     store.updateCommentsLikeDislike = function (id, maps) {
//         async function updateList(map) {
//             let response = await api.updateMapById(id, map);
//             if (response.data.success) {
//                 store.loadIdNamePairs(id);
//             }
//         }
//         updateList(maps);
// }

    store.deleteMap = function () {
        async function deleteMap() {
            let response = await api.deleteMapById(store.currentList._id)
            console.log(store.currentList._id)
            if(response.data.success) {
                const newResponse = await api.deleteMapDataById(store.currentList._id)
                if(newResponse.data.success) {
                    store.loadIdNamePairs()
                }
                else {
                    console.log('delete mapdata failed')
                }
                
            }
        }
        deleteMap()
    }
//     store.likeList = function (email, idNamePair, user) {
//     async function asyncGetMap(id) {
//         let response = await api.getMapById(id)
//         if (response.data.success) {
//             let map = response.data.map;
//             if (idNamePair.likes.indexOf(user.email) > -1) {
//                 map.likes.splice(map.likes.indexOf(email), 1)
//             }
//             else if (idNamePair.dislikes.indexOf(user.email) > -1) {
//                 map.dislikes.splice(map.dislikes.indexOf(email), 1)
//                 map.likes.push(email);
//             }
//             else {
//                 map.likes.push(email);
//             }

//             async function updateMap(id, map) {
//                 response = await api.updateUserFeedback(id, map);
//                 if (response.data.success) {
//                     store.loadIdNamePairs()
//                     // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
//                     // else store.loadPublishedLists();
//                 }
//             }
//             updateMap(id, map)
//         }
//     }
//     asyncGetMap(idNamePair._id)
// }

// store.dislikeList = function (email, idNamePair, user) {
//     async function asyncGetMap(id) {
//         let response = await api.getMapById(id)
//         if (response.data.success) {
//             let map = response.data.map;
//             if (idNamePair.dislikes.indexOf(user.email) > -1) {
//                 map.dislikes.splice(map.likes.indexOf(email), 1)
//             }
//             else if (idNamePair.likes.indexOf(user.email) > -1) {
//                 map.likes.splice(map.dislikes.indexOf(email), 1)
//                 map.dislikes.push(email);
//             }
//             else {
//                 map.dislikes.push(email);
//             }
//             async function updateMap(id, map) {
//                 response = await api.updateUserFeedback(id, map);
//                 if (response.data.success) {
//                     store.loadIdNamePairs()
//                     // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
//                     // else store.loadPublishedLists();
//                 }
//             }
//             updateMap(id, map)
//         }
//     }
//     asyncGetMap(idNamePair._id)
// }

// store.likeComment = function (email, idNamePair, user, index) {
//     async function asyncGetMap(id) {
//         let response = await api.getMapById(id)
//         if (response.data.success) {
//             let map = response.data.map.comments[index];
//             if (idNamePair.comments[index].likes.indexOf(user.email) > -1) {
//                 map.likes.splice(map.likes.indexOf(email), 1)
//             }
//             else if (idNamePair.comments[index].dislikes.indexOf(user.email) > -1) {
//                 map.dislikes.splice(map.dislikes.indexOf(email), 1)
//                 map.likes.push(email);
//             }
//             else {
//                 map.likes.push(email);
//             }

//             async function updateMap(id, map) {
//                 response = await api.updateUserFeedback(id, map);
//                 if (response.data.success) {
//                     store.loadIdNamePairs(idNamePair._id)
//                     // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
//                     // else store.loadPublishedLists();
//                 }
//             }
//             updateMap(id, response.data.map)
//         }
//     }
//     asyncGetMap(idNamePair._id)
// }

// store.dislikeComment = function (email, idNamePair, user, index) {
//     async function asyncGetMap(id) {
//         let response = await api.getMapById(id)
//         if (response.data.success) {
//             let map = response.data.map.comments[index];
//             if (idNamePair.comments[index].dislikes.indexOf(user.email) > -1) {
//                 map.dislikes.splice(map.likes.indexOf(email), 1)
//             }
//             else if (idNamePair.comments[index].likes.indexOf(user.email) > -1) {
//                 map.likes.splice(map.dislikes.indexOf(email), 1)
//                 map.dislikes.push(email);
//             }
//             else {
//                 map.dislikes.push(email);
//             }
//             async function updateMap(id, map) {
//                 response = await api.updateUserFeedback(id, map);
//                 if (response.data.success) {
//                     store.loadIdNamePairs(idNamePair._id)
//                     // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
//                     // else store.loadPublishedLists();
//                 }
//             }
//             updateMap(id, response.data.map)
//         }
//     }
//     asyncGetMap(idNamePair._id)
// }

store.addComment = function (comment, user) {
    let newComment = { user: user.username, comment: comment, likes: [], dislikes: []}
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
        generateMap(mapbox)
        
    }
    asyncSetCurrentList(id);
}

function generateMap(mapbox) {
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