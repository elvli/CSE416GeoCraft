import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: 'https://geocraftmapsbackend.onrender.com',
  //https://geocraftserver.azurewebsites.net
  //https://geocraftmaps.azurewebsites.net
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

export const registerUser = (firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe) => {
  console.log("Registering User (Front)");
  return api.post(`/register/`, {
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    confirmEmail: confirmEmail,
    password: password,
    confirmPassword: confirmPassword,
    aboutMe: aboutMe,
  })
}

const apis = {
  getLoggedIn,
  loginUser,
  logoutUser,
  registerUser
}

export default apis