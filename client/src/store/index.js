import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import ListCard from '../components/ListCard'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
    @author Elven Li
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SAME_NAME: "SAME_NAME",
    SET_CURRENT_SONG: "SET_CURRENT_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    ERROR: "ERROR",
    SAME_NAME: "SAME_NAME",
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex: 0,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentPageSort: [0, -1],
    });

    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentPageSort: store.currentPageSort,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: 0,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            case GlobalStoreActionType.SAME_NAME: {
                return setStore({
                    currentModal: CurrentModal.SAME_NAME,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SONG: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: store.currentPageSort,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_PAGE_SORT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: null,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentPageSort: payload.pageSort,
                });
            }
            default:
                return store;
        }
    }

    store.tryAcessingOtherAccountPlaylist = function () {
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();

        if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
        else store.loadPublishedLists();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter++;

        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (newListName === ("Untitled" + i)) {
                newListName = "Untitled" + store.newListCounter++;
            }
        }

        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: null
            });

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
            store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION DUPLICATES THE CURRENT LIST
    store.duplicateList = async function () {
        let newListName = "" + store.currentList.name + "Copy" + store.newListCounter
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, auth.user.username);
        console.log("duplicateList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: null
            });

            store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A DUPLICATE LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;

                if (store.currentPageSort[0] !== 0) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                        payload: {
                            pairsArray: pairsArray,
                            pageSort: [0, -1]
                        }
                    });
                }
                else {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                        payload: {
                            pairsArray: pairsArray,
                            pageSort: [0, store.currentPageSort[1]]
                        }
                    });
                    store.sortList(store.currentPageSort[1], pairsArray)
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THIS FUNCTION SORTS THE PLAYLISTS
    store.sortList = async function (sortBy, playlist) {
        let sortedList = playlist

        switch (sortBy) {
            // SORT BY CREATION OLD - NEW FOR HOME PAGE
            case 0:
                sortedList = sortedList.sort((a, b) =>
                    a.createdAt.toUpperCase() > b.createdAt.toUpperCase() ? 1 : -1
                )

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 6]
                    }
                });

                break;

            // SORT BY THE LAST EDIT DATE NEW - OLD FOR HOME PAGE
            case 1:
                sortedList = sortedList.sort((a, b) =>
                    a.updatedAt.toUpperCase() > b.updatedAt.toUpperCase() ? -1 : 1
                )

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 7]
                    }
                });

            // SORT BY NAME A - Z FOR HOME PAGE
            case 2:
                sortedList = sortedList.sort((a, b) =>
                    a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                )

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 0]
                    }
                });
                break;

            // SORT BY NAME A - Z FOR ALL LISTS AND USER PAGES
            case 3:
                sortedList = sortedList.sort((a, b) =>
                        a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                    )

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 3]
                    }
                });
                break;

            // SORT BY PUBLISH DATE NEW - OLD FOR ALL LISTS AND USER PAGES
            case 4:
                let published = []
                let notPublished = []
                for (let i = 0; i < sortedList.length; i++) {
                    if (sortedList[i].published) {
                        published.push(sortedList[i])
                    }
                    else {
                        notPublished.push(sortedList[i])
                    }
                }

                published = published.sort((a, b) =>
                    a.publishedDate.toUpperCase() > b.publishedDate.toUpperCase() ? -1 : 1
                )

                sortedList = published.concat(notPublished)

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 1]
                    }
                });
                break;

            // SORT BY LISTENS HI - LO FOR ALL LISTS AND USER PAGES
            case 5:
                sortedList = sortedList.sort(function (a, b) {
                    return b.listens - a.listens;
                })

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 2]
                    }
                });
                break;

            // SORT LIKES HI - LO FOR ALL LISTS AND USER PAGES
            case 6:
                sortedList = sortedList.sort(function (a, b) {
                    return b.likes.length - a.likes.length;
                })

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 4]
                    }
                });
                break;

            // SORT DISLIKES HI - LO FOR ALL LISTS AND USER PAGES
            case 7:
                sortedList = sortedList.sort(function (a, b) {
                    return b.dislikes.length - a.dislikes.length;
                })

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                    payload: {
                        pairsArray: sortedList,
                        pageSort: [store.currentPageSort[0], 4]
                    }
                });
                break;

            default:
                break;
        }

        return sortedList;
    }

    store.setCurrentSong = function (index, currentSong) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_SONG,
            payload: { currentSongIndex: index, currentSong: currentSong }
        });
    }

    store.publishList = function () {
        store.currentList.published = true;
        store.currentList.publishedDate = new Date();
    }

    store.canPublishList = function () {
        return ((store.currentList !== null && store.currentList.published === false));
    }

    store.addComment = function (comment, user) {
        let newComment = { user: user.username, comment: comment }
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

    store.likeList = function (email, idNamePair, user) {
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id)
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (idNamePair.likes.indexOf(user.email) > -1) {
                    playlist.likes.splice(playlist.likes.indexOf(email), 1)
                }
                else if (idNamePair.dislikes.indexOf(user.email) > -1) {
                    playlist.dislikes.splice(playlist.dislikes.indexOf(email), 1)
                    playlist.likes.push(email);
                }
                else {
                    playlist.likes.push(email);
                }

                async function updatePlaylist(id, playlist) {
                    response = await api.updateUserFeedback(id, playlist);
                    if (response.data.success) {
                        if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                        else store.loadPublishedLists();
                    }
                }
                updatePlaylist(id, playlist)
            }
        }
        asyncGetPlaylist(idNamePair._id)
    }

    store.dislikeList = function (email, idNamePair, user) {
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id)
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (idNamePair.dislikes.indexOf(user.email) > -1) {
                    playlist.dislikes.splice(playlist.likes.indexOf(email), 1)
                }
                else if (idNamePair.likes.indexOf(user.email) > -1) {
                    playlist.likes.splice(playlist.dislikes.indexOf(email), 1)
                    playlist.dislikes.push(email);
                }
                else {
                    playlist.dislikes.push(email);
                }
                async function updatePlaylist(id, playlist) {
                    response = await api.updateUserFeedback(id, playlist);
                    if (response.data.success) {
                        if (store.currentPageSort[0] === 0) store.loadIdNamePairs();
                        else store.loadPublishedLists();
                    }
                }
                updatePlaylist(id, playlist)
            }
        }
        asyncGetPlaylist(idNamePair._id)
    }

    store.loadPublishedLists = function (display) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPublishedLists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;

                if (store.currentPageSort[0] === 0) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                        payload: {
                            pairsArray: pairsArray,
                            pageSort: [display, -1]
                        }
                    });
                }
                else {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_PAGE_SORT,
                        payload: {
                            pairsArray: pairsArray,
                            pageSort: [display, store.currentPageSort[1]]
                        }
                    });
                    store.sortList(store.currentPageSort[1], pairsArray)
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.incListens = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.published) {
                    playlist.listens++;
                    console.log("inc: " + playlist.listens);
                }
                response = await api.updateUserFeedback(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.loadIdNamePairs();
            if (response.data.success) {
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.showSameNameModal = () => {
        storeReducer({
            type: GlobalStoreActionType.SAME_NAME,
            payload: null
        });
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }
    store.isSameNameModalOpen = () => {
        return store.currentModal === CurrentModal.SAME_NAME;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getAllPlaylists = function () {
        let playlists = [];

        // for (let i = 0; i < this.idNamePairs.length; i++) {
        store.idNamePairs.forEach((pair) => {
            let id = pair._id;
            async function asyncSetCurrentList(id) {
                let response = await api.getPlaylistById(id);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    playlists.push(playlist);
                    // response = await api.updatePlaylistById(playlist._id, playlist);
                    // if (response.data.success) {
                    //     playlists.push(playlist);

                    // }
                }
            }
            asyncSetCurrentList(id);
        })

        return playlists;
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    store.addNewSong = function () {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.refreshLists = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
            store.loadIdNamePairs();
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function () {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey) {
            if (event.key === 'z') {
                store.undo();
            }
            if (event.key === 'y') {
                store.redo();
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