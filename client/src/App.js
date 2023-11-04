import './App.css';

import React from 'react'
import { AppBanner, LeftSideBar} from './components'

function App() {
  return (
    <div className="App">
      <AppBanner/>
      <LeftSideBar/>

    </div>
  );
}

export default App;