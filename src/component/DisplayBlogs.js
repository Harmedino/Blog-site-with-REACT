import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetching();
  }, []);

  async function fetching() {
    try {
      const { data } = await axios.get("http://localhost:5000/getBlog");
      console.log(data);
      // setImage(data[2].image.data.image);
      setBlogs(data);
      console.log();
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
      // console.log(image);
    }
  }

  return (
    <div className="blog-details">
      <main className="blog-list">
        {pending && <div> Loading... </div>}
        {fail && <div>{fail}</div>}
        {blogs &&
          blogs.map((blogs, index) => (
            <div className="blog-post" key={blogs._id}>
              <img
                src={`http://localhost:5000/uploads/${blogs.image.data}`}
                alt="Blog Post"
              />
              <h2>{blogs.title}</h2>
              <p> {blogs.body.slice(0, 200)}...</p>
              <Link to={"more/" + blogs._id + "?" + blogs.title}>
                Read more ...
              </Link>
            </div>
          ))}
      </main>
    </div>
  );
};

export default DisplayBlogs;
