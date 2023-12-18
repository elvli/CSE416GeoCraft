import axios from 'axios'
import baseUrl from '../../baseUrl';
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: baseUrl,
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

export const registerUser = (firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe, profilePicture) => {
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
    profilePicture: profilePicture,
  })
}

export const updateUser = (id, user) => {
  return api.put(`/user/${id}`, {
    // SPECIFY THE PAYLOAD
    user: user
  })
}

export const getUserByUsername = (username) => api.get(`/user/${username}`);
export const createEmailLink = (emails) => api.post('/password-reset', {email: emails})
export const resetPassword = (password, id, token) => api.post(`/confirm/${id}/${token}`, {password: password, id: id, token: token})
export const verifyLink = (id, token) => api.post(`/confirm/${id}/${token}/verify-token/`)
const apis = {
  getLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  getUserByUsername,
  createEmailLink,
  resetPassword,
  verifyLink
}

export default apis