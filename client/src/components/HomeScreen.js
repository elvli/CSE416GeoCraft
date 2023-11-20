import React from "react"
import '../App.css';
import { EditRegionModal, MapBackground } from ".";
import { useState, useEffect, useContext } from "react";
import { AppBanner, LeftSideBar, RightSideBar, MapCreateModal, DeleteMapModal, ForkMapModal, ExportMapModal } from '../components'
import { GlobalStoreContext } from '../store' 

export default function HomeScreen() {
  const [newMapShow, setNewMapShow] = useState(false);
  const [deleteMapShow, setDeleteMapShow] = useState(false);
  const [editRegionShow, setEditRegionShow] = useState(false);
  const [forkMapShow, setForkMapShow] = useState(false);
  const [exportMapShow, setExportMapShow] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  
  
  async function handleClose(event) {
    setNewMapShow(false)
  }
  async function handleNewMap(event) {
    setNewMapShow(true)
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
  async function handleForkClose(event) {
    setForkMapShow(false)
  }
  async function handleFork(event) {
    setForkMapShow(true);
  }
  async function handleExportClose(event) {
    setExportMapShow(false)
  }
  async function handleExport(event) {
    setExportMapShow(true);
  }

  useEffect(() => {
    store.loadIdNamePairs();
});

  return (
    <div>
      <div style={{ height: '5vh' }} />
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
          <LeftSideBar handleNewMap={handleNewMap} handleDeleteMap={handleDeleteMap} handleEditRegion={handleEditRegion} handleFork={handleFork} handleExport={handleExport} />
          <RightSideBar />
        </div>

      </div>
      <MapCreateModal show={newMapShow} handleClose={handleClose} />
      <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
      <EditRegionModal editRegionShow={editRegionShow} handleEditRegionClose={handleEditRegionClose} />
      <ForkMapModal forkMapShow={forkMapShow} handleForkMapClose={handleForkClose} />
      <ExportMapModal exportMapShow={exportMapShow} handleExportMapClose={handleExportClose} />
      {/* <button onClick={() => navigate("create")}>Create</button> */}
    </div>
  )
}