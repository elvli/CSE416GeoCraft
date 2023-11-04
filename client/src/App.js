import './App.css';

import React from 'react'
import { AppBanner, LeftSideBar, MapBackground} from './components'

function App() {
  return (
    <div className="App">
      <AppBanner/>
      <div className="row1">
          <div className="background">
            <MapBackground />
          </div>
          <div className="foreground">
            <LeftSideBar />
          </div>
      </div>
    </div>
  );
}

export default App;