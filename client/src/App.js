import './App.css';
import baseUrl from "./baseUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { React, useState, useEffect } from "react";

import { AppBanner, LeftSideBar, RightSideBar, MapBackground, LoginScreen, SignUpScreen } from './components'

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
      <AppBanner />
      <div className="row1">
        {/* <div className="background">
          <div className="testRead">
            <h1>READ THIS</h1>
            {users &&
              users.length > 0 &&
              users.map((user) => {
                return (
                  <div>
                    <h3>
                      {user.name} {user.lastName}
                    </h3>
                  </div>
                );
              })}
          </div>
        </div> */}

        <div className="background">
          <MapBackground />
        </div>

        <div className="foreground">
          <LeftSideBar />
          <RightSideBar />
        </div>

      </div>

      {/* <button onClick={() => navigate("create")}>Create</button> */}
    </div>
  );
}

export default App;
