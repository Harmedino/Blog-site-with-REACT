
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";
import { publicRequest,BaseUrl } from "../request";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  
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
  const formatPublicationDate = (date) => {
    const currentDate = new Date();
    const publicationDate = new Date(date);

    const timeDifferenceInSeconds = (currentDate - publicationDate) / 1000;

    if (timeDifferenceInSeconds < 60) {
      return "today";
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return "today";
    } else if (timeDifferenceInSeconds < 2592000) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} ${days === 1 ? "today" : "days"} ago`;
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
    <><HeaderBlog />
    <div className="blog-details">
  <h3 className="ourBlog"> Our Blogs</h3> <hr  className="hr"/>  
  <main className="blog-list">
      {pending && <div>Loading...</div>}
      {fail && <div>{fail}</div>}
      {blogs && blogs.length === 0 && <div>No published blogs</div>}
      {blogs &&
        blogs
          .filter((blog) => blog.publication) // Filter only approved blogs
          .map((blog, index) => (
            <div className="blog-card" key={blog._id}>
              <div className="blog-image">
                <img
                  src={`${BaseUrl}uploads/${blog.image.data}`}
                  alt="Blog Post"
                />
              </div>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p>{blog.body.slice(0, 200)}...</p>
                <p>{formatPublicationDate(blog.date)}</p>
                <Link to={`/more/${blog._id}?${blog.title}`}>Read more ...</Link>
              </div>
            </div>
          ))}
    </main>
</div>
</>
  );
};

export default DisplayBlogs;
