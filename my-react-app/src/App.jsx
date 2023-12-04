import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar"
import Footer from "./components/Footer/Footer"
import SideMenu from "./components/NavBar/Sidemenu/SideMenu";
import BackDrop from "./components/NavBar/Backdrop/BackDrop";
import AboutUs from "./components/Pages/AboutUs";
import DiscussionPage from "./components/Pages/DiscussionPage";
import DonationsPage from "./components/Pages/DonationsPage";
import JobSearchPage from "./components/Pages/JobSearchPage"
import ImmigrationPage from "./components/Pages/ImmigrationPage";
import "./styles.css";



const App = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const backDropClickHandler = () => {
    setSideMenuOpen(false);
  };

  let backdrop;
  if (sideMenuOpen) {
    backdrop = <BackDrop click={backDropClickHandler} />;
  }

  return (
    <Router>
      <div className="App">
        <NavBar drawerToggleClickHandler={drawerToggleClickHandler} />
        <SideMenu show={sideMenuOpen} />
        {backdrop}
        <main className="content">
          <Routes>
            <Route path="/" element={<AboutUs />} />
            <Route path="/discussions" element={<DiscussionPage />} />
            <Route path="/donate" element={<DonationsPage />} />
            <Route path="/job_search" element={<JobSearchPage />} />
            <Route path="/immigration" element={<ImmigrationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;