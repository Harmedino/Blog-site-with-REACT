
import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "./HeaderBlog";
import { publicRequest,BaseUrl } from "../request";
import Category from "./category/Category";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const [Cate, setCate]= useState()
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

  function handleFilter(event) {
    setCate(event.target.innerText)
}

  return (
    <><HeaderBlog />
      <Category onClick={ handleFilter } />
      <div className="blog-details"> 
        <div className="container">
      <h1 className="head">Recent Posts</h1>
        <main className="blog-list">
          
      {pending && <div>Loading...</div>}
      {fail && <div>{fail}</div>}
      {blogs && blogs.length === 0 && <div>No published blogs</div>}
      {blogs &&
        blogs.map((blog, index) => (
            <div className="blog-card" key={blog._id}>
              <div className="blog-image">
                <img
                  src={`${BaseUrl}uploads/${blog.image.data}`}
                  alt="Blog Post"
                />
              </div>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p>{blog.body.slice(0, 30)}...</p>
                <p>{formatPublicationDate(blog.date)}</p>
                <Link to={`/more/${blog._id}?${blog.title}`}>Read more ...</Link>
              </div>
            </div>
          ))}
    </main>

</div>
</div>
</>
  );
};

export default DisplayBlogs;
