import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../UI/Message";
import { getAuthToken } from "../lib/token";
import { publicRequest, BaseUrl } from "../request";
import styles from "./CreateBlog.module.css";

const CATEGORIES = ["Technology", "Travel", "Fashion", "Food", "Lifestyle"];

const estimateReadTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const CreateBlog = () => {
  const [pending, setPending] = useState(false);
  const [existingBlog, setExistingBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [bodyText, setBodyText] = useState("");
  const [tags, setTags] = useState("");
  const blogForm = useRef();
  const navigate = useNavigate();
  const token = getAuthToken();
  const publicReq = publicRequest();
  const { id } = useParams();

  useEffect(() => {
    verifyToken();
    if (id) fetchBlog();
  }, [id]);

  const verifyToken = async () => {
    try {
      const res = await publicReq.post(
        "/verifyToken",
        {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setUserName(res.data.message);
    } catch (err) {
      console.error("Token verification error:", err.message);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await publicReq.get(`/getBlog/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setExistingBlog(res.data);
      setBodyText(res.data.body || "");
      setTags(res.data.tags ? res.data.tags.join(", ") : "");
      if (res.data.image) setImagePreview(res.data.image);
    } catch (err) {
      console.error("Error fetching blog:", err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(blogForm.current);
    formData.append("authorId", userName._id);
    formData.set("tags", tags);
    setPending(true);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (!userName._id) {
      setMessage("Session not ready. Please wait a moment and try again.");
      setPending(false);
      return;
    }

    try {
      let response;
      if (!existingBlog) {
        response = await publicReq.post("/sendPost", formData, config);
      } else {
        response = await publicReq.patch(`/update/${id}`, formData, config);
      }
      setMessage(response.data.message);
      setTimeout(() => {
        setMessage("");
        navigate("/blogList");
      }, 2500);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setMessage(msg);
      if (msg === "Unauthorized. Token missing or invalid.") {
        setTimeout(() => navigate("/Auth?mode=login"), 3000);
      } else {
        setTimeout(() => setMessage(""), 4000);
      }
    } finally {
      setPending(false);
    }
  };

  const isEdit = !!existingBlog;

  return (
    <div className={styles.createPage}>
      {message && <Message message={message} />}

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1>{isEdit ? "Edit Blog Post" : "Write a New Post"}</h1>
          <p>{isEdit ? "Update your existing blog post below." : "Share your ideas, stories, and knowledge with the world."}</p>
        </div>
      </div>

      <div className={styles.container}>
        <form ref={blogForm} onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <div className={styles.mainCol}>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Post Details</h3>

              <div className={styles.formGroup}>
                <label>Blog Title <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={existingBlog?.title || ""}
                  placeholder="Enter a compelling title..."
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Excerpt / Short Summary</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  defaultValue={existingBlog?.excerpt || ""}
                  placeholder="Write a short description that appears in blog listings (optional)..."
                  className={styles.input}
                  maxLength={200}
                />
                <span className={styles.hint}>Displayed as the blog card preview. Max 200 characters.</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Blog Content <span className={styles.required}>*</span>
                  {bodyText && (
                    <span className={styles.readTime}>
                      ~{estimateReadTime(bodyText)} min read
                    </span>
                  )}
                </label>
                <textarea
                  name="body"
                  rows="16"
                  required
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write your blog content here..."
                  className={`${styles.input} ${styles.bodyArea}`}
                />
                <span className={styles.hint}>{bodyText.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

          </div>

          <div className={styles.sideCol}>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Publish</h3>
              <div className={styles.authorRow}>
                <div className={styles.authorAvatar}>{userName.username?.[0]?.toUpperCase() || "U"}</div>
                <div>
                  <strong>{userName.username || "Loading..."}</strong>
                  <span className={styles.authorLabel}>Author</span>
                </div>
              </div>
              <input type="hidden" name="author" value={userName.username || ""} />

              <div className={styles.formGroup}>
                <label>Publication Date <span className={styles.required}>*</span></label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={existingBlog?.date || new Date().toISOString().split("T")[0]}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={styles.publishBtn}
                disabled={pending}
              >
                {pending
                  ? <><span className={styles.btnSpinner}></span> {isEdit ? "Updating..." : "Publishing..."}</>
                  : isEdit ? "Update Post" : "Publish Post"
                }
              </button>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Category & Tags</h3>

              <div className={styles.formGroup}>
                <label>Category <span className={styles.required}>*</span></label>
                <select name="category" required className={styles.input} defaultValue={existingBlog?.category || ""}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. react, javascript, web"
                  className={styles.input}
                />
                <span className={styles.hint}>Comma-separated keywords</span>
                {tags && (
                  <div className={styles.tagPreview}>
                    {tags.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                      <span key={i} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Cover Image <span className={styles.required}>*</span></h3>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Cover preview" />
                </div>
              )}
              <label className={styles.fileLabel}>
                <span>{imagePreview ? "Change Image" : "Choose Image"}</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required={!existingBlog}
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
              <span className={styles.hint}>JPG, PNG, WebP. Recommended 1200×630px.</span>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
