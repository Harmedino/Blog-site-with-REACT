import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";
import { publicRequest } from "../request";
import Category from "./category/Category";
import classes from "./Display.module.css";
import Review from "./Review";

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
      <Review />
    </>
  );
};

export default DisplayBlogs;
