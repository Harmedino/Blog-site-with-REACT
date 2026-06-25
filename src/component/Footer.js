import React from "react";
import classes from "./Footer.module.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerTop}>
        <div className={classes.footerBrand}>
          <div className={classes.footerLogo}>
            <span className={classes.logoIcon}>H</span>
            <span className={classes.logoText}>Harmedino</span>
          </div>
          <p>
            A platform for curious minds. We publish stories on technology,
            lifestyle, travel, and everything in between.
          </p>
          <div className={classes.socials}>
            <a href="#twitter" className={classes.socialLink} aria-label="Twitter">
              <span>𝕏</span>
            </a>
            <a href="#instagram" className={classes.socialLink} aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="#linkedin" className={classes.socialLink} aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="#facebook" className={classes.socialLink} aria-label="Facebook">
              <span>f</span>
            </a>
          </div>
        </div>

        <div className={classes.footerLinks}>
          <div className={classes.linkGroup}>
            <h4>Explore</h4>
            <ul>
              <li><NavLink to="/blogList">Home</NavLink></li>
              <li><NavLink to="/about-us">About Us</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              <li><NavLink to="/Auth?mode=signup">Start Writing</NavLink></li>
            </ul>
          </div>

          <div className={classes.linkGroup}>
            <h4>Categories</h4>
            <ul>
              <li><NavLink to="/blogList">Technology</NavLink></li>
              <li><NavLink to="/blogList">Lifestyle</NavLink></li>
              <li><NavLink to="/blogList">Travel</NavLink></li>
              <li><NavLink to="/blogList">Fashion</NavLink></li>
            </ul>
          </div>

          <div className={classes.linkGroup}>
            <h4>Newsletter</h4>
            <p className={classes.newsletterText}>
              Get the best articles delivered to your inbox every week.
            </p>
            <div className={classes.newsletterForm}>
              <input type="email" placeholder="Your email address" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Harmedino. All rights reserved.</p>
        <div className={classes.footerBottomLinks}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
