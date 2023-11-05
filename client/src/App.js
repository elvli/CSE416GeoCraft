import './App.css';

import React from 'react'
import { AppBanner, LeftSideBar, TestingComponent} from './components'

function App() {
  return (
    <div className="App">
      <AppBanner/>
      {/* <LeftSideBar/> */}
      <TestingComponent/>
    </div>
  );
}

export default App;