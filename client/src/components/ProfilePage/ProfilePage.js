import { React, useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'; // Import Axios
import AuthContext from '../../auth'
import GlobalStoreContext from "../../store";
import { AppBanner, MapCard, MapCreateModal, DeleteMapModal, ForkMapModal, ExportMapModal, EditProfileModal, PublishMapModal } from '../../components'
// import { Card } from 'react-bootstrap'
import { Image } from 'cloudinary-react';
import cameraLogo from '.././Images/cameraicon.png';
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
  const [publishMapShow, setPublishMapShow] = useState(false);
  const [aboutMeText, setAboutMeText] = useState('');
  const [imageName, setImageName] = useState('');
  const [color, setColor] = useState('');
  const fileInputRef = useRef(null);

  const { username } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await auth.getAboutMe(username);
        setAboutMeText(result); // If result is falsy, set an empty string
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchImageName = async () => {
      try {
        const result = await auth.getProfilePicture(username);
        setImageName(result || ''); // If result is falsy, set an empty string
      } catch (error) {
        console.error(error);
      }
    };

    fetchImageName();
  }, []);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const result = await auth.getColor(username);
        setColor(result || ''); // If result is falsy, set an empty string
      } catch (error) {
        console.error(error);
      }
    };

    fetchColor();
  }, []);

  const cloudinaryBaseUrl = "https://res.cloudinary.com/djmyzbhnk/image/upload/";
  const version = "v1702872120/";
  const totalLikes = store.idNamePairs.reduce((sum, pair) => {
    if (pair.ownerName === username) {
      return sum + pair.likes.length;
    }
    return sum;
  }, 0);


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
  async function handlePublish(event) {
    setPublishMapShow(true)
  }
  async function handlePublishClose(event) {
    setPublishMapShow(false)
  }
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append("upload_preset", "jkiouekk")

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/djmyzbhnk/image/upload', formData, {
          withCredentials: false,
        });
        const user = {
          profilePicture: response.data.public_id
        }
        auth.updateUser(user);
        for (let i in store.idNamePairs) {
          if (store.idNamePairs[i].published && store.idNamePairs[i].comments) {
            var map = false
            for (let j in store.idNamePairs[i].comments) {
              if (store.idNamePairs[i].comments[j].user === auth.user.username) {
                map = store.idNamePairs[i]
                map.comments[j].profilePicture = response.data.public_id
              }
            }
            if (map) {
              store.updateLikeDislike(map._id, map)
            }
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  var functions = {
    handleDeleteMap: handleDeleteMap,
    handleFork: handleFork,
    handleExport: handleExport,
    handlePublish: handlePublish,
  }

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

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

          <div className="text-white d-flex flex-row profile-banner" style = {{backgroundColor: ((username === auth.getUsername()) ? auth.user.color : color)}}>
            <div className="ms-4 mt-5 d-flex flex-column position-relative">
              <div className="img-container">
                <Image
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="img-fluid img-thumbnail mt-2 mb-2 profile-pic"
                  cloudName="djmyzbhnk"
                  publicId={`${cloudinaryBaseUrl}${version}${(username === auth.getUsername()) ? auth.user.profilePicture : imageName}`}
                />
              </div>
              {username === auth.getUsername() && (
                <label
                  htmlFor="imageInput"
                  className="camera-icon-container position-absolute bottom-0 end-0"
                  style={{
                    zIndex: 1,
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    borderRadius: "50%", // Add this line to make it rounded
                    backgroundColor: "black", // Add this line to set a background color
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translate(0%, 32%)"
                  }}
                >
                  <input
                    type="file"
                    id="imageInput"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <img src={cameraLogo} alt="Camera Logo" style={{ width: "40px", height: "40px" }} />

                </label>
              )}

            </div>

            <div className="ms-3 username-text">
            <h2 className={`outlined-text ${username === auth.getUsername() ? 'outlined-text' : ''}`}>
              {username}
            </h2>
            </div>
          </div>

          <div className="p-4 bg-light d-flex flex-column">
            <div className="d-flex justify-content-start py-1">
              {username === auth.getUsername() && (
                <button
                  type="button"
                  className="btn btn-outline-dark edit-profile-btn text-centered"
                  data-mdb-ripple-color="dark"
                  onClick={handleEditProfile}
                  style={{ fontSize: "16px", width: "150px" }}
                >
                  Edit profile
                </button>
              )}
              <div className="d-flex text-center py-1 ms-auto">
                <div>
                  <p className="mb-1 h5">{(store.idNamePairs.filter(pair => pair.ownerName === username)).length}</p>
                  <p className="small text-muted mb-0">Maps</p>
                </div>

                <div className="px-3">
                  <p className="mb-1 h5">{totalLikes}</p>
                  <p className="small text-muted mb-0">Likes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-4 text-black">
            <div className="mb-5">
              <p className="lead fw-normal mb-1">About Me</p>
              <div className="p-4 about-me-container" >
                <p className="font-italic mb-1">{(username === auth.getUsername()) ? auth.user.aboutMe : aboutMeText}</p>

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
                {auth.user && auth.user.username === username ? (<button
                  className={`nav-link ${activeTab === 'likedMaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('likedMaps')}
                  data-bs-toggle="tab"
                >
                  {auth.getUsername() !== username ? `${username}'s Liked Maps` : 'My Liked Maps'}
                </button>) : <></>}
              </div>
            </nav>
            <div className="tab-content" >
              {(auth.user && (auth.user.username === username)) ? (activeTab === 'myMaps' && createRows(store.idNamePairs.filter(pair => pair.ownerName === username))) : activeTab === 'myMaps' && createRows(store.idNamePairs.filter(pair => pair.ownerName === username && pair.published))}
              {(auth.user && (auth.user.username === username)) ? (activeTab === 'likedMaps' && createRows(store.idNamePairs.filter(pair => pair.likes.includes(auth.user._id)))) : <></>}
            </div>
          </div>
        </div>
      </div >
      <MapCreateModal show={newMapShow} handleClose={handleClose} />
      <DeleteMapModal deleteMapShow={deleteMapShow} handleDeleteMapClose={handleDeleteMapClose} />
      <ForkMapModal forkMapShow={forkMapShow} handleForkMapClose={handleForkClose} />
      <ExportMapModal exportMapShow={exportMapShow} handleExportMapClose={handleExportClose} />
      <EditProfileModal aboutMeText={aboutMeText} editProfileShow={editProfileShow} handleEditProfileClose={handleEditProfileClose} />
      <PublishMapModal publishMapShow={publishMapShow} handlePublishMapClose={handlePublishClose} />
    </div >
  );
}