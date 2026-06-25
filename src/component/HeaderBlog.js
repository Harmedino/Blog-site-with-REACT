import React from "react";
import "./HeaderBlog.css";
import { Link } from "react-router-dom";

const HeaderBlog = () => {
  return (
    <div className="hero-container">
      <div className="hero-backdrop"></div>
      <div className="hero-body">
        <div className="hero-text">
          <span className="hero-badge">Welcome to Harmedino</span>
          <h1>Discover Stories That <span className="hero-highlight">Inspire</span> You</h1>
          <p>
            Explore thoughtful articles on technology, lifestyle, travel, and more — written by passionate writers from around the world.
          </p>
          <div className="hero-actions">
            <Link to="/blogList" className="hero-btn-primary">Browse Posts</Link>
            <Link to="/Auth?mode=signup" className="hero-btn-secondary">Start Writing</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="hero-card-icon">✍️</div>
            <span>Share your story</span>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hero-card-icon">🌍</div>
            <span>Reach readers globally</span>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hero-card-icon">💡</div>
            <span>Spark new ideas</span>
          </div>
        </div>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <strong>500+</strong>
          <span>Articles</span>
        </div>
        <div className="hero-stat-divider"></div>
        <div className="hero-stat">
          <strong>120+</strong>
          <span>Writers</span>
        </div>
        <div className="hero-stat-divider"></div>
        <div className="hero-stat">
          <strong>10K+</strong>
          <span>Readers</span>
        </div>
        <div className="hero-stat-divider"></div>
        <div className="hero-stat">
          <strong>15+</strong>
          <span>Categories</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderBlog;
