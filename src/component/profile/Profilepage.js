import React, { useState, useEffect, useRef } from "react";
import styles from "./Profilepage.module.css";
import { getAuthToken } from "../../lib/token";
import Message from "../../UI/Message";
import { publicRequest } from "../../request";

const Profilepage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({});
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const inputValue = useRef();
  const publicReq = publicRequest();
  const token = getAuthToken();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await publicReq.post(
        "/verifyToken",
        {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setId(response.data.message._id);
      setData(response.data.message);
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const formData = new FormData(inputValue.current);
    const newData = {
      firstname: formData.get("firstnameValue"),
      lastname: formData.get("lastnameValue"),
      phone: formData.get("phoneValue"),
      username: formData.get("usernameValue"),
      email: formData.get("userEmailValue"),
    };

    setSaving(true);
    try {
      const response = await publicReq.patch(
        `/updateUser/${id}`,
        JSON.stringify(newData),
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setMessage(response.data.message);
      setData({ ...data, ...newData });
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const initials = `${data.firstname?.[0] || ""}${data.lastname?.[0] || ""}`.toUpperCase() || "U";

  return (
    <>
      {message && <Message message={message} />}
      <div className={styles.profilePage}>

        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>{initials}</div>
          <div className={styles.headerInfo}>
            <h2>{data.firstname ? `${data.firstname} ${data.lastname}` : "Loading..."}</h2>
            <span className={styles.username}>@{data.username || "—"}</span>
            <span className={styles.emailBadge}>{data.email || ""}</span>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h3>Profile Information</h3>
            <button
              type="button"
              className={`${styles.editBtn} ${isEditing ? styles.editBtnSave : ""}`}
              onClick={handleEditToggle}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <form ref={inputValue} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstnameValue"
                defaultValue={data.firstname || ""}
                disabled={!isEditing}
                placeholder="First name"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastnameValue"
                defaultValue={data.lastname || ""}
                disabled={!isEditing}
                placeholder="Last name"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                name="usernameValue"
                defaultValue={data.username || ""}
                disabled={!isEditing}
                placeholder="Username"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneValue"
                defaultValue={data.phone || ""}
                disabled={!isEditing}
                placeholder="e.g. +234 800 000 0000"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Email Address</label>
              <input
                type="email"
                name="userEmailValue"
                defaultValue={data.email || ""}
                disabled={!isEditing}
                placeholder="your@email.com"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profilepage;
