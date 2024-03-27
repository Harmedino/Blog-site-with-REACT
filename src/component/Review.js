import React from "react";
import styles from "./Review.module.css";

const Review = () => {
  return (
    <div className={styles.reviewSection}>
      <h2>Customer Reviews</h2>
      <div className={styles.reviewContainer}>
        <div className={styles.review}>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage: `url('https://c8.alamy.com/comp/2J3B2T7/3d-illustration-of-smiling-businessman-close-up-portrait-cute-cartoon-man-avatar-character-face-isolated-on-white-background-2J3B2T7.jpg')`,
            }}
          ></div>
          <div className={styles.reviewContent}>
            <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
            <p>"Informative and interesting blog. Enjoyed reading it!"</p>
            <span>- John Doe</span>
          </div>
        </div>
        <div className={styles.review}>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRGB1mdXnu6nUg_p1SLPD_spTZckk37Qj-njrTrTJs-w&s')`,
            }}
          ></div>
          <div className={styles.reviewContent}>
            <div className={styles.rating}>⭐⭐⭐⭐</div>
            <p>
              "One of the best blogs I've read. Well-researched and insightful."
            </p>
            <span>- Mary Johnson</span>
          </div>
        </div>
        <div className={styles.review}>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage: `url('https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg')`,
            }}
          ></div>
          <div className={styles.reviewContent}>
            <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
            <p>
              "Very insightful blog post! It provided a fresh perspective on the
              topic."
            </p>
            <span>- Alex Smith</span>
          </div>
        </div>
        <div className={styles.review}>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage: `url('https://img.favpng.com/18/17/4/computer-icons-user-profile-female-avatar-png-favpng-J49fwYQdgqY7JajmQdyGdWuP2.jpg')`,
            }}
          ></div>
          <div className={styles.reviewContent}>
            <div className={styles.rating}>⭐⭐⭐⭐</div>
            <p>
              "This blog is incredibly informative and well-written. I learned a
              lot from it!"
            </p>
            <span>- Emily Brown</span>
          </div>
        </div>
        <div className={styles.review}>
          <div
            className={styles.profileImage}
            style={{
              backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg')`,
            }}
          ></div>
          <div className={styles.reviewContent}>
            <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
            <p>"Great blog post! Engaging content and easy to follow."</p>
            <span>- Michael Clark</span>
          </div>
        </div>
        {/* Repeat for other reviews */}
      </div>
    </div>
  );
};

export default Review;
