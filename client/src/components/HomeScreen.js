import React from "react"
import '../App.css';
import { EditRegionModal, MapBackground, PublishMapModal } from ".";
import { useState, useEffect, useContext, useRef } from "react";
import { AppBanner, LeftSideBar, RightSideBar, MapCreateModal, DeleteMapModal, ForkMapModal, ExportMapModal } from '../components'
import { GlobalStoreContext } from '../store' 

export default function HomeScreen() {
  const [newMapShow, setNewMapShow] = useState(false);
  const [deleteMapShow, setDeleteMapShow] = useState(false);
  const [editRegionShow, setEditRegionShow] = useState(false);
  const [forkMapShow, setForkMapShow] = useState(false);
  const [exportMapShow, setExportMapShow] = useState(false);
  const [publishMapShow, setPublishMapShow] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  

  async function handleClose(event) {
    setNewMapShow(false)
  }
  async function handlePublish(event) {
    setPublishMapShow(true)
  }
  async function handlePublishClose(event) {
    setPublishMapShow(false)
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
  }, []);

  return (
    <div>
      <div style={{ height: '5vh' }} />
      <AppBanner />
      <div className="row1">

        <div className="background">
          <MapBackground/>
          
        </div>

        <div className="foreground">
          <LeftSideBar handleNewMap={handleNewMap} handleDeleteMap={handleDeleteMap} handleEditRegion={handleEditRegion} handleFork={handleFork} handleExport={handleExport} handlePublish={handlePublish}/>
          {!store.currentList? <></> : !store.currentList.published?<></>:<RightSideBar />}
        </div>

      </div>
      <MapCreateModal show={newMapShow} handleClose={handleClose} />
      <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
      <EditRegionModal editRegionShow={editRegionShow} handleEditRegionClose={handleEditRegionClose} />
      <ForkMapModal forkMapShow={forkMapShow} handleForkMapClose={handleForkClose} />
      <ExportMapModal exportMapShow={exportMapShow} handleExportMapClose={handleExportClose} />
      <PublishMapModal publishMapShow={publishMapShow} handlePublishMapClose={handlePublishClose}/>
      {/* <button onClick={() => navigate("create")}>Create</button> */}
    </div>
  )
}