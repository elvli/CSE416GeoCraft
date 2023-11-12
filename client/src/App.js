import './App.css';
import baseUrl from "./baseUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { React, useState, useEffect } from "react";
import { Route, Routes, Outlet, Navigate} from "react-router-dom";
import { AppBanner, LeftSideBar, RightSideBar, MapBackground, LoginScreen, SignUpScreen, HomeScreen, PasswordReset } from './components'

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/get-users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
        <Routes>
          <Route index element={<HomeScreen/>}/>
          <Route path="sign-up/" element={<SignUpScreen/>}/>
          <Route path="login/" element={<LoginScreen/>}/>
          <Route path="password-reset/" element ={<PasswordReset/>}/>
        </Routes> 
    </div>
  );
}

export default App;
