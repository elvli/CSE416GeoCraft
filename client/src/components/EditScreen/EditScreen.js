import { React, useEffect, useContext, useRef } from "react"
import { AppBanner, EditSideBar } from "../../components";
import { MapBackground } from "..";
import GlobalStoreContext from "../../store";
import { useParams } from "react-router-dom";

export default function EditScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { mapId } = useParams();
  const mapbox = useRef(null)

  useEffect(() => {
    try {
      store.setCurrentList(mapId , mapbox);
    } catch (error) {

    }
  }, []);

  return (
    <div>
      <div style={{ height: '5vh' }} />
      <AppBanner />
      <div className="row1">
        <div className="background">
          <MapBackground />
        </div>

        <div className="foreground">
          <EditSideBar mapId={mapId}/>
        </div>
      </div>
    </div>
  )
}