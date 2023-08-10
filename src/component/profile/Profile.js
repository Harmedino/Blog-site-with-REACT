import React from "react";
import Sidebar from "./Sidebar";
import styles from "./Profile.module.css";
import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      <div className={styles.aside}>
        <Sidebar />
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
