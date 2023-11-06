import axios, { Axios } from 'axios'
axios.defaults.withCredentials = true;
const baseURL = 'https://geocraftmaps.azurewebsites.net';

const api = axios.create({
    baseURL: 'https://geocraftmaps.azurewebsites.net:4000/api',
})

export const createTestString = (str) => {
    return api.post(`/tests/`, {
        // SPECIFY THE PAYLOAD
        testString: str,
    })
} 

export const getTests = () => axios.get(`/tests`)

const apis = {
    createTestString,
    getTests,
}

export default apis