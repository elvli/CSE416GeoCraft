import { React, useEffect, useContext, useRef } from "react"
import { AppBanner, EditSideBar } from "../../components";
import { MapBackground } from "..";
import GlobalStoreContext from "../../store";
import { useParams } from "react-router-dom";

export default function EditScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { mapId } = useParams();
  const mapbox = useRef(null)
  var mapData = {
    points: [{id: 1,longitude: 0, latitude: 0}],
    settings: {
      longitude: -73.1217,
      latitude: 40.9083,
      zoom: 13.91
    }
  }

  useEffect(() => {
    try {
      store.setCurrentList(mapId , mapbox);
      console.log(store.currentList)
    } catch (error) {
    }
  }, []);

  async function getData (mapId){
    return await store.getMapDataById(mapId)
  }

  return (
    <div>
      <div style={{ height: '5vh' }} />
      <AppBanner />
      <div className="row1">
        <div className="background">
          <MapBackground />
        </div>

        <div className="foreground">
          <EditSideBar mapId={mapId} points={mapData.points} settings={mapData.settings}/>
        </div>
      </div>
    </div>
  )
}