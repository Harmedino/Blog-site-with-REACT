// components/Footer.js
import React from "react";
import classes from "./Footer.module.css"; // Import your CSS module

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <div className={classes.footerColumn}>
          <h3>About Us</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            tincidunt justo vel fringilla.
          </p>
        </div>
        <div className={classes.footerColumn}>
          <h3>Categories</h3>
          <ul>
            <li>Technology</li>
            <li>Travel</li>
            <li>Fashion</li>
          </ul>
        </div>
        <div className={classes.footerColumn}>
          <h3>Contact Us</h3>
          <p>Email: contact@example.com</p>
          <p>Phone: +1234567890</p>
        </div>
      </div>
      <p className={classes.copyRight}>
        &copy; 2023 Your Blog. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
