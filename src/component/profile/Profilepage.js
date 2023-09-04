import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Profilepage.module.css";

import { getAuthToken } from "../../lib/token";
import Message from "../../UI/Message";
import { publicRequest } from "../../request";

const Profilepage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({});
  const inputValue = useRef();
  const [message, setMessage] = useState();
  
  const publicReq = publicRequest();
  const [id, setId] = useState();
  const token = getAuthToken();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await publicReq.post(
        "/verifyToken",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      setId(response.data.message._id);
      setData(response.data.message);
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };

  const handleEditToggle = async () => {
    const formData = new FormData(inputValue.current);
    const newData = {
      firstname: formData.get("firstnameValue"),
      lastname: formData.get("lastnameValue"),
      phone: formData.get("phoneValue"),
      username: formData.get("usernameValue"),
      email: formData.get("userEmailValue"),
    };

    setIsEditing(!isEditing);
    if (isEditing) {
      try {
        console.log(newData);
        const response = await axios.patch(
          "http://localhost:5000/updateUser/" + id,
          JSON.stringify(newData),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setMessage(response.data.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        console.log(error);
        setMessage(error.response.data.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    }
  };
  return (
    <>
      {message && <Message message={message}></Message>}
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
          <form className={styles.profileData} ref={inputValue}>
            <div className={styles.formGroup}>
              <label htmlFor="firstnameValue">First Name:</label>
              <input
                type="text"
                className="form-control"
                name="firstnameValue"
                defaultValue={data ? data.firstname : ""}
                disabled={!isEditing}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">Last Name:</label>
              <input
                type="text"
                name="lastnameValue"
                defaultValue={data.lastname}
                disabled={!isEditing}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">phone Number:</label>
              <input
                type="text"
                name="phoneValue"
                defaultValue={data ? data.phone : ""}
                disabled={!isEditing}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="username">username:</label>
              <input
                type="text"
                name="usernameValue"
                defaultValue={data ? data.username : ""}
                disabled={!isEditing}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="userEmailValue"
                defaultValue={data.email}
                disabled={!isEditing}
                required
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
    </>
  );
};

export default Profilepage;
