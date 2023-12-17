import React, { useEffect, useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalStoreContext from "../../store";
import AppBanner from "../AppBanner/AppBanner.js"
import PropSymbEditBar from "../PropSymbEditBar/PropSymbEditBar.js"
import LineEditSideBar from "../LineEditBar/LineEditBar.js"
import PointEditBar from "../PointEditBar/PointEditBar.js"
import ChoroEditBar from "../ChoroEditBar/ChoroEditBar.js"
import MapBackground from "../MapBackground/MapBackground.js"
import HeatEditBar from "../HeatEditBar/HeatEditBar.js"

const componentMapping = {
  heat: HeatEditBar,
  line: LineEditSideBar,
  point: PointEditBar,
  choro: ChoroEditBar,
  propSymb: PropSymbEditBar,
};

export default function EditScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { mapId } = useParams();
  const mapbox = useRef(null);
  const [mapType, setMapType] = useState('');

  var defaultMapData = {
    points: [{ id: 1, longitude: 0, latitude: 0 }],
    settings: {
      longitude: -73.1217,
      latitude: 40.9083,
      zoom: 13.91
    }
  }

  useEffect(() => {
    try {
      store.setCurrentList(mapId, mapbox);
    }
    catch (error) {
      console.log('setCurrentList error', error);
    }
  }, []);

  useEffect(() => {
    try {
      setMapType(store.currentList.mapType);
    }
    catch (error) {
      console.log('setMapType error', error);
    }
  }, [store.currentList]);

  const MapTypeEditTools = componentMapping[mapType] || null;

  return (
    <div>
      <div style={{ height: '5vh' }} />
      <AppBanner />
      <div className="row1">
        <div className="background">
          <MapBackground map={mapbox} />
        </div>

        <div className="foreground">
          {MapTypeEditTools && (
            <MapTypeEditTools mapId={mapId} points={defaultMapData.points} settings={defaultMapData.settings} map={mapbox} />
          )}
        </div>
      </div>
    </div>
  )
}