import './App.css';
import baseUrl from "./baseUrl";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginScreen, SignUpScreen, HomeScreen, PasswordReset, VerifyScreen, ConfirmScreen } from './components'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/get-users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeScreen/>,
    },
    {
      path: "/sign-up",
      element: <SignUpScreen />,
    },
    {
      path: "/login",
      element: <LoginScreen />,
    },
    {
      path: "/password-reset",
      element: <PasswordReset />,
    },
  ]);
  return (
    <div className="App">
        <Routes>
          <Route index element={<HomeScreen/>}/>
          <Route path="sign-up/" element={<SignUpScreen />}/>
          <Route path="login/" element={<LoginScreen />}/>
          <Route path="password-reset/" element={<PasswordReset />}/>
          <Route path="verify/" element={<VerifyScreen />}/>
          <Route path="confirm/" element={<ConfirmScreen />}/>
        </Routes> 
    </div>
  );
}
/*<Routes>
        <Route index element={<HomeScreen />} />
        <Route path="signup/" element={<SignUpScreen />} />
        <Route path="login/" element={<LoginScreen />} />
        <Route path="password-reset/" element={<PasswordReset />} />
      </Routes>*/
export default App;
