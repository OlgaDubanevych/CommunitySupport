import React from "react";
import "./SideDrawer.css";

const SideDrawer = (props) => {
  let drawerClasses = ["side-drawer"];

  if (props.show) {
    drawerClasses = ["side-drawer", "open"];
  }

  return (
    <nav className={drawerClasses.join(" ")}>
      <ul>
      <li>
            <a href="/">About us</a>
          </li>
          <li>
            <a href="/discussions">Discussion</a>
          </li>
          <li>
            <a href="/job_search">Job Search</a>
          </li>
          <li>
            <a href="/donate">Donate</a>
          </li>
          <li>
            <a href="/immigration">Immigration</a>
          </li>
          </ul>
    </nav>
  );
};

export default SideDrawer;




