import { createContext, useContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    DISPLAY_MAP: "DISPLAY_MAP",
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
                    idNamePairs: payload,
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
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS, 
                payload: store.loadIdNamePairs
            })
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
                // storeReducer({
                //     type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                //     payload: {
                //         pairsArray: pairsArray,
                //         sortedBy: 0
                //     }
                // });
                // storeReducer({
                //     type: GlobalStoreActionType.DISPLAY_PLAYLIST,
                //     payload: {
                //         idNamePairs: pairsArray
                //     }
                // });
                // else{
                //     // store.sortIdNamePairs(store.sortedBy, pairsArray)
                // }
                return pairsArray
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
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