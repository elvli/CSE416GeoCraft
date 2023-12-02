import { React, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../auth'
import GlobalStoreContext from "../../store";
import { AppBanner, MapCard, MapCreateModal, DeleteMapModal, ForkMapModal, ExportMapModal, EditProfileModal } from '../../components'
// import { Card } from 'react-bootstrap'
import "./ProfilePage.scss";

export default function ProfilePage() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('myMaps');
  const [newMapShow, setNewMapShow] = useState(false);
  const [deleteMapShow, setDeleteMapShow] = useState(false);
  const [forkMapShow, setForkMapShow] = useState(false);
  const [exportMapShow, setExportMapShow] = useState(false);
  const [editProfileShow, setEditProfileShow] = useState(false);
  // const username = auth.getUsername();
  const { username } = useParams();
  const email = auth.getEmail();
  const aboutMeText = auth.getAboutMe();


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
  async function handleEditProfileClose(event) {
    setEditProfileShow(false)
  }
  async function handleEditProfile(event) {
    setEditProfileShow(true)
  }

  var functions = {
    handleDeleteMap: handleDeleteMap,
    handleFork: handleFork,
    handleExport: handleExport
  }
  useEffect(() => {
    store.loadIdNamePairs();
  }, [store]);

  function createRows(mapCards) {
    const rows = [];
    const cardsPerRow = 4;

    for (let i = 0; i < mapCards.length; i += cardsPerRow) {
      const row = mapCards.slice(i, i + cardsPerRow).map((map, index) => (
        <div className="col-md-3 mb-2" key={index}>
          <MapCard map={map} functions={functions} />
        </div>
      ));

      rows.push(
        <div className="row g-2" key={i / cardsPerRow}>
          {row}
        </div>
      );
    }

    return <div>{rows}</div>;
  }

  return (
    <div className="profile-container">
      <AppBanner />
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col">

          <div className="text-white d-flex flex-row profile-banner">
            <div className="ms-4 mt-5 d-flex flex-column">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt1ceyneFkZchgkrwN7dZxWNl_C5Dctvc5BzNh_rEzPQ&s"
                alt="Default Profile Pic"
                className="img-fluid img-thumbnail mt-4 mb-2 profile-pic"
              />

              {username === auth.getUsername() && (
                <button type="button" className="btn btn-outline-dark edit-profile-btn" data-mdb-ripple-color="dark" onClick={handleEditProfile}>
                  Edit profile
                </button>
              )}
            </div>

            <div className="ms-3 username-text">
              <h2>{username}</h2>
            </div>
          </div>

          <div className="p-4 bg-light">
            <div className="d-flex justify-content-end text-center py-1">
              <div>
                <p className="mb-1 h5">{(store.idNamePairs.filter(pair => pair.ownerName === username)).length}</p>
                <p className="small text-muted mb-0">Maps</p>
              </div>

              <div className="px-3">
                <p className="mb-1 h5">{(store.idNamePairs.filter(pair => pair.likes.includes(username))).length}</p>
                <p className="small text-muted mb-0">Likes</p>
              </div>
            </div>
          </div>

          <div className="card-body p-4 text-black">
            <div className="mb-5">
              <p className="lead fw-normal mb-1">About Me</p>
              <div className="p-4 about-me-container" >
                {/* <p className="font-italic mb-1">Web Developer</p>
                <p className="font-italic mb-1">Lives in New York</p>
                <p className="font-italic mb-0">Photographer</p> */}
                <p className="font-italic mb-1">{aboutMeText}</p>

              </div>
            </div>
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${activeTab === 'myMaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('myMaps')}
                  data-bs-toggle="tab"
                >
                  {auth.getUsername() !== username ? `${username}'s Maps` : 'My Maps'}
                </button>
                <button
                  className={`nav-link ${activeTab === 'likedMaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('likedMaps')}
                  data-bs-toggle="tab"
                >
                  {auth.getUsername() !== username ? `${username}'s Liked Maps` : 'My Liked Maps'}
                </button>
              </div>
            </nav>
            <div className="tab-content" >
              {/* {activeTab === 'myMaps' && createRows(unpubArray, functions, true)}
              {activeTab === 'likedMaps' && createRows(publishedArray, functions, false)} */}
              {activeTab === 'myMaps' && createRows(store.idNamePairs.filter(pair => pair.ownerName === username))}
              {activeTab === 'likedMaps' && createRows(store.idNamePairs.filter(pair => pair.likes.includes(auth.user._id)))}
            </div>
          </div>
        </div>
      </div >
      <MapCreateModal show={newMapShow} handleClose={handleClose} />
      <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
      <ForkMapModal forkMapShow={forkMapShow} handleForkMapClose={handleForkClose} />
      <ExportMapModal exportMapShow={exportMapShow} handleExportMapClose={handleExportClose} />
      <EditProfileModal editProfileShow={editProfileShow} handleEditProfileClose={handleEditProfileClose} />
    </div >
  );
}