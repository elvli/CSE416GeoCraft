import { createContext, useContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    DISPLAY_MAP: "DISPLAY_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
}

const tps = new jsTPS();

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        idNamePairs: []
    });

    const storeReducer = (action) => {
        const { type, payload} = action
        switch(type){
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
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
            tps.clearAllTransactions();
            store.loadIdNamePairs()
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getMapPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray
                    }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.likeList = function (email, idNamePair, user) {
    async function asyncGetMap(id) {
        let response = await api.getMapById(id)
        if (response.data.success) {
            let map = response.data.map;
            if (idNamePair.likes.indexOf(user.email) > -1) {
                map.likes.splice(map.likes.indexOf(email), 1)
            }
            else if (idNamePair.dislikes.indexOf(user.email) > -1) {
                map.dislikes.splice(map.dislikes.indexOf(email), 1)
                map.likes.push(email);
            }
            else {
                map.likes.push(email);
            }

            async function updateMap(id, map) {
                response = await api.updateUserFeedback(id, map);
                if (response.data.success) {
                    if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    else store.loadPublishedLists();
                }
            }
            updateMap(id, map)
        }
    }
    asyncGetMap(idNamePair._id)
}

store.dislikeList = function (email, idNamePair, user) {
    async function asyncGetMap(id) {
        let response = await api.getMapById(id)
        if (response.data.success) {
            let map = response.data.map;
            if (idNamePair.dislikes.indexOf(user.email) > -1) {
                map.dislikes.splice(map.likes.indexOf(email), 1)
            }
            else if (idNamePair.likes.indexOf(user.email) > -1) {
                map.likes.splice(map.dislikes.indexOf(email), 1)
                map.dislikes.push(email);
            }
            else {
                map.dislikes.push(email);
            }
            async function updateMap(id, map) {
                response = await api.updateUserFeedback(id, map);
                if (response.data.success) {
                    if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    else store.loadPublishedLists();
                }
            }
            updateMap(id, map)
        }
    }
    asyncGetMap(idNamePair._id)
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