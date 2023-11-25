import { createContext, useContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    DISPLAY_MAP: "DISPLAY_MAP",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
}

const tps = new jsTPS();

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
    });

    const storeReducer = (action) => {
        const { type, payload} = action
        switch(type){
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
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

    store.loadIdNamePairs = function (id = null) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getMapPairs();
            let mapID = await api.getMapById(id);
            let map = mapID.data.map;
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
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
                    store.loadIdNamePairs()
                    // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    // else store.loadPublishedLists();
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
                    store.loadIdNamePairs()
                    // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    // else store.loadPublishedLists();
                }
            }
            updateMap(id, map)
        }
    }
    asyncGetMap(idNamePair._id)
}

store.likeComment = function (email, idNamePair, user, index) {
    async function asyncGetMap(id) {
        let response = await api.getMapById(id)
        if (response.data.success) {
            let map = response.data.map.comments[index];
            if (idNamePair.comments[index].likes.indexOf(user.email) > -1) {
                map.likes.splice(map.likes.indexOf(email), 1)
            }
            else if (idNamePair.comments[index].dislikes.indexOf(user.email) > -1) {
                map.dislikes.splice(map.dislikes.indexOf(email), 1)
                map.likes.push(email);
            }
            else {
                map.likes.push(email);
            }

            async function updateMap(id, map) {
                response = await api.updateUserFeedback(id, map);
                if (response.data.success) {
                    store.loadIdNamePairs(idNamePair._id)
                    // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    // else store.loadPublishedLists();
                }
            }
            updateMap(id, response.data.map)
        }
    }
    asyncGetMap(idNamePair._id)
}

store.dislikeComment = function (email, idNamePair, user, index) {
    async function asyncGetMap(id) {
        let response = await api.getMapById(id)
        if (response.data.success) {
            let map = response.data.map.comments[index];
            if (idNamePair.comments[index].dislikes.indexOf(user.email) > -1) {
                map.dislikes.splice(map.likes.indexOf(email), 1)
            }
            else if (idNamePair.comments[index].likes.indexOf(user.email) > -1) {
                map.likes.splice(map.dislikes.indexOf(email), 1)
                map.dislikes.push(email);
            }
            else {
                map.dislikes.push(email);
            }
            async function updateMap(id, map) {
                response = await api.updateUserFeedback(id, map);
                if (response.data.success) {
                    store.loadIdNamePairs(idNamePair._id)
                    // if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                    // else store.loadPublishedLists();
                }
            }
            updateMap(id, response.data.map)
        }
    }
    asyncGetMap(idNamePair._id)
}

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

store.setCurrentList = function (id) {
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