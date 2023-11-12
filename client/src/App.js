import './App.css';
import baseUrl from "./baseUrl";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginScreen, SignUpScreen, HomeScreen, PasswordReset } from './components'

function App() {
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
        <Route index element={<HomeScreen />} />
        <Route path="signup/" element={<SignUpScreen />} />
        <Route path="login/" element={<LoginScreen />} />
        <Route path="password-reset/" element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

export default App;
