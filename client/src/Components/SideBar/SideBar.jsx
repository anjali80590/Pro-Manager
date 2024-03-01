import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.css";
import settings from "../../images/settings.png";
import codesandbox from "../../images/codesandbox.png";
import layout from "../../images/layout.png";
import Analtyics from "../../images/Analtyics.png";
import Logout from "../../images/Logout.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function LogoutPopup({ onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.logouttxt}>Are you sure you want to Logout?</h2>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.modalConfirmButton}>
            Yes, Log Out
          </button>
          <button onClick={onCancel} className={styles.modalCloseButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SideBar() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <nav className={styles.navigation}>
          <div className={styles.logo}>
            {" "}
            <img className={styles.codesandbox} src={codesandbox} alt="" />
            Pro Manage
          </div>
          <div className={styles.hover}>
            <NavLink
              to="/dashboard/board"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <img src={layout} alt="" /> Board
            </NavLink>
          </div>
          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <img src={Analtyics} alt="" /> Analytics
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <img src={settings} alt="" /> Settings
          </NavLink>
        </nav>
        <div onClick={handleLogoutClick} className={styles.logout}>
          <button className={styles.logouttxt}>
            {" "}
            <img className={styles.logoutImg} src={Logout} alt="" />
            Log out
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}></main>
      {showLogoutPopup && (
        <LogoutPopup onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </div>
  );
}

export default SideBar;
