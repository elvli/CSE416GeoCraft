import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api/index'

const AuthContext = createContext();

export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
  UPDATE_USER: "UPDATE_USER",
}

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: 'Guest',
    loggedIn: false,
    errorMessage: null,
    firstName: null,
    LasttName: null,
    username: null,
    email: null,
    aboutMe: "Click edit profile to add an about me.",
    profilePicture: "yx196dx8ua5em7hfgc1a",
    color: "Black"
  });
  const history = useNavigate();

  useEffect(() => {
    try {
      auth.getLoggedIn();
    } catch (error) {

    }
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: null
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: payload.errorMessage
        })
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: 'Guest',
          loggedIn: false,
          errorMessage: null
        })
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: payload.errorMessage
        })
      }
      case AuthActionType.UPDATE_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: payload.errorMessage,
          firstName: payload.firstName,
          LasttName: payload.LastName,
          username: payload.username,
          email: payload.email,
          aboutMe: payload.aboutMe,
          profilePicture: payload.profilePicture,
          color: payload.color,
        })
      }
      default:
        return auth;
    }
  }

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user
        }
      });
    }
  }

  auth.registerUser = async function (firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe, profilePicture, color) {
    try {
      const response = await api.registerUser(firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe, profilePicture, color);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: response.data.user,
            loggedIn: false,
            errorMessage: null
          }
        })
        auth.loginUser(email, password);
        // history("/login");
      }
    } catch (error) {
      authReducer({
        type: AuthActionType.REGISTER_USER,
        payload: {
          user: auth.user,
          loggedIn: false,
          errorMessage: error.response.data.errorMessage
        }
      })
    }
  }

  auth.loginUser = async function (email, password) {
    try {
      const response = await api.loginUser(email, password);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
            loggedIn: true,
            errorMessage: null
          }
        })
        history("/");
      }
    } catch (error) {
      authReducer({
        type: AuthActionType.LOGIN_USER,
        payload: {
          user: auth.user,
          loggedIn: false,
          errorMessage: "LOGIN USER ERROR (BACK)"
          // errorMessage: error.response.data.errorMessage
        }
      })
    }
  }

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null
      })
      history("/login");
    }
  }

  auth.updateUser = async function (user) {
    const response = await api.updateUser(auth.user._id, user);
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.UPDATE_USER,
        payload: {
          user: auth.user,
          loggedIn: false,
          firstName: response.data.user.firstName,
          LasttName: response.data.user.LastName,
          // username: response.data.user.username,
          // email: response.data.user.email,
          aboutMe: response.data.user.aboutMe,
          profilePicture: response.data.user.profilePicture,
          color: response.data.user.color
        }
      })
      auth.getLoggedIn();
    }
  }

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    return initials;
  }

  auth.getFirstName = function () {
    let firstName = "";
    if (auth.user) {
      firstName += auth.user.firstName;
    }
    return firstName;
  }

  auth.getLastName = function () {
    let lastName = "";
    if (auth.user) {
      lastName += auth.user.lastName;
    }
    return lastName;
  }

  auth.getUsername = function () {
    let username = "";
    if (auth.user) {
      username += auth.user.username;
    }
    return username;
  }

  auth.getEmail = function () {
    let email = "";
    if (auth.user) {
      email += auth.user.email;
    }
    return email;
  }

  auth.getAboutMe = function (username) {
    async function asyncgetUserByUsername() {
      try {
        const response = await api.getUserByUsername(username);
        if(response.data.user && response.data.user.aboutMe){
          return response.data.user.aboutMe
        }
      } catch (error) {
        console.error(error)
      }
    }    
    return asyncgetUserByUsername()
  }

  auth.getProfilePicture = function (username) {
    async function asyncgetUserByUsername() {
      try {
        const response = await api.getUserByUsername(username);
        if(response.data.user && response.data.user.profilePicture){
          return response.data.user.profilePicture
        }
      } catch (error) {
        console.error(error)
      }
    }    
    return asyncgetUserByUsername()
  }

  auth.getColor = function (username) {
    async function asyncgetUserByUsername() {
      try {
        const response = await api.getUserByUsername(username);
        if(response.data.user && response.data.user.color){
          return response.data.user.color
        }
      } catch (error) {
        console.error(error)
      }
    }    
    return asyncgetUserByUsername()
  }


  auth.createEmailLink = function (email) {
    async function asyncCreateEmailLink() {
      try {
        const response = await api.createEmailLink(email);
       
        return true;
      }
      catch (error){
        
        return false
      }
    }
    return asyncCreateEmailLink()
  }

  auth.resetPassword = function (password, id, token) {
    async function asyncResetPassword() {
      try{
        const response = await api.resetPassword (password, id, token)
        return response;
      } catch(error) {
        console.error(error)
      }
    }
    return asyncResetPassword()
    
  }
  auth.verifyLink = function (id, token) {
    async function asyncVerify() {
      const response = await api.verifyLink(id, token)
      if(response.data.success) return true
      else return false
    }
    let result = asyncVerify()
    return result
    
  }

  auth.guestLogin = async function () {
    try {
      const response = await api.loginUser("guest@gmail.com", "GuestPassword");
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
            loggedIn: true,
            errorMessage: null
          }
        })
        history("/");
      }
    } catch (error) {
      try {
        const response = await api.registerUser("Guest", "User", "Guest", "guest@gmail.com", "guest@gmail.com", "GuestPassword", "GuestPassword");
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.REGISTER_USER,
            payload: {
              user: response.data.user,
              loggedIn: true,
              errorMessage: null
            }
          })
          auth.loginUser("guest@gmail.com", "GuestPassword");
        }
      } catch (error) {
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: auth.user,
            loggedIn: false,
            errorMessage: error.response.data.errorMessage
          }
        })
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      auth
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };