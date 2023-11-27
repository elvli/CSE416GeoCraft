import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api/index'

const AuthContext = createContext();

export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    errorMessage: null
  });
  const history = useNavigate();

  useEffect(() => {
    try{
      auth.getLoggedIn();
    }catch(error){
      
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
          user: null,
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

  auth.registerUser = async function (firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe) {
    try {
      const response = await api.registerUser(firstName, lastName, username, email, confirmEmail, password, confirmPassword, aboutMe);
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
          errorMessage: "REGISTER USER ERROR (BACK)"
        }
      })
    }
  }

  auth.loginUser = async function (email, password) {
    try {
      const response = await api.loginUser(email, password);
      console.log('LOGIN SUCCESS')
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
    console.log('LOG OUT STARTED');
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null
      })
      history("/login");
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

  auth.getAboutMe = function () {
    let aboutMe = "";
    if (auth.user) {
      aboutMe += auth.user.aboutMe;
    }
    console.log("aboutMe (auth front): " + aboutMe);
    console.log("auth.aboutMe: " + auth.user.aboutMe);
    return aboutMe;
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