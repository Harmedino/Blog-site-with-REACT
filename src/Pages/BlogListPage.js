import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../request";
import { categoes } from "../component/category/Catogries";
import styles from "./BlogListPage.module.css";

const categoryIcons = {
  Technology: "💻",
  Travel: "✈️",
  Fashion: "👗",
  Food: "🍔",
  Lifestyle: "🌿",
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [pending, setPending] = useState(true);
  const [fail, setFail] = useState("");
  const [search, setSearch] = useState("");
  const [activeCate, setActiveCate] = useState("");
  const publicReq = publicRequest();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    if (activeCate) result = result.filter((b) => b.category === activeCate);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.excerpt || b.body).toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [blogs, activeCate, search]);

  const fetchBlogs = async () => {
    try {
      const { data } = await publicReq.get("/getBlog");
      setBlogs(data);
      setFiltered(data);
    } catch (err) {
      setFail(err.message);
    } finally {
      setPending(false);
    }
  };

  const toggleCategory = (name) => {
    setActiveCate((prev) => (prev === name ? "" : name));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1>All Blog Posts</h1>
          <p>Browse all articles — use the search bar or filter by category.</p>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by title, content, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch("")}>×</button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3>Categories</h3>
            <div className={styles.catList}>
              <button
                className={`${styles.catBtn} ${!activeCate ? styles.catBtnActive : ""}`}
                onClick={() => setActiveCate("")}
              >
                All Posts
              </button>
              {categoes.map((cat) => (
                <button
                  key={cat.name}
                  className={`${styles.catBtn} ${activeCate === cat.name ? styles.catBtnActive : ""}`}
                  onClick={() => toggleCategory(cat.name)}
                >
                  {categoryIcons[cat.name] || "📌"} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <h3>Stats</h3>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Posts</span>
                <strong>{blogs.length}</strong>
              </div>
              {categoes.map((cat) => (
                <div className={styles.statItem} key={cat.name}>
                  <span className={styles.statLabel}>{cat.name}</span>
                  <strong>{blogs.filter((b) => b.category === cat.name).length}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.resultsBar}>
            <span>
              {pending ? "Loading..." : `${filtered.length} post${filtered.length !== 1 ? "s" : ""}`}
              {activeCate && ` in "${activeCate}"`}
              {search && ` matching "${search}"`}
            </span>
            {(activeCate || search) && (
              <button className={styles.clearFilters} onClick={() => { setActiveCate(""); setSearch(""); }}>
                Clear all filters
              </button>
            )}
          </div>

          {pending && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div> Loading posts...
            </div>
          )}

          {fail && (
            <div className={styles.emptyState}>
              <h3>Could not load posts</h3><p>{fail}</p>
            </div>
          )}

          {!pending && !fail && filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No posts found</h3>
              <p>Try adjusting your search or clearing the filters.</p>
            </div>
          )}

          <div className={styles.grid}>
            {filtered.map((blog) => (
              <article className={styles.card} key={blog._id}>
                <div className={styles.cardImage}>
                  <img src={blog.image} alt={blog.title} loading="lazy" />
                  <span className={styles.catBadge}>{blog.category}</span>
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{blog.title}</h2>
                  <p className={styles.cardExcerpt}>
                    {blog.excerpt || blog.body.slice(0, 110)}...
                  </p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaAuthor}>✍️ {blog.author}</span>
                    <span className={styles.metaDate}>📅 {blog.date}</span>
                  </div>
                  <Link to={`/more/${blog._id}`} className={styles.readBtn}>
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogListPage;
