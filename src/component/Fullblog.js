import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./FullBlog.module.css";
import { getAuthToken } from "../lib/token";
import { publicRequest } from "../request";
import Message from "../UI/Message";

const Fullblog = () => {
  const { id } = useParams();
  const [blog, setBlogs] = useState();
  const [data, setData] = useState({});
  const [message, setMessage] = useState();
  // const navigate = useNavigate();
  const [comment, setComment] = useState("");
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
      setData(response.data.message.username);
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };
  async function fetching() {
    try {
      const response = await publicReq.get(`/getBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      setBlogs(data);
      console.log(data);
    } catch (error) {
      setMessage("Network error occurred");
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

  // async function handleClick(id) {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   try {
  //     await axios.delete(`http://localhost:5000/deleteBlog/${id}`, config);
  //     navigate("/blogList");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // }

  // function handleEdit(id) {
  //   navigate(`/${id}`);
  // }

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleSubmitComment() {
    try {
      const response = await publicReq.post(
        `/addComment/${id}`,
        {
          comment: comment,
          author: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComment("");
      setMessage(response.data.message)
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    } finally {
      fetching()
    }
  }

  return (
  
    <div className={styles["blog-details"]}>
      {message && <Message message={message} />}
      
      {blog && (
        <article>
          <div className={`${styles["blog-image"]}`}>
            <img src={blog.image} alt="Blog Post" />
          </div>
          <div className={`${styles["blog-content"]}`}>
            <h2>{blog.title}</h2>
            <p>Written by {blog.author}</p>
            <p>Category: {blog.category}</p>
            <p>Publication Date: {formatPublicationDate(blog.date)}</p>
            <div style={{ whiteSpace: "pre-line" }}>{blog.body}</div>
            <div className={`${styles["button-container"]}`}>
              {/* {data && (
                <button onClick={() => handleClick(blog._id)}>Delete</button>
              )}
              {data && (
                <button onClick={() => handleEdit(blog._id)}>Edit</button>
              )} */}
              {token && (
                <div className={styles["comment-section"]}>
                  <h3>Comments</h3>
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment..."
                  />
                  <button onClick={handleSubmitComment}>Submit Comment</button>
                </div>
              )}
            </div>
            {blog.comments.length !== 0 ? (
              blog.comments.map((comment) => (
                <div className={styles["comment"]} key={comment._id}>
                  <p className={styles["comment-author"]}>
                    By {comment.author}
                  </p>
                  <p>{comment.comment}</p>
                  <p className={styles["comment-date"]}>
                    Commented on {formatPublicationDate(comment.date)}
                  </p>
                </div>
              ))
            ) : (
              <p>no comments</p>
            )}
          </div>
        </article>
      )}
    </div>
  );
};

export default Fullblog;
