import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";
import { publicRequest} from "../request";
import Category from "./category/Category";
import classes from "./Display.module.css";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [fail, setFail] = useState("");
  const [pending, setPending] = useState(true);
  const [Cate, setCate] = useState("");
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
    setCate(event.target.innerText);
  }

  const filteredBlogs = Cate
    ? blogs.filter((blog) => blog.category === Cate)
    : blogs;

  return (
    <>
      <HeaderBlog />
      <Category onClick={handleFilter} />
      <div className="blog-details">
        <div className="container">
          <h1 className="head">Recent Posts</h1>
          <main className={classes.bloglist}>
            {pending && <h3>Loading...</h3>}
            {fail && <div>{fail}</div>}
            {filteredBlogs.length === 0 ? <h3>No published blogs</h3> :
              (
                filteredBlogs.map((blog) => (
                  <div className={classes.blogcard} key={blog._id}>
                    <div className={classes.blogimage}>
                      <img
                        src={blog.image}
                        alt="Blog Post"
                      />
                    </div>
                    <div className={classes.blogcontent}>
                      <h2>{blog.title}</h2>
                      <p>{blog.body.slice(0, 30)} ...</p>
                      <div className={classes.blogdetails}>
                        <span className={classes.category}>{blog.category}</span>
                        <small>{blog.date}</small>
                      </div>
                      <Link
                        to={`/more/${blog._id}?${blog.title}`}
                        className={classes.readmore}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))
              )}
          </main>
        </div>
      </div>
    </>
  );
};

export default DisplayBlogs;
