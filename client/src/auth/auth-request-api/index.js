import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://geocraftmaps.azurewebsites.net',
    //https://geocraftserver.azurewebsites.net
    // http://localhost:3001
})

export const getLoggedIn = () => api.get(`/loggedIn/`);

export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email: email,
        password: password
    })
}

export const logoutUser = () => api.get(`/logout/`)

export const registerUser = (firstName, lastName, username, email, confirmEmail, password, confirmPassword) => {
    console.log("IN AUTH_REQUEST_API/INDEX.JS")
    return api.post(`/register/`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        confirmEmail: confirmEmail,
        password: password,
        confirmPassword: confirmPassword
    })
    // .catch(error => {
    //     console.error("Error in registerUser request (FRONT):", error);
    //     throw error; // Re-throw the error to propagate it to the calling function
    // });
}

const apis = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser
}

export default apis