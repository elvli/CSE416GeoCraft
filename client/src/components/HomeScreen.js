import React from "react"
import '../App.css';
import AppBanner from "./AppBanner/AppBanner";
import { EditRegionModal, MapBackground } from ".";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import RightSideBar from "./RightSideBar/RightSideBar";
import MapCreateModal from "./MapCreateModal/MapCreateModal";
import { useState } from "react";
import DeleteMapModal from "./DeleteMapModal/DeleteMapModal";
export default function HomeScreen () {
    const [show, setShow] = useState(false);
    const [deleteMapShow, setDeleteMapShow] = useState(false);
    const [editRegionShow, setEditRegionShow] = useState(false);
    async function handleClose(event) {
        setShow(false)
    }
    async function handleNewMap(event) {
        setShow(true)
    }
    async function handleDeleteMapClose(event) {
        setDeleteMapShow(false)
    }
    async function handleDeleteMap(event) {
        setDeleteMapShow(true);
    }
    async function handleEditRegionClose(event) {
        setEditRegionShow(false)
    }
    async function handleEditRegion(event) {
        setEditRegionShow(true);
    }
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
                <LeftSideBar handleNewMap={handleNewMap} handleDeleteMap={handleDeleteMap} handleEditRegion={handleEditRegion}/>
                <RightSideBar />
                </div>

            </div>
                <MapCreateModal show={show} handleClose={handleClose} />
                <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
                <EditRegionModal editRegionShow={editRegionShow} handleEditRegionClose={handleEditRegionClose} />
            {/* <button onClick={() => navigate("create")}>Create</button> */}
        </div>
    )
}