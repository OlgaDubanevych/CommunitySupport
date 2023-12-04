import React, { useState } from "react";
import ToolBar from './ToolBar'
import SideDrawer from "./Sidemenu/SideDrawer";
import BackDrop from "./Backdrop/BackDrop";
import "./NavBar.css";
import LogIn from './LogIn'



function NavBar() {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const backDropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  let backdrop;

  if (sideDrawerOpen) {
    backdrop = <BackDrop click={backDropClickHandler} />;
  }

  return (
    <div style={{ height: "100%" }}>
      <ToolBar drawerToggleClickHandler={drawerToggleClickHandler} />
      <SideDrawer show={sideDrawerOpen} />
      {backdrop}
      <main style={{ marginTop: "64px" }}></main>
    </div>
  );
}

export default NavBar;
