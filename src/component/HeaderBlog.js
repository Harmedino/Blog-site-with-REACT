import React from "react";
import "./HeaderBlog.css"; // Import your CSS file
import image from "../image/image 1.png"

const HeaderBlog = () => {
  return (
    <div className="hero-container">
      <div className="eclipse"> </div>
        <div className="hero-body">
          <div className="hero-text">
            <h1>Welcome to our blog</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure possimus nobis facilis adipisci corrupti aliquid modi odit quam rem deserunt. Labore corporis earum iste eius quae voluptas officia odio quasi!</p>
      </div>
        <div className="hero-image">
          <img src={ image} alt="blog" srcset="" />
      </div>
        </div>
     
    </div>
  );
};

export default HeaderBlog;
