// components/Footer.js
import React from "react";
import classes from "./Footer.module.css"; 
import image from '../image/Vector.png'

const Footer = () => { 
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <div className={classes.logo}>
          <h1> Harmedino </h1>
        </div>
        <div className={classes.footerColumn}>
          <h3>About Us</h3>
          <ul>
            <li>Tecnology</li>
            <li>Careers</li>
            <li>Fashion</li>
            <li>Sustainability</li>
          </ul>
        </div>
        <div className={classes.footerColumn}>
          <h3>Help Center</h3>  
          <ul>
            <li>Contact Us</li>
            <li>Customer Portal Logins</li>
            <li>Digital Partners and Integrations</li>
            <li>Developer Portal </li>
          </ul>
        </div>

        <div className={classes.footerColumn}>
          <h3>Language</h3>
          <p className={classes.vector}><span><img src={image} alt="" /></span>Nigeria</p>
          <select name="lan" id="lan">
            <option value="Englist">English</option>
          </select>
        </div>

      </div> 

      <hr />
      <p className={classes.copyRight}>
        
        &copy; 2023 Your Blog. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
