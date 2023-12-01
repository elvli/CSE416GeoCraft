import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: 'https://geocraftmapsbackend.onrender.com',
  // baseURL: 'http://localhost:3001'
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

export const updateUser = (id, user) => {
  return api.put(`/user/${id}`, {
    // SPECIFY THE PAYLOAD
    user: user
  })
}

export const getUserByUsername = (username) => api.get(`/user/${username}`);

const apis = {
  getLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  getUserByUsername
}

export default apis