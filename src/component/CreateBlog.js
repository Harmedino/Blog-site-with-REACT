import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../UI/Message";
import { getAuthToken } from "../lib/token";
import { publicRequest } from "../request";
import styles from "./CreateBlog.module.css";

const CATEGORIES = ["Technology", "Travel", "Fashion", "Food", "Lifestyle"];

const estimateReadTime = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const validateFields = ({ title, body, category, date, image, excerpt, isEdit }) => {
  const errs = {};

  if (!title.trim()) {
    errs.title = "Title is required.";
  } else if (title.trim().length < 5) {
    errs.title = "Title must be at least 5 characters.";
  } else if (title.trim().length > 120) {
    errs.title = "Title must be 120 characters or fewer.";
  }

  if (!body.trim()) {
    errs.body = "Content is required.";
  } else {
    const wc = body.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 30) {
      errs.body = `Content is too short — write at least ${30 - wc} more word${30 - wc === 1 ? "" : "s"}.`;
    }
  }

  if (!category) {
    errs.category = "Please select a category.";
  }

  if (!date) {
    errs.date = "Please select a publication date.";
  }

  if (!isEdit && !image) {
    errs.image = "A cover image is required.";
  }

  if (excerpt && excerpt.length > 200) {
    errs.excerpt = "Excerpt must be 200 characters or fewer.";
  }

  return errs;
};

const CreateBlog = () => {
  const [pending, setPending] = useState(false);
  const [existingBlog, setExistingBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const blogForm = useRef();
  const navigate = useNavigate();
  const token = getAuthToken();
  const publicReq = publicRequest();
  const { id } = useParams();

  useEffect(() => {
    verifyToken();
    if (id) fetchBlog();
  }, [id]);

  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title || "");
      setExcerpt(existingBlog.excerpt || "");
      setBodyText(existingBlog.body || "");
      setTags(existingBlog.tags ? existingBlog.tags.join(", ") : "");
      setCategory(existingBlog.category || "");
      setDate(existingBlog.date || new Date().toISOString().split("T")[0]);
      if (existingBlog.image) setImagePreview(existingBlog.image);
    }
  }, [existingBlog]);

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
    } catch (err) {
      console.error("Error fetching blog:", err.message);
    }
  };

  const currentValues = () => ({
    title,
    body: bodyText,
    category,
    date,
    image: imageFile || imagePreview,
    excerpt,
    isEdit: !!existingBlog,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateFields(currentValues());
    setErrors((prev) => ({ ...prev, [field]: errs[field] || "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTouched((prev) => ({ ...prev, image: true }));

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG, PNG, WebP, or GIF images are allowed." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { title: true, body: true, category: true, date: true, image: true, excerpt: true };
    setTouched(allTouched);

    const errs = validateFields(currentValues());
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstError = document.querySelector(`.${styles.inputError}, .${styles.fileLabelError}`);
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!userName._id) {
      setMessage("Session not ready. Please wait a moment and try again.");
      return;
    }

    const formData = new FormData(blogForm.current);
    formData.append("authorId", userName._id);
    formData.set("tags", tags);
    setPending(true);

    const config = {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
    };

    try {
      let response;
      if (!existingBlog) {
        response = await publicReq.post("/sendPost", formData, config);
      } else {
        response = await publicReq.patch(`/update/${id}`, formData, config);
      }
      setMessage(response.data.message);
      setTimeout(() => { setMessage(""); navigate("/blogList"); }, 2500);
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
  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;

  const fieldClass = (field) =>
    `${styles.input} ${touched[field] && errors[field] ? styles.inputError : ""}`;

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
        <form ref={blogForm} onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form} noValidate>
          <div className={styles.mainCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Post Details</h3>

              {/* Title */}
              <div className={styles.formGroup}>
                <label htmlFor="title">
                  Blog Title <span className={styles.required}>*</span>
                  <span className={styles.charCount}>{title.length}/120</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur("title")}
                  placeholder="Enter a compelling title..."
                  className={fieldClass("title")}
                  maxLength={120}
                />
                {touched.title && errors.title && (
                  <span className={styles.fieldError}>⚠ {errors.title}</span>
                )}
              </div>

              {/* Excerpt */}
              <div className={styles.formGroup}>
                <label htmlFor="excerpt">
                  Excerpt / Short Summary
                  <span className={styles.charCount}>{excerpt.length}/200</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows="2"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  onBlur={() => handleBlur("excerpt")}
                  placeholder="Write a short description for blog listings (optional)..."
                  className={fieldClass("excerpt")}
                  maxLength={200}
                />
                {touched.excerpt && errors.excerpt ? (
                  <span className={styles.fieldError}>⚠ {errors.excerpt}</span>
                ) : (
                  <span className={styles.hint}>Displayed as the blog card preview. Max 200 characters.</span>
                )}
              </div>

              {/* Body */}
              <div className={styles.formGroup}>
                <label htmlFor="body">
                  Blog Content <span className={styles.required}>*</span>
                  {bodyText && (
                    <span className={styles.readTime}>~{estimateReadTime(bodyText)} min read</span>
                  )}
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows="16"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  onBlur={() => handleBlur("body")}
                  placeholder="Write your blog content here..."
                  className={`${fieldClass("body")} ${styles.bodyArea}`}
                />
                {touched.body && errors.body ? (
                  <span className={styles.fieldError}>⚠ {errors.body}</span>
                ) : (
                  <span className={styles.hint}>
                    {wordCount} word{wordCount !== 1 ? "s" : ""}
                    {wordCount > 0 && wordCount < 30 && (
                      <span className={styles.hintWarn}> — minimum 30 words required</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sideCol}>
            {/* Publish */}
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
                <label htmlFor="date">
                  Publication Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => handleBlur("date")}
                  className={fieldClass("date")}
                />
                {touched.date && errors.date && (
                  <span className={styles.fieldError}>⚠ {errors.date}</span>
                )}
              </div>

              <button type="submit" className={styles.publishBtn} disabled={pending}>
                {pending
                  ? <><span className={styles.btnSpinner}></span> {isEdit ? "Updating..." : "Publishing..."}</>
                  : isEdit ? "Update Post" : "Publish Post"
                }
              </button>
            </div>

            {/* Category & Tags */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Category & Tags</h3>

              <div className={styles.formGroup}>
                <label htmlFor="category">
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onBlur={() => handleBlur("category")}
                  className={fieldClass("category")}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <span className={styles.fieldError}>⚠ {errors.category}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
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

            {/* Cover Image */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                Cover Image <span className={styles.required}>*</span>
              </h3>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Cover preview" />
                </div>
              )}
              <label className={`${styles.fileLabel} ${touched.image && errors.image ? styles.fileLabelError : ""}`}>
                <span>{imagePreview ? "Change Image" : "Choose Image"}</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
              {touched.image && errors.image ? (
                <span className={styles.fieldError}>⚠ {errors.image}</span>
              ) : (
                <span className={styles.hint}>JPG, PNG, WebP. Max 5MB. Recommended 1200×630px.</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
