import React from "react"
import '../App.css';
import AppBanner from "./AppBanner";
import { MapBackground } from ".";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar/RightSideBar";
export default function HomeScreen () {
    return(
        <div>
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
    )
}