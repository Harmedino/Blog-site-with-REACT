import React from "react";
import Sidebar from "./Sidebar";
import styles from "./Profile.module.css";

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      <Sidebar />
      <div className={styles.content}></div>
    </div>
  );
};

export default Profile;
