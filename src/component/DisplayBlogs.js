import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetching();
  }, []);

  async function fetching() {
    try {
      const { data } = await axios.get("http://localhost:5000/getBlog");

      setBlogs(data);
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="blog-details">
      <HeaderBlog> </HeaderBlog>
      <main className="blog-list">
        {pending && <div> Loading... </div>}
        {fail && <div>{fail}</div>}
        {blogs &&
          blogs.map((blogs) => (
            <div className="blog-post" key={blogs._id}>
              <img src="blog-image.jpg" alt="Blog Post" />
              <h2>{blogs.title}</h2>
              <p> {blogs.body.slice(0, 200)}...</p>
              <Link to={"more/" + blogs._id + "?" + blogs.title}>
                Read more ...
              </Link>
            </div>
          ))}
        {/* {blogs &&
        blogs.map((blogs) => (
          <article key={blogs._id}>
            <h2>{blogs.title}</h2>
            <p>Written by {blogs.author}</p>
            <div style={{ whiteSpace: "pre-line" }}>
              {blogs.body.slice(0, 200)}...
            </div>
            <Link to={"more/" + blogs._id + "?" + blogs.title}>
              Read more ...
            </Link>
          </article>
        ))} */}
      </main>
    </div>
  );
};

export default DisplayBlogs;
