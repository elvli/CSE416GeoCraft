import axios from 'axios'
import baseUrl from '../../baseUrl';
axios.defaults.withCredentials = true;
const api = axios.create({
   baseURL: baseUrl,
  //  baseURL: 'http://localhost:3001',
})

export const createMap = (newMapName, ownerUsername, userEmail, mapType) => {
  return api.post(`/map/`, {
    // SPECIFY THE PAYLOAD
    name: newMapName,
    ownerName: ownerUsername,
    ownerEmail: userEmail,
    mapType: mapType,
    comments: [],
    published: false,
    publishedDate: null,
    likes: [],
    dislikes: [],
    views: 0,
  })
}
export const deleteMapById = (id) => api.delete(`/map/${id}`)
export const getMapById = (id) => api.get(`/map/${id}`)
export const getMapPairs = () => api.get(`/mapPairs/`)
export const updateMapById = (id, map) => {
  return api.put(`/map/${id}`, {
    // SPECIFY THE PAYLOAD
    map: map
  })
}
export const updateUserFeedback = (id, map) => {
  return api.put(`/maps/${id}`, {
    // SPECIFY THE PAYLOAD
    map: map
  })
}
export const getPublishedMaps = () => api.get('/maps/')
export const updateMultipleMaps = (data) => {
  return api.put(`/maps/`, {
    // SPECIFY THE PAYLOAD
    data: data
  })
}

export const createMapData = (id) => {
    return api.post(`/mapData/`, {
      // SPECIFY THE PAYLOAD
      points: [{id: 1,longitude: '0', latitude: '0'}],
      mapID: id,
      settings: {
        latitude: 40.9083,
        longitude: -73.1217,
        zoom: 13.91
      }
    })
  }
export const deleteMapDataById = (id) => api.delete(`/mapData/${id}`)
export const updateMapDataById = (id, mapData) => {
  return api.put(`/mapData/${id}`, {
    // SPECIFY THE PAYLOAD
    mapData: mapData
  })
}
export const getMapDataById = (id) => api.get(`/mapData/${id}`)

const apis = {
  createMap,
  deleteMapById,
  getMapById,
  getMapPairs,
  updateMapById,
  updateUserFeedback,
  getPublishedMaps,
  createMapData,
  deleteMapDataById,
  updateMultipleMaps,
  updateMapDataById,
  getMapDataById,
}

export default apis