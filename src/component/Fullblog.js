import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./FullBlog.module.css";
import { getAuthToken } from "../lib/token";
import { publicRequest } from "../request";
import Message from "../UI/Message";

const Fullblog = () => {
  const { id } = useParams();
  const [blog, setBlogs] = useState();
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState();
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
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setAuthorName(response.data.message.username);
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };

  async function fetching() {
    try {
      const response = await publicReq.get(`/getBlog/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setBlogs(response.data);
    } catch (error) {
      setMessage("Network error occurred");
    }
  }

  const formatPublicationDate = (date) => {
    const currentDate = new Date();
    const publicationDate = new Date(date);
    const diff = (currentDate - publicationDate) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
    }
    if (diff < 2592000) {
      const d = Math.floor(diff / 86400);
      return `${d} ${d === 1 ? "day" : "days"} ago`;
    }
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `last ${months[publicationDate.getMonth()]}`;
  };

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleSubmitComment() {
    try {
      const response = await publicReq.post(
        `/addComment/${id}`,
        { comment, author: authorName },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setComment("");
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    } finally {
      fetching();
    }
  }

  return (
    <div className={styles.blogDetails}>
      {message && <Message message={message} />}
      {blog && (
        <article className={styles.article}>
          <div className={styles.blogHero}>
            <img src={blog.image} alt={blog.title} />
          </div>

          <div className={styles.blogMeta}>
            <span className={styles.blogCategory}>{blog.category}</span>
            <span className={styles.blogMetaItem}>✍️ {blog.author}</span>
            <span className={styles.blogMetaItem}>📅 {formatPublicationDate(blog.date)}</span>
          </div>

          <h1 className={styles.blogTitle}>{blog.title}</h1>

          <div className={styles.blogBody}>{blog.body}</div>

          {token && (
            <div className={styles.commentSection}>
              <h3>Leave a Comment</h3>
              <textarea
                className={styles.commentTextarea}
                value={comment}
                onChange={handleCommentChange}
                placeholder="Share your thoughts on this post..."
              />
              <button className={styles.commentBtn} onClick={handleSubmitComment}>
                Post Comment
              </button>
            </div>
          )}

          <div className={styles.commentSection}>
            <h3>Comments ({blog.comments.length})</h3>
            {blog.comments.length === 0 ? (
              <p className={styles.noComments}>No comments yet. Be the first to share your thoughts!</p>
            ) : (
              <div className={styles.commentsList}>
                {blog.comments.map((c) => (
                  <div className={styles.commentItem} key={c._id}>
                    <p className={styles.commentAuthor}>@{c.author}</p>
                    <p className={styles.commentText}>{c.comment}</p>
                    <p className={styles.commentDate}>
                      {formatPublicationDate(c.date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
};

export default Fullblog;
