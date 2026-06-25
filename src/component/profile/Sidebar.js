import React from "react";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/profile", label: "My Profile", icon: "👤", end: true },
  { to: "published", label: "Published", icon: "📝" },
  { to: "approved", label: "Approved", icon: "✅" },
  { to: "disapproved", label: "Disapproved", icon: "❌" },
];

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.avatarCircle}>U</div>
        <span className={styles.sidebarTitle}>My Account</span>
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
