import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const createTestString = (testString) => {
    return api.post(`/tests/`, {
        // SPECIFY THE PAYLOAD
        testString: testString,
    })
} 

export const getTests = () => api.get('/get-tests/')

const apis = {
    createTestString,
    getTests,
}

export default apis