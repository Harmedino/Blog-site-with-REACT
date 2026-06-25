import React from "react";
import styles from "./Review.module.css";

const reviews = [
  {
    name: "John Doe",
    role: "Software Engineer",
    rating: 5,
    text: "Informative and interesting blog. Enjoyed reading every article — always fresh and well-researched!",
    initial: "J",
    color: "#060A6B",
  },
  {
    name: "Mary Johnson",
    role: "Product Designer",
    rating: 4,
    text: "One of the best blogs I've read. Well-researched and insightful. I come back every week for new posts.",
    initial: "M",
    color: "#e74c3c",
  },
  {
    name: "Alex Smith",
    role: "Travel Writer",
    rating: 5,
    text: "Very insightful blog post! It provided a fresh perspective on the topic. Highly recommend to everyone.",
    initial: "A",
    color: "#27ae60",
  },
  {
    name: "Emily Brown",
    role: "Lifestyle Blogger",
    rating: 4,
    text: "This blog is incredibly informative and well-written. I learned a lot and keep sharing it with friends!",
    initial: "E",
    color: "#8e44ad",
  },
  {
    name: "Michael Clark",
    role: "Tech Enthusiast",
    rating: 5,
    text: "Great blog post! Engaging content and easy to follow. One of my go-to sites for quality reading.",
    initial: "M",
    color: "#d35400",
  },
  {
    name: "Priya Patel",
    role: "Content Creator",
    rating: 5,
    text: "Harmedino never disappoints. The writing quality is exceptional and each post brings so much value.",
    initial: "P",
    color: "#1abc9c",
  },
];

const StarRating = ({ count }) => (
  <div className={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= count ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ))}
  </div>
);

const Review = () => {
  return (
    <section className={styles.reviewSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Testimonials</span>
          <h2>What Our Readers Say</h2>
          <p>Join thousands of happy readers who find inspiration and knowledge every day.</p>
        </div>
        <div className={styles.reviewGrid}>
          {reviews.map((review, i) => (
            <div className={styles.reviewCard} key={i}>
              <StarRating count={review.rating} />
              <p className={styles.reviewText}>"{review.text}"</p>
              <div className={styles.reviewer}>
                <div className={styles.avatar} style={{ background: review.color }}>
                  {review.initial}
                </div>
                <div>
                  <strong className={styles.reviewerName}>{review.name}</strong>
                  <span className={styles.reviewerRole}>{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
