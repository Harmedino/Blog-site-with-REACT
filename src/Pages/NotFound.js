import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1>Page Not Found</h1>
        <p>
          Looks like you've wandered off the beaten path. The page you're
          looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/blogList" className={styles.btnPrimary}>
            ← Go Home
          </Link>
          <Link to="/contact" className={styles.btnSecondary}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
