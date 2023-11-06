import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://mongodb://geocraftmapsdb:FvG00KuXU8a0CrPI4wNX4bpO9ABF3wT76LCcpgpRwZXORQ4I7Zh7jzE6AVctvO5pV6o1y8q8GPFJACDbxBc4OQ==@geocraftmapsdb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@geocraftmapsdb@',
})

export const createTestString = (testString) => {
    return api.post(`/tests/`, {
        // SPECIFY THE PAYLOAD
        testString: testString,
    })
} 

export const getTests = () => api.get(`/tests/`)

const apis = {
    createTestString,
    getTests,
}

export default apis