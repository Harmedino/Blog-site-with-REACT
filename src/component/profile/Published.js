import React, { useEffect, useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import { publicRequest } from "../../request";
import styles from "./ProfileBlogList.module.css";

const Published = () => {
  const [blogs, setBlogs] = useState([]);
  const [fail, setFail] = useState("");
  const [pending, setPending] = useState(true);
  const [id, setId] = useState(null);
  const token = useRouteLoaderData("root");
  const publicReq = publicRequest();

  useEffect(() => { verifyToken(); }, []);
  useEffect(() => { if (id) fetching(); }, [id]);

  const verifyToken = async () => {
    try {
      const res = await publicReq.post(
        "/verifyToken",
        {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setId(res.data.message._id);
    } catch (err) {
      console.error("Token error:", err.message);
    }
  };

  const fetching = async () => {
    try {
      const { data } = await publicReq.get(`/getUserBlog/${id}`);
      setBlogs(data);
    } catch (err) {
      setFail(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.listPage}>
      <div className={styles.listHeader}>
        <h2>All My Posts</h2>
        <p>All blog posts you have submitted, with their current status.</p>
      </div>
      <div className={styles.grid}>
        {pending && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div> Loading your posts...
          </div>
        )}
        {fail && (
          <div className={styles.emptyState}>
            <h3>Error loading posts</h3><p>{fail}</p>
          </div>
        )}
        {!pending && !fail && blogs.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No posts yet</h3>
            <p>You haven't published any blog posts yet.</p>
          </div>
        )}
        {blogs.map((blog) => (
          <div className={styles.card} key={blog._id}>
            <div className={styles.cardImage}>
              <img src={blog.image} alt={blog.title} />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTop}>
                <span className={styles.categoryBadge}>{blog.category}</span>
                <span className={`${styles.statusBadge} ${blog.publication ? styles.statusApproved : styles.statusPending}`}>
                  {blog.publication ? "Approved" : "Pending"}
                </span>
              </div>
              <p className={styles.cardTitle}>{blog.title}</p>
              <p className={styles.cardExcerpt}>{blog.excerpt || blog.body.slice(0, 120)}...</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>📅 {blog.date}</span>
                <Link to={`/more/${blog._id}`} className={styles.readLink}>Read →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Published;
