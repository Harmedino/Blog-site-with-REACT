import React, { useEffect } from "react";
import { useState } from "react";
import { Link,useRouteLoaderData } from "react-router-dom";
import { publicRequest,BaseUrl } from "../../request";


const Approved = () => {
  const [blogs, setBlogs] = useState();
  const [fail, setFail] = useState();
  const [pending, setPending] = useState(true);
  const [id, setId] = useState();
  const token= useRouteLoaderData("root");
  const publicReq = publicRequest();

  useEffect(() => {
    verifyToken()
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      fetching(); 
    }
  }, [id]);

  const verifyToken = async () => {
    try {
      const response = await publicReq.post(
        "/verifyToken",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setId(response.data.message._id);
      
    } catch (error) {
      console.error("Token verification error:", error.message);
    } 
    
  };

  async function fetching() {
    try {
     
        const { data } = await publicReq.get(`/getUserBlog/${id}`);
      setBlogs(data);
      
    } catch (error) {
      setFail(error.message);
    } finally {
      setPending(false);
    }
  }



  return (
    <div className="blog-details">
      <h3 className="ourBlog">Our Blog</h3> <hr />
      <main className="blog-list">
        {pending && <h1>Loading...</h1>}
        {fail && <div>{fail}</div>}
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
                  
                  <p>Publication Status: Approved</p>
                  <Link to={`/more/${blog._id}?${blog.title}`}>Read more ...</Link>
                </div>
              </div>
            ))}
        {!pending && blogs && blogs.length === 0 && <div>No approved blogs</div>}
      </main>
    </div>
  );
  
};

export default Approved;
