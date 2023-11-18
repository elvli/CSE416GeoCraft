import React from "react"
import '../../App.css';
import AppBanner from "../AppBanner/AppBanner";
import { MapBackground, MapCard, MapCreateModal } from "..";
import ProfileSideBar from "../ProfileSideBar/ProfileSideBar";
import { useState } from "react";
export default function EditScreen(props) {
  const { handleNewMap, handleDeleteMap, handleFork, handleExport } = props;
  const [activeTab, setActiveTab] = useState('myMaps');

  var testMap1 = {
    title: 'USA Map',
    author: 'Darren',
    likes: ['Darren', 'Brian'],
    dislikes: [],
    published: true
  }
  var testMap2 = {
    title: 'test map 2',
    author: 'Brian',
    likes: ['Darren'],
    dislikes: ['Brian'],
    published: false
  }
  var functions = {
    handleDeleteMap: handleDeleteMap,
    handleFork: handleFork,
    handleExport: handleExport
  }

  const publishedArray = [testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1, testMap1];
  const unpubArray = [testMap2, testMap2, testMap2, testMap2, testMap2]

  const createMapCards = (maps, functions) => {
    return maps.map((map, index) => (
      <div class="col-md-3 mb-2" key={index}>
        <MapCard map={map} functions={functions} />
      </div>
    ));
  };

  const createRows = (maps, functions, includeAddMap) => {
    const rows = [];
    if (includeAddMap) {
      rows.push(
        <div class="row g-2" key={0}>
          <div class="col-md-3 mb-2">
            <button type="button" class="btn btn-outline-dark w-100 h-100" onClick={handleNewMap}>
              +
            </button>
          </div>

          {createMapCards(maps.slice(0, 3), functions)}
        </div>
      );
    }

    else {
      rows.push(
        <div class="row g-2" key={0}>
          {createMapCards(maps.slice(0, 4), functions)}
        </div>
      );
    }

    for (let i = 3; i < maps.length; i += 4) {
      const rowMaps = maps.slice(i, i + 4);
      rows.push(
        <div class="row g-2" key={i}>
          {createMapCards(rowMaps, functions)}
        </div>
      );
    }

    return rows;
  };

  return (
    <div class="profile-container">
      <AppBanner />
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">

          <div class="text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "200px", }}>
            <div class="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt1ceyneFkZchgkrwN7dZxWNl_C5Dctvc5BzNh_rEzPQ&s"
                alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
                style={{ width: "150px", zIndex: "1" }} />
              <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                style={{ zIndex: "1" }}>
                Edit profile
              </button>
            </div>
            <div class="ms-3" style={{ marginTop: "150px" }}>
              <h5>Example Username</h5>
            </div>
          </div>
          <div class="p-4" style={{ backgroundColor: "#f8f9fa" }}>
            <div class="d-flex justify-content-end text-center py-1">
              <div>
                <p class="mb-1 h5">5</p>
                <p class="small text-muted mb-0">Maps</p>
              </div>
              <div class="px-3">
                <p class="mb-1 h5">15</p>
                <p class="small text-muted mb-0">Likes</p>
              </div>
            </div>
          </div>
          <div class="card-body p-4 text-black">
            {/* <div class="mb-5">
              <p class="lead fw-normal mb-1">About</p>
              <div class="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                <p class="font-italic mb-1">Web Developer</p>
                <p class="font-italic mb-1">Lives in New York</p>
                <p class="font-italic mb-0">Photographer</p>
              </div>
            </div> */}

            {/* <p class="lead fw-normal mb-0">My Maps</p> */}
            <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  class={`nav-link ${activeTab === 'myMaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('myMaps')}
                  data-bs-toggle="tab"
                >
                  My Maps
                </button>
                <button
                  class={`nav-link ${activeTab === 'likedMaps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('likedMaps')}
                  data-bs-toggle="tab"
                >
                  Liked Maps
                </button>
              </div>
            </nav>

            <div className="tab-content" style={{ marginTop: '20px' }}>
              {activeTab === 'myMaps' && createRows(unpubArray, functions, true)}
              {activeTab === 'likedMaps' && createRows(publishedArray, functions, false)}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}