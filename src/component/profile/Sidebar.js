import React, { useState } from "react";
import styles from "./Sidebar.module.css"; // Import your CSS module

const Sidebar = () => {
  const [selectedOption, setSelectedOption] = useState("profile");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <aside className={styles.sidebar}>
      <ul>
        <li>Profile</li>
        <li>Approved Blogs</li>
        <li>Disapproved Blogs</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
