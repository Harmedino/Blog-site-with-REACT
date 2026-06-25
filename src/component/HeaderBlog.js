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
            <Link to="/" className="hero-btn-secondary">Start Writing</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-img-container">
            <img
              src="https://picsum.photos/seed/harmedino-hero/560/420"
              alt="Writers and readers"
              className="hero-img"
            />
            <div className="hero-img-badge">
              <span className="hero-img-badge-icon">✍️</span>
              <div className="hero-img-badge-text">
                <strong>500+ Stories</strong>
                <span>published this year</span>
              </div>
            </div>
            <div className="hero-img-tag hero-img-tag-1">📖 Technology</div>
            <div className="hero-img-tag hero-img-tag-2">✈️ Travel</div>
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
