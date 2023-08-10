import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./FullBlog.module.css";

const Fullblog = () => {
  const { id } = useParams();
  const [blog, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetching();
  }, []);

  async function fetching() {
    try {
      const res = await fetch("http://localhost:5000/getBlog/" + id);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
    }
  }

  const formatPublicationDate = (date) => {
    const currentDate = new Date();
    const publicationDate = new Date(date);

    const timeDifferenceInSeconds = (currentDate - publicationDate) / 1000;

    if (timeDifferenceInSeconds < 60) {
      return "just now";
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (timeDifferenceInSeconds < 2592000) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[publicationDate.getMonth()];
      return `last ${month}`;
    }
  };

  async function handleClick(id) {
    try {
      await fetch("http://localhost:5000/deleteBlog/" + id, {
        method: "DELETE",
      });
      navigate("/blogList");
    } catch (err) {
      alert(err.message);
    }
  }
  function handleEdit(id) {
    navigate(`/${id}`);
  }
  return (
    <div className={styles["blog-details"]}>
      {blog && (
        <article>
          <div className={`${styles["blog-image"]}`}>
            <img
              src={`http://localhost:5000/uploads/${blog.image.data}`}
              alt="Blog Post"
            />
          </div>
          <div className={`${styles["blog-content"]}`}>
            <h2>{blog.title}</h2>
            <p>Written by {blog.author}</p>
            <p>Category: {blog.category}</p>
            <p>Publication Date: {formatPublicationDate(blog.date)}</p>
            <div style={{ whiteSpace: "pre-line" }}>{blog.body}</div>
            <div className={`${styles["button-container"]}`}>
              {/* <button onClick={() => handleClick(blog._id)}>Delete</button>
              <button onClick={() => handleEdit(blog._id)}>Edit</button> */}
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default Fullblog;
