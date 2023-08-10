import React from "react";
import styles from "./AboutUs.module.css"; // Import your CSS module

const AboutUs = () => {
  return (
    <>
      <div>
        <div className={styles.hero}>
          <h2>About Us</h2>
          <p>Our story and mission...</p>
        </div>
      </div>
      <div className={styles["about-container"]}>
        <h1>About Us</h1>
        <p>
          Welcome to our blog! We are passionate about sharing valuable
          insights, tips, and stories about various topics. Our mission is to
          provide informative and engaging content that keeps you coming back
          for more.
        </p>
        <p>
          Our team of dedicated writers and experts are committed to delivering
          high-quality articles that cater to your interests. Whether you're
          looking for travel inspiration, technology trends, or lifestyle
          advice, you'll find it all here.
        </p>
        <p>
          Thank you for being a part of our community. Feel free to explore our
          blog and connect with us through our social media channels.
        </p>
      </div>
    </>
  );
};

export default AboutUs;
