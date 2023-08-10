import React, { useState } from "react";
import styles from "./Profilepage.module.css";

const Profilepage = () => {
  const [isEditing, setIsEditing] = useState(false);

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
            <i className="fa fa-envelope"></i> Email
          </li>
          <li>
            <i className="fa fa-phone"></i> Phone Number
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
              value=""
              disabled={!isEditing}
            />
          </div>
          <div class={styles.formGroup}>
            <label for="name">Last Name:</label>
            <input
              type="text"
              class="form-control"
              id="lastnameValue"
              value=""
              disabled
            />
          </div>
          <div class={styles.formGroup}>
            <label for="name">phone Number:</label>
            <input
              type="text"
              class="form-control"
              id="phoneValue"
              value=""
              disabled
            />
          </div>
          <div class={styles.formGroup}>
            <label for="username">username:</label>
            <input
              type="text"
              class="form-control"
              id="usernameValue"
              value=""
              disabled
            />
          </div>
          <div class={styles.formGroup}>
            <label for="email">Email:</label>
            <input
              type="email"
              class="form-control"
              id="userEmailValue"
              value=""
              disabled
            />
          </div>
          <div class={styles.formGroup}>
            <label for="address">Address:</label>
            <textarea
              class="form-control"
              id="address"
              rows="3"
              disabled
            ></textarea>
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
