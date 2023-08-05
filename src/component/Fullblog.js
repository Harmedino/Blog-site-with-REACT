import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Fullblog = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetching();
  }, []);

  async function fetching() {
    try {
      const res = await fetch("http://localhost:5000/getBlog/" + id);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
    }
  }

  async function handleClick(id) {
    try {
      await fetch("http://localhost:5000/deleteBlog/" + id, {
        method: "DELETE",
      });
      fetching();
    } catch (err) {
      alert(err.message);
    }
  }
  function handleEdit(id) {
    navigate(`/${id}`);
  }
  return (
    <div className="blog-details">
      {pending && <div> Loading... </div>}
      {fail && <div>{fail}</div>}
      {blogs && (
        <article>
          <h2>{blogs.title}</h2>
          <p>Written by {blogs.author}</p>
          <div style={{ whiteSpace: "pre-line" }}>{blogs.body}</div>
          <button onClick={() => handleClick(blogs._id)}> Delete</button>
          <button onClick={() => handleEdit(blogs._id)}>Edit</button>
        </article>
      )}
    </div>
  );
};

export default Fullblog;
