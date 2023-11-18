import React from "react"
import '../../App.css';
import AppBanner from "../AppBanner/AppBanner";
import { MapBackground } from "..";
import EditSideBar from "../EditSideBar/EditSideBar";
import { useState } from "react";

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
      {/* <button onClick={() => navigate("create")}>Create</button> */}
    </div>
  )
}