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
      setBlogs(data);
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
      // console.log(image);
    }
  }
  const formatPublicationDate = (date) => {
    const currentDate = new Date();
    const publicationDate = new Date(date);

    const timeDifferenceInSeconds = (currentDate - publicationDate) / 1000;

    if (timeDifferenceInSeconds < 60) {
      return "just now";
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (timeDifferenceInSeconds < 2592000) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[publicationDate.getMonth()];
      return `last ${month}`;
    }
  };

  return (
    <div className="blog-details">
      <main className="blog-list">
        {pending && <div>Loading...</div>}
        {fail && <div>{fail}</div>}
        {blogs &&
          blogs.map((blog, index) => (
            <div className="blog-card" key={blog._id}>
              <div className="blog-image">
                <img
                  src={`http://localhost:5000/uploads/${blog.image.data}`}
                  alt="Blog Post"
                />
              </div>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p>{blog.body.slice(0, 200)}...</p>
                <p>Publication Date: {formatPublicationDate(blog.date)}</p>
                <Link to={`more/${blog._id}?${blog.title}`}>Read more ...</Link>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
};

export default DisplayBlogs;
