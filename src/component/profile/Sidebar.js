import React, { useState } from "react";
import styles from "./Sidebar.module.css"; // Import your CSS module
import { NavLink } from "react-router-dom";
import profile from '../../image/Ellipse 2.png'

const Sidebar = () => {
  const [selectedOption, setSelectedOption] = useState("profile");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.eclipse}></div>
      <ul>
        
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            end
          >
             <img
            src={profile}
            className={styles.profilePicture}
            alt="Profile"
          />
          </NavLink>
        </li>
        <li>
          {" "}
          <NavLink
            to={"published"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Published Blogs
          </NavLink>
        </li>
        <li>
          {" "}
          <NavLink
            to={"approved"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Approved Blogs
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"disapproved"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Disapproved Blogs
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
