import React, { useState, useEffect } from "react";
import styles from "./Profilepage.module.css";
import { useNavigate } from "react-router-dom";

const Profilepage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  return (
    <div className={styles.profileForm}>
      <div className={styles.profileHeader}>
        <img
          src="https://via.placeholder.com/150"
          className={styles.profilePicture}
          alt="Profile Picture"
        />
        <ul className={styles.profileInfoList}>
          <li>
            <i className="fa fa-user"></i> {data.firstname}
          </li>
          <li>
            <i className="fa fa-phone"></i>{" "}
            {data.phone ? data.phone : "Phone Number"}
          </li>
        </ul>
      </div>

      <div className={styles.profileInfo}>
        <h3>Profile Information</h3>
        <hr />
        <form className={styles.profileData}>
          <div className={styles.formGroup}>
            <label htmlFor="firstnameValue">First Name:</label>
            <input
              type="text"
              className="form-control"
              id="firstnameValue"
              value={data.firstname}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Last Name:</label>
            <input
              type="text"
              id="lastnameValue"
              value={data.lastname}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">phone Number:</label>
            <input
              type="text"
              id="phoneValue"
              value={data.phone ? data.phone : ""}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">username:</label>
            <input
              type="text"
              id="usernameValue"
              value={data.username}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="userEmailValue"
              value={data.email}
              disabled={!isEditing}
            />
          </div>

          <button
            type="button"
            className={`btn btn-primary ${styles.editButton}`}
            onClick={handleEditToggle}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profilepage;
