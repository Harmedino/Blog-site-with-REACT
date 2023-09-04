import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../UI/Message";
import { getAuthToken } from "../lib/token";
import { publicRequest } from "../request";

const CreateBlog = () => {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const blogValue = useRef();
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const token = getAuthToken()
  const publicReq = publicRequest();
  const { id } = useParams();
  const [userName, setuserName] = useState('')

  
  useEffect(() => {
    const fetchedCategories = ["Technology", "Travel", "Fashion"];
    setCategories(fetchedCategories);
    if (id) {
      getIndex();
    }
  }, [id]);

  async function getIndex() {
  
    try {
      const response = await publicReq.get(`http://localhost:5000/getBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
      setData(data);
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching data:", error.message);
    }
  }

  useEffect(() => {
    verifyToken();
  }, []);

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
      setuserName(response.data.message);
    } catch (error) {
      console.error("Token verification error:", error.message);
    }
  };

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // Add the authorization header
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(blogValue.current);
    setPending(true);
    formData.append("authorId", userName._id);

    if (!data) {
      try {

        const response = await publicReq.post("/sendPost", formData, config);

        setMessage(response.data.message);
        console.log(response.data);
        setTimeout(() => {
          setMessage("");
          navigate(`/profile/published`);
        }, 3000);
      } catch (error) {
        setMessage(error.response.data.message);
        setTimeout(() => {
          if (
            error.response.data.message ===
            "Unauthorized. Token missing or invalid."
          ) {
            navigate(`/Auth?mode=login`);
          }
          setMessage("");
        }, 5000);
      }
    } else {
      try {
        const response = await publicReq.patch(
          `/update/${id}`,
          formData,
          config
        );
        setMessage(response.data.message);
        setTimeout(() => {
          setMessage("");
          navigate(`/blogList`);
        }, 3000);
      } catch (error) {
        setMessage(error.response.data.message);
        setTimeout(() => {
          if (
            error.response.data.message ===
            "Unauthorized. Token missing or invalid."
          ) {
            navigate(`/Auth?mode=login`);
          }
          setMessage("");
        }, 3000);
      }
    }
    setPending(false);
  };

  return (
    <>
      {message && <Message message={message}></Message>}
      <div className="create">
        <h2>Create a new blog</h2>
        <form
          onSubmit={handleSubmit}
          ref={blogValue}
          encType="multipart/form-data"
        >
          <label>Blog title</label>
          <input
            type="text"
            required
            name="title"
            defaultValue={data ? data.title : ""}
            placeholder="Enter blog title"
          />
          <label>Category:</label>
          <select required name="category">
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} defaultValue={data ? data.category : ""}>
                {category}
              </option>
            ))}
          </select>
          <label>Blog body:</label>
          <textarea
            cols="30"
            rows="10"
            required
            defaultValue={data ? data.body : ""}
            name="body"
            placeholder="Write your blog content"
          ></textarea>

          <label>Author : {userName.username}</label>
          <input
            type="hidden"
            required
            name="author"
            defaultValue={data ? data.author : userName.username}
            
          />
          <label>Publication Date:</label>
          <input type="date" name="date" defaultValue={data ? data.date : ""} />

          <input
            type="file"
            name="image"
            required
            defaultValue={data ? data.image.data : ""}
          />
          {!pending && !data && <button>Add Blog</button>}
          {!pending && data && <button>Update Blog</button>}
          {pending && !data && <button>Add Blog ...</button>}
          {pending && data && <button>Updating Blog ...</button>}
        </form>
      </div>
    </>
  );
};

export default CreateBlog;
