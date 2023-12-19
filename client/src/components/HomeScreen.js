import React, { useState, useEffect, useContext, useRef } from "react"
import { EditRegionModal, MapBackground, PublishMapModal } from ".";
import { AppBanner, LeftSideBar, RightSideBar, MapCreateModal, DeleteMapModal, ForkMapModal, ExportMapModal } from '../components'
import { GlobalStoreContext } from '../store';
import '../App.css';

export default function HomeScreen() {
  const [newMapShow, setNewMapShow] = useState(false);
  const [deleteMapShow, setDeleteMapShow] = useState(false);
  const [editRegionShow, setEditRegionShow] = useState(false);
  const [forkMapShow, setForkMapShow] = useState(false);
  const [exportMapShow, setExportMapShow] = useState(false);
  const [publishMapShow, setPublishMapShow] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  const mapbox = useRef(null);


  async function handleClose() {
    setNewMapShow(false)
  }
  async function handlePublish() {
    setPublishMapShow(true)
  }
  async function handlePublishClose() {
    setPublishMapShow(false)
  }
  async function handleNewMap() {
    setNewMapShow(true)
  }
  async function handleDeleteMapClose() {
    setDeleteMapShow(false)
  }
  async function handleDeleteMap() {
    setDeleteMapShow(true);
  }
  async function handleEditRegionClose() {
    setEditRegionShow(false)
  }
  async function handleEditRegion() {
    setEditRegionShow(true);
  }
  async function handleForkClose() {
    setForkMapShow(false)
  }
  async function handleFork() {
    setForkMapShow(true);
  }
  async function handleExportClose() {
    setExportMapShow(false)
  }
  async function handleExport(event) {
    store.setCurrentList(store.currentList._id, null);
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
          <MapBackground map={mapbox} />
        </div>

        <div className="foreground">
          <LeftSideBar handleNewMap={handleNewMap} handleDeleteMap={handleDeleteMap} handleEditRegion={handleEditRegion} handleFork={handleFork} handleExport={handleExport} handlePublish={handlePublish} />
          {!store.currentList ? <></> : !store.currentList.published ? <></> : <RightSideBar />}
        </div>

      </div>
      <MapCreateModal show={newMapShow} handleClose={handleClose} />
      <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
      <EditRegionModal editRegionShow={editRegionShow} handleEditRegionClose={handleEditRegionClose} />
      <ForkMapModal forkMapShow={forkMapShow} handleForkMapClose={handleForkClose} />
      <ExportMapModal exportMapShow={exportMapShow} handleExportMapClose={handleExportClose} />
      <PublishMapModal publishMapShow={publishMapShow} handlePublishMapClose={handlePublishClose} />
    </div>
  )
}