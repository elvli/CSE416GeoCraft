import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://geocraftmaps.azurewebsites.net/',
})

export const createTestString = (testString) => {
    return api.post(`/tests/`, {
        // SPECIFY THE PAYLOAD
        testString: testString,
    })
} 

export const getTests = () => api.get(`/tests`)

const apis = {
    createTestString,
    getTests,
}

export default apis