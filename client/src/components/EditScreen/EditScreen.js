import {React} from "react"
import { AppBanner, EditSideBar } from "../../components";
import { MapBackground } from "..";

export default function EditScreen() {
  return (
    <div>
      <div style={{ height: '5vh' }} />
      <AppBanner />
      <div className="row1">
        <div className="background">
          <MapBackground />
        </div>

        <div className="foreground">
          <EditSideBar />
        </div>
      </div>
    </div>
  )
}