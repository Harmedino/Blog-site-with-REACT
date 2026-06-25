import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";
import { publicRequest } from "../request";
import Category from "./category/Category";
import classes from "./Display.module.css";
import Review from "./Review";

const topics = [
  { icon: "💻", label: "Technology", count: "120+ articles" },
  { icon: "✈️", label: "Travel", count: "80+ articles" },
  { icon: "🍽️", label: "Food", count: "65+ articles" },
  { icon: "💪", label: "Health", count: "90+ articles" },
  { icon: "🎨", label: "Design", count: "55+ articles" },
  { icon: "📈", label: "Business", count: "75+ articles" },
];

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [fail, setFail] = useState("");
  const [pending, setPending] = useState(true);
  const [cate, setCate] = useState("");
  const publicReq = publicRequest();

  useEffect(() => {
    fetching();
  }, []);

  async function fetching() {
    try {
      const { data } = await publicReq.get("/getBlog");
      setBlogs(data);
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
    }
  }

  function handleFilter(event) {
    const clicked = event.target.innerText;
    setCate(prev => prev === clicked ? "" : clicked);
  }

  const filteredBlogs = cate
    ? blogs.filter((blog) => blog.category === cate)
    : blogs;

  return (
    <>
      <HeaderBlog />
      <Category onClick={handleFilter} activeCate={cate} />
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>
            {cate ? <><span>{cate}</span> Posts</> : "Recent Posts"}
          </h2>
          {!pending && !fail && (
            <span className={classes.sectionCount}>
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <main className={classes.bloglist}>
          {pending && (
            <div className={classes.loadingState}>
              <div className={classes.spinner}></div>
              Loading posts...
            </div>
          )}
          {fail && (
            <div className={classes.emptyState}>
              <h3>Unable to load posts</h3>
              <p>{fail}</p>
            </div>
          )}
          {!pending && !fail && filteredBlogs.length === 0 && (
            <div className={classes.emptyState}>
              <h3>No posts found</h3>
              <p>{cate ? `No published posts in "${cate}" yet.` : "No published posts yet."}</p>
            </div>
          )}
          {filteredBlogs.map((blog) => (
            <div className={classes.blogcard} key={blog._id}>
              <div className={classes.blogimage}>
                <img src={blog.image} alt={blog.title} />
                <span className={classes.categoryBadge}>{blog.category}</span>
              </div>
              <div className={classes.blogcontent}>
                <h2>{blog.title}</h2>
                <p>{blog.body.slice(0, 100)}...</p>
                <div className={classes.blogmeta}>
                  <span className={classes.blogdate}>
                    📅 {blog.date}
                  </span>
                  <Link
                    to={`/more/${blog._id}?${blog.title}`}
                    className={classes.readmore}
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Topics Section */}
      <section className={classes.topicsSection}>
        <div className={classes.topicsInner}>
          <div className={classes.topicsHeader}>
            <span className={classes.topicsBadge}>Explore by Topic</span>
            <h2>Find Your Next Read</h2>
            <p>Browse our curated categories and discover stories that match your interests.</p>
          </div>
          <div className={classes.topicsGrid}>
            {topics.map((t) => (
              <div className={classes.topicCard} key={t.label}>
                <span className={classes.topicIcon}>{t.icon}</span>
                <strong className={classes.topicLabel}>{t.label}</strong>
                <span className={classes.topicCount}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Write CTA Section */}
      <section className={classes.ctaSection}>
        <div className={classes.ctaInner}>
          <div className={classes.ctaText}>
            <span className={classes.ctaBadge}>Share Your Story</span>
            <h2>Have something to say?</h2>
            <p>Join hundreds of writers on Harmedino and share your knowledge, experiences, and passions with readers around the world.</p>
            <div className={classes.ctaActions}>
              <Link to="/" className={classes.ctaBtnPrimary}>Start Writing Today</Link>
              <Link to="/blogs" className={classes.ctaBtnSecondary}>Read First</Link>
            </div>
          </div>
          <div className={classes.ctaVisual}>
            <img
              src="https://picsum.photos/seed/harmedino-write/500/360"
              alt="Write your story"
              className={classes.ctaImage}
            />
            <div className={classes.ctaImageOverlay}>
              <span className={classes.ctaOverlayIcon}>✍️</span>
              <span>Your story matters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={classes.newsletterSection}>
        <div className={classes.newsletterInner}>
          <span className={classes.newsletterBadge}>Stay Updated</span>
          <h2>Never miss a great story</h2>
          <p>Get the best articles delivered straight to your inbox every week. No spam, just great reading.</p>
          <form className={classes.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={classes.newsletterInput}
            />
            <button type="submit" className={classes.newsletterBtn}>Subscribe Free</button>
          </form>
          <span className={classes.newsletterNote}>Join 10,000+ readers. Unsubscribe any time.</span>
        </div>
      </section>

      <Review />
    </>
  );
};

export default DisplayBlogs;
