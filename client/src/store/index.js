import { createContext, useContext, useState, useRef } from 'react'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  DISPLAY_MAP: "DISPLAY_MAP",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  UPDATE_MAP_DATA: "UPDATE_MAP_DATA",
  EMPTY_MAP_DATA: "EMPTY_MAP_DATA",
  SET_PRINT : 'SET_PRINT',
}

const tps = new jsTPS();

function GlobalStoreContextProvider(props) {
  const mapContainer = useRef(null);

  const { auth } = useContext(AuthContext);

  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    container: mapContainer,
    sort: [0],
    mapdata: null,
    print: 0,
  });

  const storeReducer = (action) => {
    const { type, payload } = action
    switch (type) {
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.currentList,
          container: store.container,
          sort: store.sort,
          mapdata: null,
          print: store.print,
        });
      }
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          container: store.container,
          sort: store.sort,
          mapdata: null,
          print: store.print,
        });
      }
      case GlobalStoreActionType.UPDATE_MAP_DATA: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          container: store.container,
          sort: store.sort,
          mapdata: payload,
          print: store.print,
        });
      }
      case GlobalStoreActionType.EMPTY_MAP_DATA: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          container: store.container,
          sort: store.sort,
          mapdata: null,
          print: store.print,
        });
      }
      case GlobalStoreActionType.SET_PRINT: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          container: store.container,
          sort: store.sort,
          mapdata: store.mapdata,
          print: payload,
        });
      }
      default:
        return store
    }
  }

  function sortArray(sortType, mapArr) {
    // A-Z
    if (sortType === 3) {
      mapArr = mapArr.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        // names must be equal
        return 0;
      });

    }
    // Z-A
    else if (sortType === 4) {
      mapArr = mapArr.sort((b, a) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        // names must be equal
        return 0;
      });
    }

    // NEW
    else if (sortType === 1) {
      mapArr = mapArr.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    }

    // OLD
    else if (sortType === 2) {
      mapArr = mapArr.sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
    }

    //POPULAR
    else if (sortType === 5) {
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
    const response = await api.createMap(newMapName, auth.user.username, auth.user.email, mapType);

    if (response.status === 201) {
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
  store.setSort = function (type) {
    store.sort[0] = type;
    store.loadIdNamePairs()
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
              let arr = [];
              for (let key in pairsArray) {
                arr.push(pairsArray[key]);

              }
              sortArray(store.sort[0], arr)
              storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {
                  idNamePairs: arr,
                  currentList: map
                }
              });
            }
            else {
              console.log("API FAILED TO GET THE LIST PAIRS");
            }
          }
          asyncLoadIdNamePairs();
        }
      }
      asyncGetMap(id);
    }
    else {
      async function asyncLoadIdNamePairs() {
        const response = await api.getMapPairs();
        if (response.data.success) {
          let pairsArray = response.data.idNamePairs;
          let arr = [];
          for (let key in pairsArray) {
            arr.push(pairsArray[key]);

          }
          sortArray(store.sort[0], arr)
          storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
              idNamePairs: arr,
            }
          });
        }
        else {
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
    console.log('apples')
    const response = await api.updateMapDataById(id, mapData);
    console.log('bananas')
    if (response.data.success) {
      console.log('Successfully updated mapdata')
    }
  }

  store.deleteMap = function () {
    async function deleteMap() {
      let response = await api.deleteMapById(store.currentList._id)
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
    }
    asyncSetCurrentList(id);
  }

  store.updateMapData = function (data) {
    async function asyncUpdateMapData(mapdata) {
      storeReducer({
        type: GlobalStoreActionType.UPDATE_MAP_DATA,
        payload: mapdata
      });

    }
    asyncUpdateMapData(data);
  }

  store.emptyMapData = function () {
    async function asyncEmptyMapData() {
      storeReducer({
        type: GlobalStoreActionType.EMPTY_MAP_DATA,
        payload: null
      });

    }
    asyncEmptyMapData();
  }

  store.getMapDataById = async function (id) {
    async function getMapDataById(id) {
      try {
        let response = await api.getMapDataById(id);
        if (response.data.success) {
          return response.data.mapData;
        }
        else {
          console.log('getMapDataById has thrown an error');
        }
      }
      catch (error) {
        console.error('Error fetching map data:', error);
      }
    }
    return getMapDataById(id);
  };

  store.setPrint = function (arg) {
    async function setPrint(arg) {
      storeReducer({
        type: GlobalStoreActionType.SET_PRINT,
        payload: arg
      });
    }
    setPrint(arg)
  }

  store.undo = function () {
    tps.undoTransaction();
  }
  store.redo = function () {
    tps.doTransaction();
  }

  function KeyPress(event) {
    if (!store.modalOpen && event.ctrlKey) {
      if (event.key === 'z') {
        if (tps.hasTransactionToUndo()) {
          console.log('undo attempted')
          store.undo();
        }
        else {
          console.log('no action to undo')
        }
      }
      if (event.key === 'y') {
        if (tps.hasTransactionToRedo()) {
          console.log('redo attempted')
          store.redo();
        }
        else {
          console.log('no action to redo')
        }
      }
    }
  }

  document.onkeydown = (event) => KeyPress(event);

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