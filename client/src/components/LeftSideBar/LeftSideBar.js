import React, { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../../store'
import { Button, Dropdown } from 'react-bootstrap';
import { Map, PeopleFill, PersonFill, Plus, FunnelFill } from 'react-bootstrap-icons';
import { MapCard } from '../../components';
import AuthContext from '../../auth';
import './LeftSideBar.scss';

export default function LeftSideBar(props) {
  const { handleNewMap, handleDeleteMap, handleFork, handleExport, handlePublish } = props;
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [isToggled, setIsToggled] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [publishedMaps, setPublishedMaps] = useState(false);
  const SortMenu = {
    A_Z: "A-Z",
    POPULAR: "LIKES",
    OLD: "OLD",
    NEW: "NEW",
    Z_A: "Z-A"
  }

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  var functions = {
    handleDeleteMap: handleDeleteMap,
    handleFork: handleFork,
    handleExport: handleExport,
    handlePublish: handlePublish
  }

  var maps;
  if (publishedMaps || !auth.loggedIn) {
    maps = <div>
      {
        store.idNamePairs.filter(pair => pair.name.toUpperCase().includes(queryInput.toUpperCase())).map((pair) => {
          if (pair.published) {
            return <MapCard
              key={pair._id}
              map={pair}
              functions={functions}
            />
          }
        }
        )
      }
    </div>
  }
  else {
    maps = <div>
      {
        store.idNamePairs.filter(pair => pair.name.toUpperCase().includes(queryInput.toUpperCase())).map((pair) => {
          if (pair.ownerEmail === auth.getEmail()) {
            return <MapCard
              key={pair._id}
              map={pair}
              functions={functions}
            />
          }
        }
        )
      }
    </div>
  }

  const handleUserMaps = () => {
    if (publishedMaps) {

    }
    else setPublishedMaps(!publishedMaps)
  }

  const handleMyMaps = () => {
    if (!publishedMaps) {

    }
    else setPublishedMaps(!publishedMaps)
  }
  const handleSortNewest = () => {
    store.setSort(1)
  }

  const handleSortOldest = () => {
    store.setSort(2)
  }

  const handleSortAtoZ = () => {
    store.setSort(3)
  }

  const handleSortZtoA = () => {
    store.setSort(4)
  }

  const handleSortPopular = () => {
    store.setSort(5)
  }

  const handleQueryChange = (event) => {
    setQueryInput(event.target.value);
  }


  var tools = <div className='column-tools'>
    <Button className='btn btn-light new-map-btn' aria-label="Create New Map" onClick={handleNewMap}>
      <Plus className='icon-btn' />
    </Button>
    <Button className='btn btn-light user-maps-btn' aria-label="View Community Maps" onClick={handleUserMaps} active={publishedMaps}>
      <PeopleFill className='icon-btn' />
    </Button>
    <Button className='btn btn-light my-maps-btn' aria-label="View My Maps" onClick={handleMyMaps} active={!publishedMaps}>
      <PersonFill className='icon-btn' />
    </Button>
  </div>

  if (!auth.loggedIn) {
    tools = <div className='column-tools'>
      <Button className='btn btn-light user-maps-btn' onClick={handleUserMaps} active={true}>
        <PeopleFill className='icon-btn' />
      </Button>
    </div>
  }

  return (
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="left-wrapper">
      <div className="bg-light border-right" id="left-sidebar-wrapper">
        <div className="list-group list-group-flush tools-list">
          {tools}

          <div className="row">
            <div className="col-md-7 form1">
              <input
                type="text"
                id="form1"
                className="form-control query"
                placeholder="Search"
                value={queryInput}
                onChange={handleQueryChange}
              />
            </div>

            <div className="col-md-4 filter-btn" style={{width:'0px'}}>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <FunnelFill />
                </Dropdown.Toggle>
                <Dropdown.Menu className='dropdown-menu'>
                  <Dropdown.Item onClick={handleSortNewest}>Sort by date (newest to oldest)</Dropdown.Item>
                  <Dropdown.Item onClick={handleSortOldest}>Sort by date (oldest to newest)</Dropdown.Item>
                  <Dropdown.Item onClick={handleSortAtoZ}>Sort Alphabetically (A to Z)</Dropdown.Item>
                  <Dropdown.Item onClick={handleSortZtoA}>Sort Alphabetically (Z to A)</Dropdown.Item>
                  <Dropdown.Item onClick={handleSortPopular}>Most popular</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="list-group">
            <div className="map-list bg-light left-custom-scrollbar">
              {maps}
            </div>
          </div>
        </div>
      </div>


      <nav className="navbar">
        <button className="btn btn-light" id="left-menu-toggle" onClick={toggleSideBar}>
          <Map className='pencil-icon-btn' />
        </button>
      </nav>
    </div>
  )
}