import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./FullBlog.module.css";
import axios from "axios";
import { getAuthToken } from "../lib/token";
import { publicRequest } from "../request";

const Fullblog = () => {
  const { id } = useParams();
  const [blog, setBlogs] = useState();
  const [fail, setFail] = useState();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const token = getAuthToken();
  
  const publicReq = publicRequest();
  useEffect(() => {
    fetching();
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await publicReq.post(
        "/verifyToken",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message.role === "User") {
        setData("");
      } else {
        setData(response.data.message.role);
      }
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };
  async function fetching() {
    const token = getAuthToken();
    try {
      const res = await publicReq.get("/getBlog/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        const errorData = await res.json();
        setFail(errorData.message);
      }
    } catch (error) {
      setFail(error.message);
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
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`http://localhost:5000/deleteBlog/${id}`, config);
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
      {/* <h1>Technology</h1> */}
      {blog && (
        <article>
          <div className={`${styles["blog-image"]}`}>
            <img
              src={`${publicReq}/uploads/${blog.image.data}`}
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
              {data && (
                <button onClick={() => handleClick(blog._id)}>Delete</button>
              )}
              {data && (
                <button onClick={() => handleEdit(blog._id)}>Edit</button>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default Fullblog;
